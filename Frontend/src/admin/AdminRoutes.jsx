import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";

// ==============================
// MAIN ADMIN DASHBOARD
// ==============================

import AdminDashboard from "./pages/AdminDashboard";

// ==============================
// ABOUT PAGES
// ==============================

import AboutDashboard from "./pages/about/AboutDashboard";
import HeroManagement from "./pages/about/HeroManagement";
import GalleryManagement from "./pages/about/GalleryManagement";
import AboutSectionManagement from "./pages/about/AboutSectionManagement";
import EthosManagement from "./pages/about/EthosManagement";
import GuidanceManagement from "./pages/about/GuidanceManagement";
import FAQManagement from "./pages/about/FAQManagement";
import FeedbackManagement from "./pages/about/FeedbackManagement";
import MessagesManagement from "./pages/about/MessagesManagement";

// ==============================
// SERVICES PAGES
// ==============================

import ServicesDashboard from "./pages/services/ServicesDashboard";
import ServicesHeroManagement from "./pages/services/HeroManagement";
import ProgramManagement from "./pages/services/ProgramManagement";
import TechManagement from "./pages/services/TechManagement";
import ClientsManagement from "./pages/services/ClientsManagement";
import ValuesManagement from "./pages/services/ValuesManagement";

// ==============================
// SCHOLARSHIPS PAGES
// ==============================

import ScholarshipDashboard from "./pages/scholarships/ScholarshipDashboard";
import ScholarshipHeroManagement from "./pages/scholarships/HeroManagement";
import Applications from "./pages/scholarships/Applications";
import FAQsManagement from "./pages/scholarships/FAQsManagement";

// ==============================
// EMPLOYERS PAGES
// ==============================

import EmployersHeroManagement from "./pages/employers/EmployersHeroManagement";
import EmployersHowItWorksManagement from "./pages/employers/EmployersHowItWorksManagement";
import EmployersCTAManagement from "./pages/employers/EmployersCTAManagement";

// ==============================
// CORPORATE TRAINING PAGES
// ==============================

import CorporateTrainingDashboard from "./pages/corporateTraining/CorporateTrainingDashboard";
import CorporateTrainingHeroManagement from "./pages/corporateTraining/CorporateTrainingHeroManagement";
import CorporateTrainingTopicsManagement from "./pages/corporateTraining/CorporateTrainingTopicsManagement";

// ==============================
// WEBSITE SETTINGS
// ==============================

import NavbarManagement from "./pages/settings/NavbarManagement";
import FooterManagement from "./pages/settings/FooterManagement";

// ==============================
// ADMIN LAYOUT
// ==============================

function AdminShell() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

// ==============================
// ADMIN ROUTES
// ==============================

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminShell />}>
        {/* ============================== */}
        {/* MAIN DASHBOARD */}
        {/* ============================== */}

        <Route index element={<AdminDashboard />} />

        {/* ============================== */}
        {/* ABOUT MANAGEMENT */}
        {/* ============================== */}

        <Route path="about">
          <Route index element={<AboutDashboard />} />
          <Route path="hero" element={<HeroManagement />} />
          <Route path="gallery" element={<GalleryManagement />} />
          <Route path="section" element={<AboutSectionManagement />} />
          <Route path="ethos" element={<EthosManagement />} />
          <Route path="guidance" element={<GuidanceManagement />} />
          <Route path="faq" element={<FAQManagement />} />
          <Route path="feedback" element={<FeedbackManagement />} />
          <Route path="messages" element={<MessagesManagement />} />
        </Route>

        {/* ============================== */}
        {/* SERVICES MANAGEMENT */}
        {/* ============================== */}

        <Route path="services">
          <Route index element={<ServicesDashboard />} />
          <Route path="hero" element={<ServicesHeroManagement />} />
          <Route path="program" element={<ProgramManagement />} />
          <Route path="tech" element={<TechManagement />} />
          <Route path="clients" element={<ClientsManagement />} />
          <Route path="values" element={<ValuesManagement />} />
        </Route>

        {/* ============================== */}
        {/* SCHOLARSHIPS MANAGEMENT */}
        {/* ============================== */}

        <Route path="scholarships">
          <Route index element={<ScholarshipDashboard />} />
          <Route path="hero" element={<ScholarshipHeroManagement />} />
          <Route path="applications" element={<Applications />} />
          <Route path="faqs" element={<FAQsManagement />} />
        </Route>

        {/* ============================== */}
        {/* EMPLOYERS MANAGEMENT */}
        {/* ============================== */}

        <Route path="employers">
          <Route index element={<Navigate to="hero" replace />} />

          <Route path="hero" element={<EmployersHeroManagement />} />

          <Route
            path="how-it-works"
            element={<EmployersHowItWorksManagement />}
          />

          <Route path="cta" element={<EmployersCTAManagement />} />
        </Route>

        {/* ============================== */}
        {/* CORPORATE TRAINING MANAGEMENT */}
        {/* ============================== */}

        <Route path="corporate-training">
          <Route index element={<CorporateTrainingDashboard />} />

          <Route path="hero" element={<CorporateTrainingHeroManagement />} />

          <Route
            path="topics"
            element={<CorporateTrainingTopicsManagement />}
          />
        </Route>

        {/* ============================== */}
        {/* WEBSITE SETTINGS */}
        {/* ============================== */}

        <Route path="settings">
          <Route index element={<Navigate to="navbar" replace />} />
          <Route path="navbar" element={<NavbarManagement />} />
          <Route path="footer" element={<FooterManagement />} />
        </Route>
      </Route>

      {/* ============================== */}
      {/* FALLBACK */}
      {/* ============================== */}

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
