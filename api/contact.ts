import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

type ContactBody = {
  name: string;
  email: string;
  phone?: string;
  product?: string;
  message: string;

  // honeypot
  website?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(input = ""): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isEmailLike(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  // 환경변수 체크 (안 해두면 배포에서 silent fail 자주남)
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      message: "서버 환경변수 설정이 필요합니다(RESEND_API_KEY).",
    });
  }

  const body = (req.body ?? {}) as Partial<ContactBody>;

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const product = String(body.product ?? "").trim();
  const message = String(body.message ?? "").trim();
  const website = String(body.website ?? "").trim(); // honeypot

  // 허니팟: 값이 있으면 봇으로 보고 차단
  if (website) {
    return res.status(400).json({ ok: false, message: "Spam blocked" });
  }

  // 필수값 검증
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, message: "필수값 누락" });
  }

  if (!isEmailLike(email)) {
    return res.status(400).json({ ok: false, message: "이메일 형식이 올바르지 않습니다" });
  }

  if (message.length > 4000) {
    return res.status(400).json({ ok: false, message: "메시지가 너무 깁니다(4000자 제한)" });
  }

  try {
    // HTML 안전 처리 + 줄바꿈 유지
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeProduct = escapeHtml(product || "-");
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br/>");

    const result = await resend.emails.send({
      // from: "화경마케팅 <contact@hwakyungmarketing.com>",
      from: "onboarding@resend.dev",
      to: "202017499@jbnu.ac.kr",
      subject: `[화경마케팅 문의] ${safeName}`,
      replyTo: email,
      html: `
        <h2>화경마케팅 문의</h2>
        <p><b>업체명(이름):</b> ${safeName}</p>
        <p><b>이메일:</b> ${safeEmail}</p>
        <p><b>전화번호:</b> ${safePhone || "-"}</p>
        <p><b>상품:</b> ${safeProduct}</p>
        <hr/>
        <p><b>내용:</b></p>
        <p>${safeMessage}</p>
      `,
    });

    console.log("RESEND_RESULT:", result);


    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "메일 전송 실패" });
  }
}