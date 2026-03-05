import React, { useEffect, useMemo, useState } from "react";
import {
  adminCreateClient,
  adminCreatePortfolio,
  adminDeleteClient,
  adminDeletePortfolio,
  adminGetClients,
  adminGetPortfolio,
  adminUpdateClient,
  adminUpdatePortfolio,
  setAdminToken,
  uploadImage,
} from "../api/admin";

import type { ClientDTO, PortfolioDTO } from "../api/admin";

type Tab = "portfolio" | "clients";

const LS_KEY = "hwakyung_admin_token";

export default function Admin() {
  const [tab, setTab] = useState<Tab>("portfolio");

  // auth
  const [token, setToken] = useState<string>(() => localStorage.getItem(LS_KEY) || "");
  const [pwInput, setPwInput] = useState("");

  // data
  const [portfolio, setPortfolio] = useState<PortfolioDTO[]>([]);
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string>("");

  // editor states
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioDTO | null>(null);
  const [editingClient, setEditingClient] = useState<ClientDTO | null>(null);

  useEffect(() => {
    if (!token) return;
    setAdminToken(token);
    void refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function refreshAll() {
    setLoading(true);
    setErrMsg("");
    try {
      const [p, c] = await Promise.all([adminGetPortfolio(), adminGetClients()]);
      setPortfolio(p);
      setClients(c);
    } catch (e: any) {
      setErrMsg(e?.message || "로드 실패");
    } finally {
      setLoading(false);
    }
  }

  function login() {
    const t = pwInput.trim();
    if (!t) return;
    setToken(t);
    localStorage.setItem(LS_KEY, t);
    setPwInput("");
  }

  function logout() {
    setToken("");
    localStorage.removeItem(LS_KEY);
    setPortfolio([]);
    setClients([]);
  }

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
          <h1 className="text-xl font-bold text-slate-900">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-500">관리자 비밀번호를 입력하세요.</p>

          <input
            className="mt-4 w-full rounded-lg border px-4 py-3"
            placeholder="Admin Password"
            type="password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />

          <button
            className="mt-4 w-full rounded-lg bg-black px-4 py-3 text-white font-semibold hover:opacity-90"
            onClick={login}
          >
            로그인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-900">Admin</h1>
          <button
            onClick={logout}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100"
          >
            로그아웃
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2">
          <TabButton active={tab === "portfolio"} onClick={() => setTab("portfolio")}>
            포트폴리오
          </TabButton>
          <TabButton active={tab === "clients"} onClick={() => setTab("clients")}>
            협력사
          </TabButton>
          <button
            onClick={() => void refreshAll()}
            className="ml-auto rounded-lg bg-white border px-4 py-2 text-sm font-semibold hover:bg-slate-100"
          >
            새로고침
          </button>
        </div>

        {errMsg && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700">
            {errMsg}
          </div>
        )}

        {loading ? (
          <div className="mt-8 text-slate-500">로딩중...</div>
        ) : tab === "portfolio" ? (
          <PortfolioPanel
            token={token}
            rows={portfolio}
            onCreated={(row) => setPortfolio((prev) => [row, ...prev])}
            onUpdated={(row) => setPortfolio((prev) => prev.map((x) => (x.id === row.id ? row : x)))}
            onDeleted={(id) => setPortfolio((prev) => prev.filter((x) => x.id !== id))}
            onEdit={(row) => setEditingPortfolio(row)}
            onCreate={() =>
              setEditingPortfolio({
                id: 0,
                title: "",
                image_url: "",
                read_more_url: null,
                is_main: false,
                category: [],
                created_at: new Date().toISOString(),
              })
            }
          />
        ) : (
          <ClientsPanel
            token={token}
            rows={clients}
            onCreated={(row) => setClients((prev) => [row, ...prev])}
            onUpdated={(row) => setClients((prev) => prev.map((x) => (x.id === row.id ? row : x)))}
            onDeleted={(id) => setClients((prev) => prev.filter((x) => x.id !== id))}
            onEdit={(row) => setEditingClient(row)}
            onCreate={() =>
              setEditingClient({
                id: 0,
                name: "",
                image_url: "",
                link_url: null,
                created_at: new Date().toISOString(),
              })
            }
          />
        )}

        {/* Modals */}
        {editingPortfolio && (
          <PortfolioModal
            token={token}
            initial={editingPortfolio}
            onClose={() => setEditingPortfolio(null)}
            onSaved={(row, mode) => {
              setEditingPortfolio(null);
              if (mode === "create") setPortfolio((prev) => [row, ...prev]);
              else setPortfolio((prev) => prev.map((x) => (x.id === row.id ? row : x)));
            }}
          />
        )}

        {editingClient && (
          <ClientModal
            token={token}
            initial={editingClient}
            onClose={() => setEditingClient(null)}
            onSaved={(row, mode) => {
              setEditingClient(null);
              if (mode === "create") setClients((prev) => [row, ...prev]);
              else setClients((prev) => prev.map((x) => (x.id === row.id ? row : x)));
            }}
          />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-lg px-4 py-2 text-sm font-semibold border",
        active ? "bg-black text-white border-black" : "bg-white text-slate-700 hover:bg-slate-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ---------------- Portfolio Panel ---------------- */

function PortfolioPanel({
  rows,
  onEdit,
  onCreate,
  onDeleted,
}: {
  token: string;
  rows: PortfolioDTO[];
  onEdit: (row: PortfolioDTO) => void;
  onCreate: () => void;
  onDeleted: (id: number) => void;
  onCreated: (row: PortfolioDTO) => void;
  onUpdated: (row: PortfolioDTO) => void;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => (r.title || "").toLowerCase().includes(s));
  }, [rows, q]);

  async function remove(id: number) {
    if (!confirm("삭제할까요?")) return;
    await adminDeletePortfolio(id);
    onDeleted(id);
  }

  return (
    <div className="mt-6 rounded-2xl bg-white p-5 shadow">
      <div className="flex items-center gap-3">
        <input
          className="w-full rounded-lg border px-4 py-2"
          placeholder="포트폴리오 검색 (제목)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button onClick={onCreate} className="rounded-lg bg-[#A11D18] px-4 py-2 text-white font-semibold hover:opacity-90">
          추가
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-3">이미지</th>
              <th className="py-3">제목</th>
              <th className="py-3">카테고리</th>
              <th className="py-3">메인</th>
              <th className="py-3">URL</th>
              <th className="py-3 text-right">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b last:border-b-0">
                <td className="py-3">
                  <img src={r.image_url} className="h-12 w-20 rounded object-cover border" />
                </td>
                <td className="py-3 font-semibold text-slate-900">{r.title}</td>
                <td className="py-3 text-slate-700">
                  {Array.isArray(r.category) ? r.category.join(", ") : ""}
                </td>
                <td className="py-3">{r.is_main ? "✅" : ""}</td>
                <td className="py-3">
                  {r.read_more_url ? (
                    <a className="text-blue-600 underline" href={r.read_more_url} target="_blank" rel="noreferrer">
                      링크
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-3 text-right">
                  <button onClick={() => onEdit(r)} className="mr-2 rounded-lg border bg-white px-3 py-1.5 hover:bg-slate-100">
                    수정
                  </button>
                  <button onClick={() => void remove(r.id)} className="rounded-lg border bg-white px-3 py-1.5 hover:bg-red-50 hover:text-red-600">
                    삭제
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td className="py-6 text-slate-500" colSpan={6}>
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PortfolioModal({
  token,
  initial,
  onClose,
  onSaved,
}: {
  token: string;
  initial: PortfolioDTO;
  onClose: () => void;
  onSaved: (row: PortfolioDTO, mode: "create" | "update") => void;
}) {
  const isCreate = initial.id === 0;

  const [title, setTitle] = useState(initial.title);
  const [imageUrl, setImageUrl] = useState(initial.image_url);
  const [readMoreUrl, setReadMoreUrl] = useState(initial.read_more_url || "");
  const [isMain, setIsMain] = useState(Boolean(initial.is_main));
  const [categoryText, setCategoryText] = useState((initial.category ?? []).join(", "));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onPickFile(file?: File | null) {
    if (!file) return;
    setBusy(true);
    setMsg("업로드 중...");
    try {
      const url = await uploadImage({ token, file, folder: "portfolio" });
      setImageUrl(url);
      setMsg("업로드 완료");
    } catch (e: any) {
      setMsg(e?.message || "업로드 실패");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setMsg("");

    try {
      const category = categoryText.trim(); // ✅ 배열 → 텍스트

      if (!title.trim()) throw new Error("제목 필수");
      if (!imageUrl.trim()) throw new Error("이미지 필수");

      if (isCreate) {
        const row = await adminCreatePortfolio({
          title: title.trim(),
          image_url: imageUrl.trim(),
          read_more_url: readMoreUrl.trim() ? readMoreUrl.trim() : null,
          is_main: isMain,
          category,
        });
        onSaved(row, "create");
      } else {
        const row = await adminUpdatePortfolio({
          id: initial.id,
          title: title.trim(),
          image_url: imageUrl.trim(),
          read_more_url: readMoreUrl.trim() ? readMoreUrl.trim() : null,
          is_main: isMain,
          category,
        });
        onSaved(row, "update");
      }
    } catch (e: any) {
      setMsg(e?.message || "저장 실패");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={isCreate ? "포트폴리오 추가" : "포트폴리오 수정"} onClose={onClose}>
      <div className="space-y-4">
        <Field label="제목">
          <input className="w-full rounded-lg border px-4 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>

        <Field label="카테고리 (쉼표로 구분)">
          <input
            className="w-full rounded-lg border px-4 py-2"
            value={categoryText}
            onChange={(e) => setCategoryText(e.target.value)}
            placeholder="예: 치과, 블로그"
          />
        </Field>

        <Field label="Read More URL (선택)">
          <input className="w-full rounded-lg border px-4 py-2" value={readMoreUrl} onChange={(e) => setReadMoreUrl(e.target.value)} />
        </Field>

        <Field label="메인 노출">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={isMain} onChange={(e) => setIsMain(e.target.checked)} />
            <span className="text-sm text-slate-700">메인에 노출</span>
          </label>
        </Field>

        <Field label="이미지">
          <div className="flex items-center gap-3">
            <input className="w-full rounded-lg border px-4 py-2" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="이미지 URL 또는 업로드" />
            <label className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100 cursor-pointer">
              업로드
              <input type="file" accept="image/*" className="hidden" onChange={(e) => void onPickFile(e.target.files?.[0])} />
            </label>
          </div>
          {imageUrl && <img src={imageUrl} className="mt-3 h-40 w-full rounded-lg object-cover border" />}
        </Field>

        {msg && <div className="text-sm text-slate-600">{msg}</div>}

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="rounded-lg border bg-white px-4 py-2 font-semibold hover:bg-slate-100">
            취소
          </button>
          <button
            disabled={busy}
            onClick={() => void save()}
            className="rounded-lg bg-black px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------- Clients Panel ---------------- */

function ClientsPanel({
  rows,
  onEdit,
  onCreate,
  onDeleted,
}: {
  token: string;
  rows: ClientDTO[];
  onEdit: (row: ClientDTO) => void;
  onCreate: () => void;
  onDeleted: (id: number) => void;
  onCreated: (row: ClientDTO) => void;
  onUpdated: (row: ClientDTO) => void;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => (r.name || "").toLowerCase().includes(s));
  }, [rows, q]);

  async function remove(id: number) {
    if (!confirm("삭제할까요?")) return;
    await adminDeleteClient(id);
    onDeleted(id);
  }

  return (
    <div className="mt-6 rounded-2xl bg-white p-5 shadow">
      <div className="flex items-center gap-3">
        <input
          className="w-full rounded-lg border px-4 py-2"
          placeholder="협력사 검색 (이름)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button onClick={onCreate} className="rounded-lg bg-[#A11D18] px-4 py-2 text-white font-semibold hover:opacity-90">
          추가
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-3">로고</th>
              <th className="py-3">이름</th>
              <th className="py-3">링크</th>
              <th className="py-3 text-right">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b last:border-b-0">
                <td className="py-3">
                  <img src={r.image_url} className="h-12 w-28 rounded object-contain border bg-white" />
                </td>
                <td className="py-3 font-semibold text-slate-900">{r.name}</td>
                <td className="py-3">
                  {r.link_url ? (
                    <a className="text-blue-600 underline" href={r.link_url} target="_blank" rel="noreferrer">
                      링크
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-3 text-right">
                  <button onClick={() => onEdit(r)} className="mr-2 rounded-lg border bg-white px-3 py-1.5 hover:bg-slate-100">
                    수정
                  </button>
                  <button onClick={() => void remove(r.id)} className="rounded-lg border bg-white px-3 py-1.5 hover:bg-red-50 hover:text-red-600">
                    삭제
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td className="py-6 text-slate-500" colSpan={4}>
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClientModal({
  token,
  initial,
  onClose,
  onSaved,
}: {
  token: string;
  initial: ClientDTO;
  onClose: () => void;
  onSaved: (row: ClientDTO, mode: "create" | "update") => void;
}) {
  const isCreate = initial.id === 0;

  const [name, setName] = useState(initial.name);
  const [imageUrl, setImageUrl] = useState(initial.image_url);
  const [linkUrl, setLinkUrl] = useState(initial.link_url || "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onPickFile(file?: File | null) {
    if (!file) return;
    setBusy(true);
    setMsg("업로드 중...");
    try {
      const url = await uploadImage({ token, file, folder: "clients" });
      setImageUrl(url);
      setMsg("업로드 완료");
    } catch (e: any) {
      setMsg(e?.message || "업로드 실패");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setMsg("");
    try {
      if (!name.trim()) throw new Error("이름 필수");
      if (!imageUrl.trim()) throw new Error("로고 필수");

      if (isCreate) {
        const row = await adminCreateClient({
          name: name.trim(),
          image_url: imageUrl.trim(),
          link_url: linkUrl.trim() ? linkUrl.trim() : null,
        });
        onSaved(row, "create");
      } else {
        const row = await adminUpdateClient({
          id: initial.id,
          name: name.trim(),
          image_url: imageUrl.trim(),
          link_url: linkUrl.trim() ? linkUrl.trim() : null,
        });
        onSaved(row, "update");
      }
    } catch (e: any) {
      setMsg(e?.message || "저장 실패");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={isCreate ? "협력사 추가" : "협력사 수정"} onClose={onClose}>
      <div className="space-y-4">
        <Field label="이름">
          <input className="w-full rounded-lg border px-4 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>

        <Field label="링크 URL (선택)">
          <input className="w-full rounded-lg border px-4 py-2" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
        </Field>

        <Field label="로고 이미지">
          <div className="flex items-center gap-3">
            <input className="w-full rounded-lg border px-4 py-2" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="이미지 URL 또는 업로드" />
            <label className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100 cursor-pointer">
              업로드
              <input type="file" accept="image/*" className="hidden" onChange={(e) => void onPickFile(e.target.files?.[0])} />
            </label>
          </div>
          {imageUrl && <img src={imageUrl} className="mt-3 h-28 w-full rounded-lg object-contain border bg-white" />}
        </Field>

        {msg && <div className="text-sm text-slate-600">{msg}</div>}

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="rounded-lg border bg-white px-4 py-2 font-semibold hover:bg-slate-100">
            취소
          </button>
          <button
            disabled={busy}
            onClick={() => void save()}
            className="rounded-lg bg-black px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------- UI helpers ---------------- */

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg border bg-white px-3 py-1.5 hover:bg-slate-100">
            닫기
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-bold text-slate-900">{label}</div>
      {children}
    </div>
  );
}