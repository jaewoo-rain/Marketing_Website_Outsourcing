// import React, { useState } from "react";
// import { useInViewOnce } from "../../hooks/useInViewOnce";

// function animClass({
//   inView,
//   delayMs,
//   from = "up",
// }: {
//   inView: boolean;
//   delayMs: number;
//   from?: "up" | "left" | "right";
// }) {
//   const base =
//     "transition-all duration-700 ease-out will-change-transform will-change-opacity";
//   const delay = `delay-[${delayMs}ms]`;

//   if (!inView) {
//     const translate =
//       from === "up"
//         ? "translate-y-8"
//         : from === "left"
//           ? "-translate-x-8"
//           : "translate-x-8";
//     return [base, delay, "opacity-0", translate, "blur-[2px]"].join(" ");
//   }

//   return [base, delay, "opacity-100", "translate-y-0", "translate-x-0", "blur-0"].join(" ");
// }

// const Contact: React.FC = () => {
//   const [company, setCompany] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone1, setPhone1] = useState("");
//   const [phone2, setPhone2] = useState("");
//   const [phone3, setPhone3] = useState("");
//   const [product, setProduct] = useState("STANDARD");
//   const [message, setMessage] = useState("");

//   const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.2 });

//   const onSub = () => {
//     const nextErrors = {
//       company: company.trim() === "",
//       email: email.trim() === "",
//       phone: phone1.trim() === "" || phone2.trim() === "" || phone3.trim() === "",
//     };

//     setErrors(nextErrors);

//     const hasError = Object.values(nextErrors).some(Boolean);
//     if (!hasError) {
//       console.log("성공 ", {
//         company,
//         email,
//         phone: `${phone1}-${phone2}-${phone3}`,
//         product,
//         message,
//       });
//     }
//   };

//   const [errors, setErrors] = useState({
//     company: false,
//     email: false,
//     phone: false,
//   });

//   const baseInput =
//     "text-black w-full bg-[#fff]/60 border-none rounded-sm px-4 py-4 focus:ring-1 focus:ring-gray-300 transition-all";
//   const errorRing = "ring-2 ring-[#A11D18]";

//   return (
//     <section
//       id="contact"
//       className="relative py-20 px-6 flex flex-col items-center overflow-hidden
//           bg-[url('/images/bg.png')] bg-[length:100%_100%]
//       "
//     >
//       <div ref={ref} className="w-full max-w-6xl">
//         {/* 상단 타이틀 섹션 */}
//         <div className={animClass({ inView, delayMs: 0, from: "right" }) + " text-center mb-24 py-20 lg:py-20 xl:py-24"}>
//           <h2 className="text-[56px] font-bold tracking-tight text-black mb-4">
//             문의하기
//           </h2>
//           <p className="text-lg text-black/50 font-medium">
//             문의사항이 있다면 언제든 편하게 연락주세요
//           </p>
//         </div>

//         {/* 본문 그리드 */}
//         <div
//           className={
//             animClass({ inView, delayMs: 120, from: "up" }) +
//             " grid md:grid-cols-2 gap-20 items-start"
//           }
//         >
//           {/* 왼쪽: 정보 섹션 */}
//           <div
//             className={
//               // 모바일에서는 위로, md 이상에서는 왼쪽에서 슬라이드
//               animClass({ inView, delayMs: 220, from: "left" }) +
//               " space-y-16 text-black"
//             }
//           >
//             <div>
//               <h3 className="text-[64px] font-bold leading-tight mb-8">
//                 Let's Talk
//               </h3>
//               <div className="text-[20px] space-y-1 font-medium text-black/80">
//                 <p>무엇을 도와드릴까요</p>
//                 <p>말씀만 해주세요</p>
//                 <p>빠른 조치 가능</p>
//               </div>
//             </div>

//             <div>
//               <h4 className="text-[32px] font-bold mb-4">Email</h4>
//               <p className="text-lg text-black/70">dlalsrud0614@naver.com</p>
//             </div>

//             <div>
//               <h4 className="text-[32px] font-bold mb-6">Socials</h4>
//               <div className="flex flex-col space-y-4 text-lg">
//                 <a
//                   href="#"
//                   className="text-black/70 hover:text-black border-b border-black w-fit leading-tight"
//                 >
//                   Instagram
//                 </a>
//                 <a
//                   href="#"
//                   className="text-black/70 hover:text-black border-b border-black w-fit leading-tight"
//                 >
//                   Twitter
//                 </a>
//                 <a
//                   href="#"
//                   className="text-black/70 hover:text-black border-b border-black w-fit leading-tight"
//                 >
//                   Facebook
//                 </a>
//               </div>
//             </div>
//           </div>

//           {/* 오른쪽: 입력 폼 */}
//           <div className={animClass({ inView, delayMs: 320, from: "right" }) + " w-full"}>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 onSub();
//               }}
//               className="space-y-8"
//             >
//               {/* 업체명 */}
//               <div className="space-y-2">
//                 <label className="text-[14px] font-bold text-black">
//                   업체명 (이름) *
//                 </label>
//                 <input
//                   type="text"
//                   value={company}
//                   onChange={(e) => {
//                     setCompany(e.target.value);
//                     if (errors.company)
//                       setErrors((prev) => ({ ...prev, company: false }));
//                   }}
//                   className={`${baseInput} ${errors.company ? errorRing : ""}`}
//                 />
//               </div>

//               {/* Email * */}
//               <div className="space-y-2">
//                 <label className="text-[14px] font-bold text-black">Email *</label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => {
//                     setEmail(e.target.value);
//                     if (errors.email)
//                       setErrors((prev) => ({ ...prev, email: false }));
//                   }}
//                   className={`${baseInput} ${errors.email ? errorRing : ""}`}
//                 />
//               </div>

//               {/* 연락처 * */}
//               <div className="space-y-2">
//                 <label className="text-[14px] font-bold text-black">연락처 *</label>

//                 <div
//                   className={`flex items-center gap-3 text-black ${errors.phone ? "ring-2 ring-[#A11D18] rounded-sm p-1" : ""
//                     }`}
//                 >
//                   <input
//                     type="text"
//                     placeholder="010"
//                     value={phone1}
//                     onChange={(e) => {
//                       setPhone1(e.target.value);
//                       if (errors.phone)
//                         setErrors((prev) => ({ ...prev, phone: false }));
//                     }}
//                     className="w-full bg-[#fff]/60 border-none rounded-sm px-4 py-4 text-center placeholder:text-gray-400"
//                   />
//                   <span className="text-gray-400 font-bold">—</span>
//                   <input
//                     type="text"
//                     value={phone2}
//                     onChange={(e) => {
//                       setPhone2(e.target.value);
//                       if (errors.phone)
//                         setErrors((prev) => ({ ...prev, phone: false }));
//                     }}
//                     className="w-full bg-[#fff]/60 border-none rounded-sm px-4 py-4 text-center"
//                   />
//                   <span className="text-gray-400 font-bold">—</span>
//                   <input
//                     type="text"
//                     value={phone3}
//                     onChange={(e) => {
//                       setPhone3(e.target.value);
//                       if (errors.phone)
//                         setErrors((prev) => ({ ...prev, phone: false }));
//                     }}
//                     className="w-full bg-[#fff]/60 border-none rounded-sm px-4 py-4 text-center"
//                   />
//                 </div>

//                 {errors.phone && (
//                   <p className="text-[12px] font-medium text-[#A11D18]">
//                     연락처를 모두 입력해주세요.
//                   </p>
//                 )}
//               </div>

//               {/* 상품 */}
//               <div className="space-y-2">
//                 <label className="text-[14px] font-bold text-black">상품</label>
//                 <div className="relative">
//                   <select
//                     value={product}
//                     onChange={(e) => setProduct(e.target.value)}
//                     className="w-full bg-[#fff]/60 border-none rounded-sm px-4 py-4 text-black appearance-none cursor-pointer"
//                   >
//                     <option>STANDARD</option>
//                     <option>DELUXE</option>
//                     <option>PREMIUM</option>
//                   </select>

//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
//                     <svg
//                       width="12"
//                       height="8"
//                       viewBox="0 0 12 8"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M1 1L6 6L11 1"
//                         stroke="black"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               {/* 문의내용 */}
//               <div className="space-y-2">
//                 <label className="text-[14px] font-bold text-black">문의내용</label>
//                 <textarea
//                   rows={6}
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   className={baseInput}
//                 />
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 className="w-full py-5 bg-[#a62118] hover:bg-[#8e1c14] text-white rounded-lg font-bold text-xl transition-all shadow-md active:scale-[0.98]"
//               >
//                 Submit
//               </button>
//             </form>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default Contact;


import React from "react";
import { useInViewOnce } from "../../hooks/useInViewOnce";
import ContactForm from "./ContactForm";
import { Helmet } from "react-helmet-async";

function animClass({
  inView,
  delayMs,
  from = "up",
}: {
  inView: boolean;
  delayMs: number;
  from?: "up" | "left" | "right";
}) {
  const base =
    "transition-all duration-700 ease-out will-change-transform will-change-opacity";
  const delay = `delay-[${delayMs}ms]`;

  if (!inView) {
    const translate =
      from === "up"
        ? "translate-y-8"
        : from === "left"
          ? "-translate-x-8"
          : "translate-x-8";
    return [base, delay, "opacity-0", translate, "blur-[2px]"].join(" ");
  }

  return [base, delay, "opacity-100", "translate-y-0", "translate-x-0", "blur-0"].join(" ");
}

const Contact: React.FC = () => {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section
      id="contact"
      className="relative py-20 px-6 flex flex-col items-center overflow-hidden
          bg-[url('/images/bg.png')] bg-[length:100%_100%]
      "
    >
      <Helmet>
        <title>마케팅 문의 | 화경마케팅</title>

        <meta name="description" content="블로그 마케팅, 플레이스 광고, 검색광고, 체험단 및 기자단 운영 등 온라인 마케팅 상담을 화경마케팅에 문의하세요." />

        <meta property="og:title" content="마케팅 상담 문의 | 화경마케팅" />
        <meta property="og:description" content="온라인 마케팅 상담 및 협업 문의를 환영합니다." />
      </Helmet>

      <div ref={ref} className="w-full max-w-6xl">
        {/* 상단 타이틀 섹션 */}
        <div className={animClass({ inView, delayMs: 0, from: "right" }) + " text-center mb-24 py-20 lg:py-20 xl:py-24"}>
          <h2 id="batang" className="text-[56px] font-bold tracking-tight text-black mb-4">
            문의하기
          </h2>
          <p className="text-lg text-black/50 font-medium">
            문의사항이 있다면 언제든 편하게 연락주세요
          </p>
        </div>

        {/* 본문 그리드 - 컴포넌트로 분리 */}
        <ContactForm className={animClass({ inView, delayMs: 120, from: "up" })} />
      </div>
    </section>
  );
};

export default Contact;