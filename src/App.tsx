import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Main from "./components/main/Main";
import About from "./components/About";
import Contact from "./components/contact/Contact";
import Admin from "./components/Admin";
import Footer from "./components/Footer";
import type { PortfolioItem } from "./types";
import Portfolio from "./components/portfolio/Portfolio";
import BusinessAreas from "./components/businessAreas/BusinessAreas";
import ScrollToTop from "./components/common/ScrollToTop";

// ✅ 추가: DB에서 메인 포트폴리오 가져오는 함수
import { getMainPortfolio } from "./api/portfolio";

const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  // ✅ 홈(Main)에서 쓸 메인 포폴: DB에서 로드
  useEffect(() => {
    (async () => {
      try {
        const rows = await getMainPortfolio();

        const mapped: PortfolioItem[] = rows.map((r) => ({
          id: r.id,
          title: r.title,
          imageUrl: r.image_url,
          readMoreUrl: r.read_more_url,
          isMain: r.is_main,
          category: r.category ?? [],
        }));

        setPortfolio(mapped);
      } catch (e) {
        console.error("메인 포트폴리오 로드 실패:", e);
        setPortfolio([]); // 실패시 빈 배열
      } finally {
      }
    })();
  }, []);

  // ✅ (중요) 지금 Admin의 add/delete는 로컬 state만 바꾸는 함수라
  // DB 반영까지 하려면 나중에 insert/delete API 붙여야 함.


  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen selection:bg-indigo-500 selection:text-white">
        <Navbar
          onAdminClick={() => setIsAdminView(!isAdminView)}
          isAdmin={isAdminView}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Main
                portfolio={portfolio}
              // 원하면 Main에서 loading UI 만들 수 있게 prop 추가도 가능
              />
            }
          />
          <Route path="/services" element={<BusinessAreas />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/admin"
            element={
              <Admin
              />
            }
          />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;