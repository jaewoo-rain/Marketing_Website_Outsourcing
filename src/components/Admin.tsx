import React, { useEffect, useState } from "react";
import type { PortfolioItem } from "../types.ts";
import { DEFAULT_PORTFOLIO } from "../constants/portfolio.ts";

interface AdminProps {
  onAddPortfolio: (item: PortfolioItem) => void;
  onDeletePortfolio: (id: number) => void;
}

const Admin: React.FC<AdminProps> = ({ onAddPortfolio, onDeletePortfolio }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string[]>(["병원"]);
  const [imageUrl, setImageUrl] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [portfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem("aura_portfolio");
    return saved ? JSON.parse(saved) : DEFAULT_PORTFOLIO;
  });

  useEffect(() => {
    localStorage.setItem("aura_portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    const newItem: PortfolioItem = {
      id: Date.now(),
      title,
      category,
      imageUrl,
    };

    onAddPortfolio(newItem);
    setTitle("");
    setImageUrl("");
    alert("포트폴리오가 등록되었습니다.");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="glass-card p-8 rounded-3xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">관리자 로그인</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full py-3 bg-indigo-600 rounded-xl font-bold">
              접속하기
            </button>
          </form>
          <p className="mt-4 text-xs text-slate-500 text-center">
            {/* Hint: admin123 */}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="glass-card p-8 rounded-3xl h-fit">
          <h2 className="text-2xl font-bold mb-6">포트폴리오 등록</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                업체명/제목
              </label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 강남 웰니스의원"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                카테고리
              </label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                value={category}
                onChange={(e) => setCategory([e.target.value])}
              >
                <option value="병원">병원</option>
                <option value="대학교">대학교</option>
                <option value="청소업체">청소업체</option>
                <option value="프랜차이즈">프랜차이즈</option>
                <option value="브랜드 블로그">브랜드 블로그</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                이미지 URL
              </label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <button className="w-full py-4 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition-colors">
              등록하기
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">등록된 포트폴리오 리스트</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {portfolio.map((item) => (
              <div
                key={item.id}
                className="glass-card p-4 rounded-2xl flex items-center justify-between border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    className="w-12 h-12 object-cover rounded-lg"
                    alt=""
                  />
                  <div>
                    <div className="font-bold text-sm">{item.title}</div>
                    <div className="text-xs text-slate-500">
                      {item.category}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onDeletePortfolio(item.id)}
                  className="text-red-400 hover:text-red-300 text-sm px-3 py-1"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
