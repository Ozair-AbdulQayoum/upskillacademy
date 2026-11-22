import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./assets/components/Navbar";
import AboutUpskill from "./assets/pages/About/AboutUpskill";
import UpskillServices from "./assets/pages/Services/UpskillServices";
import UpskillScholarships from "./assets/pages/Scholarships/UpskillScholarships";
import UpskillEmployer from "./assets/pages/Employers/UpskillEmployer";
import UpskillCorporteTraining from "./assets/pages/Corporate training/UpskillCorporteTraining";

import Footer from "./assets/components/Footer";
import AdminRoutes from "./admin/AdminRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC WEBSITE */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />

              <Routes>
                <Route path="/about" element={<AboutUpskill />} />
                <Route path="/services" element={<UpskillServices />} />
                <Route
                  path="/scholarship-applications"
                  element={<UpskillScholarships />}
                />
                <Route path="/employers" element={<UpskillEmployer />} />
                <Route
                  path="/corporate-training"
                  element={<UpskillCorporteTraining />}
                />
              </Routes>

              <Footer />
            </>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
