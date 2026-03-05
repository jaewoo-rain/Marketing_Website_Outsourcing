import React, { useState } from "react";
import { submitContact } from "../../api/Contact";

interface ContactFormProps {
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className = "" }) => {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [product, setProduct] = useState("STANDARD");
  const [message, setMessage] = useState("");
  // 허니팟 (숨김 필드)
  const [website, setWebsite] = useState("");

  // 전송 상태(중복 submit 방지)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    company: false,
    email: false,
    phone: false,
  });

  // onSub를 async로
  const onSub = async () => {
    const nextErrors = {
      company: company.trim() === "",
      email: email.trim() === "",
      phone: phone1.trim() === "" || phone2.trim() === "" || phone3.trim() === "",
    };

    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) return;

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await submitContact({
        name: company, // company -> name으로 보냄
        email,
        phone: `${phone1}-${phone2}-${phone3}`,
        product,
        message,
        website, // 허니팟
      });

      alert("문의가 전송되었습니다!");

      // 폼 초기화
      setCompany("");
      setEmail("");
      setPhone1("");
      setPhone2("");
      setPhone3("");
      setProduct("STANDARD");
      setMessage("");
      setWebsite("");
    } catch (e: any) {
      alert(e.message || "전송 실패");
    } finally {
      setIsSubmitting(false);
    }
  };

  const baseInput =
    "text-black w-full bg-[#fff]/60 border-none rounded-sm px-4 py-4 focus:ring-1 focus:ring-gray-300 transition-all";
  const errorRing = "ring-2 ring-[#A11D18]";

  return (
    <div className={`grid md:grid-cols-2 gap-20 items-start ${className}`}>
      {/* 왼쪽: 정보 섹션 */}
      <div className="space-y-16 text-black">
        <div>
          <h3 className="text-[64px] font-bold leading-tight mb-8">
            Let's Talk
          </h3>
          <div className="text-[20px] space-y-1 font-medium text-black/80">
            <p>무엇을 도와드릴까요</p>
            <p>말씀만 해주세요</p>
            <p>빠른 조치 가능</p>
          </div>
        </div>

        <div>
          <h4 className="text-[32px] font-bold mb-4">Email</h4>
          <p className="text-lg text-black/70">dlalsrud0614@naver.com</p>
        </div>

        <div>
          <h4 className="text-[32px] font-bold mb-6">Socials</h4>
          <div className="flex flex-col space-y-4 text-lg">
            <a
              href="#"
              className="text-black/70 hover:text-black border-b border-black w-fit leading-tight"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-black/70 hover:text-black border-b border-black w-fit leading-tight"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-black/70 hover:text-black border-b border-black w-fit leading-tight"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* 오른쪽: 입력 폼 */}
      <div className="w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSub();
          }}
          className="space-y-8"
        >
          {/* 업체명 */}
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-black">
              업체명 (이름) *
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                if (errors.company)
                  setErrors((prev) => ({ ...prev, company: false }));
              }}
              className={`${baseInput} ${errors.company ? errorRing : ""}`}
            />
          </div>

          {/* Email * */}
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-black">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email)
                  setErrors((prev) => ({ ...prev, email: false }));
              }}
              className={`${baseInput} ${errors.email ? errorRing : ""}`}
            />
          </div>

          {/* 연락처 * */}
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-black">연락처 *</label>

            <div
              className={`flex items-center gap-3 text-black ${errors.phone ? "ring-2 ring-[#A11D18] rounded-sm p-1" : ""
                }`}
            >
              <input
                type="text"
                placeholder="010"
                value={phone1}
                onChange={(e) => {
                  setPhone1(e.target.value);
                  if (errors.phone)
                    setErrors((prev) => ({ ...prev, phone: false }));
                }}
                className="w-full bg-[#fff]/60 border-none rounded-sm px-4 py-4 text-center placeholder:text-gray-400"
              />
              <span className="text-gray-400 font-bold">—</span>
              <input
                type="text"
                value={phone2}
                onChange={(e) => {
                  setPhone2(e.target.value);
                  if (errors.phone)
                    setErrors((prev) => ({ ...prev, phone: false }));
                }}
                className="w-full bg-[#fff]/60 border-none rounded-sm px-4 py-4 text-center"
              />
              <span className="text-gray-400 font-bold">—</span>
              <input
                type="text"
                value={phone3}
                onChange={(e) => {
                  setPhone3(e.target.value);
                  if (errors.phone)
                    setErrors((prev) => ({ ...prev, phone: false }));
                }}
                className="w-full bg-[#fff]/60 border-none rounded-sm px-4 py-4 text-center"
              />
            </div>

            {errors.phone && (
              <p className="text-[12px] font-medium text-[#A11D18]">
                연락처를 모두 입력해주세요.
              </p>
            )}
          </div>

          {/* 상품 */}
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-black">상품</label>
            <div className="relative">
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full bg-[#fff]/60 border-none rounded-sm px-4 py-4 text-black appearance-none cursor-pointer"
              >
                <option>STANDARD</option>
                <option>DELUXE</option>
                <option>PREMIUM</option>
              </select>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L6 6L11 1"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 문의내용 */}
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-black">문의내용</label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={baseInput}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-5 bg-[#a62118] hover:bg-[#8e1c14] text-white rounded-lg font-bold text-xl transition-all shadow-md active:scale-[0.98] ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;