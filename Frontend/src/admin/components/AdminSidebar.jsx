import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  FileText,
  Image,
  Images,
  Info,
  Target,
  Users,
  HelpCircle,
  MessageSquare,
  Inbox,
  Settings,
  ChevronDown,
  GraduationCap,
  ChevronLeft,
  Globe,
  PanelBottom,
  Code,
  Briefcase,
  Cpu,
  Star,
  Award,
  ListChecks,
  Megaphone,
  Building2,
} from "lucide-react";

// ==================================================
// ABOUT MENU
// ==================================================

const aboutItems = [
  { name: "Overview", path: "/admin/about", icon: LayoutDashboard },
  { name: "Hero Section", path: "/admin/about/hero", icon: Image },
  { name: "Gallery", path: "/admin/about/gallery", icon: Images },
  { name: "About Section", path: "/admin/about/section", icon: Info },
  { name: "Our Ethos", path: "/admin/about/ethos", icon: Target },
  { name: "Guidance", path: "/admin/about/guidance", icon: Users },
  { name: "FAQ", path: "/admin/about/faq", icon: HelpCircle },
  { name: "Feedback Form", path: "/admin/about/feedback", icon: MessageSquare },
  { name: "Messages", path: "/admin/about/messages", icon: Inbox },
];

// ==================================================
// SERVICES MENU
// ==================================================

const servicesItems = [
  { name: "Overview", path: "/admin/services", icon: LayoutDashboard },
  { name: "Hero Section", path: "/admin/services/hero", icon: Image },
  { name: "Program", path: "/admin/services/program", icon: Code },
  { name: "Tech", path: "/admin/services/tech", icon: Cpu },
  { name: "Clients", path: "/admin/services/clients", icon: Briefcase },
  { name: "Values", path: "/admin/services/values", icon: Star },
];

// ==================================================
// SCHOLARSHIPS MENU
// ==================================================

const scholarshipItems = [
  { name: "Overview", path: "/admin/scholarships", icon: LayoutDashboard },
  { name: "Hero Section", path: "/admin/scholarships/hero", icon: Image },
  {
    name: "Applications",
    path: "/admin/scholarships/applications",
    icon: Users,
  },
  { name: "FAQs", path: "/admin/scholarships/faqs", icon: HelpCircle },
];

// ==================================================
// EMPLOYERS MENU
// ==================================================

const employersItems = [
  { name: "Overview", path: "/admin/employers", icon: LayoutDashboard },
  { name: "Hero Section", path: "/admin/employers/hero", icon: Image },
  {
    name: "How It Works",
    path: "/admin/employers/how-it-works",
    icon: ListChecks,
  },
  { name: "CTA Management", path: "/admin/employers/cta", icon: Megaphone },
];

// ==================================================
// CORPORATE TRAINING MENU
// ==================================================

const corporateTrainingItems = [
  {
    name: "Overview",
    path: "/admin/corporate-training",
    icon: LayoutDashboard,
  },
  { name: "Hero Section", path: "/admin/corporate-training/hero", icon: Image },
  {
    name: "Topics Section",
    path: "/admin/corporate-training/topics",
    icon: ListChecks,
  },
];

// ==================================================
// SETTINGS MENU
// ==================================================

const settingsItems = [
  { name: "Navbar Management", path: "/admin/settings/navbar", icon: Globe },
  {
    name: "Footer Management",
    path: "/admin/settings/footer",
    icon: PanelBottom,
  },
];

// ==================================================
// ADMIN SIDEBAR
// ==================================================

export default function AdminSidebar({ collapsed = false, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;

  // ==================================================
  // ACTIVE ROUTE STATES
  // ==================================================

  const isDashboardActive = pathname === "/admin";

  const isAboutActive = pathname.startsWith("/admin/about");
  const isServicesActive = pathname.startsWith("/admin/services");
  const isScholarshipsActive = pathname.startsWith("/admin/scholarships");
  const isEmployersActive = pathname.startsWith("/admin/employers");
  const isCorporateTrainingActive = pathname.startsWith(
    "/admin/corporate-training",
  );
  const isSettingsActive = pathname.startsWith("/admin/settings");

  // ==================================================
  // DROPDOWN STATES
  // ==================================================

  const [aboutOpen, setAboutOpen] = useState(isAboutActive);
  const [servicesOpen, setServicesOpen] = useState(isServicesActive);
  const [scholarshipsOpen, setScholarshipsOpen] =
    useState(isScholarshipsActive);
  const [employersOpen, setEmployersOpen] = useState(isEmployersActive);
  const [corporateTrainingOpen, setCorporateTrainingOpen] = useState(
    isCorporateTrainingActive,
  );
  const [settingsOpen, setSettingsOpen] = useState(isSettingsActive);

  // ==================================================
  // AUTOMATICALLY OPEN ACTIVE MENU
  // ==================================================

  useEffect(() => {
    if (isAboutActive) setAboutOpen(true);
    if (isServicesActive) setServicesOpen(true);
    if (isScholarshipsActive) setScholarshipsOpen(true);
    if (isEmployersActive) setEmployersOpen(true);
    if (isCorporateTrainingActive) setCorporateTrainingOpen(true);
    if (isSettingsActive) setSettingsOpen(true);
  }, [
    pathname,
    isAboutActive,
    isServicesActive,
    isScholarshipsActive,
    isEmployersActive,
    isCorporateTrainingActive,
    isSettingsActive,
  ]);

  // ==================================================
  // TOGGLE MENU
  // ==================================================

  const toggleMenu = (menu) => {
    if (collapsed) {
      onToggle?.();

      switch (menu) {
        case "about":
          setAboutOpen(true);
          break;
        case "services":
          setServicesOpen(true);
          break;
        case "scholarships":
          setScholarshipsOpen(true);
          break;
        case "employers":
          setEmployersOpen(true);
          break;
        case "corporate-training":
          setCorporateTrainingOpen(true);
          break;
        case "settings":
          setSettingsOpen(true);
          break;
        default:
          break;
      }

      return;
    }

    switch (menu) {
      case "about":
        setAboutOpen((prev) => !prev);
        break;
      case "services":
        setServicesOpen((prev) => !prev);
        break;
      case "scholarships":
        setScholarshipsOpen((prev) => !prev);
        break;
      case "employers":
        setEmployersOpen((prev) => !prev);
        break;
      case "corporate-training":
        setCorporateTrainingOpen((prev) => !prev);
        break;
      case "settings":
        setSettingsOpen((prev) => !prev);
        break;
      default:
        break;
    }
  };

  // ==================================================
  // NAVIGATE TO ROUTE
  // ==================================================

  const handleNavigation = (path) => {
    navigate(path);
  };

  // ==================================================
  // RENDER SUBMENU
  // ==================================================

  const renderSubmenu = (items) =>
    items.map((item) => {
      const Icon = item.icon;
      const active = pathname === item.path;

      return (
        <button
          key={item.path}
          type="button"
          onClick={() => handleNavigation(item.path)}
          aria-current={active ? "page" : undefined}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
            active
              ? "bg-[#009FF6] text-white shadow-sm"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Icon size={17} className="shrink-0" />
          <span>{item.name}</span>
        </button>
      );
    });

  // ==================================================
  // MENU BUTTON STYLE
  // ==================================================

  const menuButtonClass = (active) =>
    `flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm transition-all duration-200 ${
      active
        ? "bg-[#009FF6]/15 text-[#55C3FF]"
        : "text-gray-400 hover:bg-white/10 hover:text-white"
    }`;

  // ==================================================
  // REUSABLE MENU GROUP
  // ==================================================

  const renderMenuGroup = ({
    id,
    title,
    icon: Icon,
    active,
    isOpen,
    items,
  }) => (
    <div key={id}>
      <button
        type="button"
        onClick={() => toggleMenu(id)}
        className={menuButtonClass(active)}
        title={collapsed ? title : undefined}
        aria-label={title}
        aria-expanded={!collapsed && isOpen}
      >
        <span className="flex min-w-0 items-center gap-3">
          <Icon size={20} className="shrink-0" />
          {!collapsed && <span className="truncate">{title}</span>}
        </span>

        {!collapsed && (
          <ChevronDown
            size={17}
            className={`shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {!collapsed && isOpen && (
        <div className="ml-5 mt-2 space-y-1 border-l border-white/10 pl-4">
          {renderSubmenu(items)}
        </div>
      )}
    </div>
  );

  // ==================================================
  // SIDEBAR UI
  // ==================================================

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-[#101828] text-white transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* LOGO */}

      <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-5">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#009FF6]">
              <GraduationCap size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-wide">Upskill</h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        )}

        {collapsed && (
          <GraduationCap size={25} className="mx-auto text-[#009FF6]" />
        )}
      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden px-3 py-6">
        {/* MAIN DASHBOARD */}

        <div className="mb-4">
          {!collapsed && (
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
              Main Menu
            </p>
          )}

          <button
            type="button"
            onClick={() => handleNavigation("/admin")}
            aria-current={isDashboardActive ? "page" : undefined}
            title={collapsed ? "Main Dashboard" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
              isDashboardActive
                ? "bg-[#009FF6] text-white shadow-lg shadow-[#009FF6]/20"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <LayoutDashboard size={20} className="shrink-0" />
            {!collapsed && "Main Dashboard"}
          </button>
        </div>

        {/* WEBSITE MANAGEMENT */}

        {!collapsed && (
          <p className="mb-3 px-3 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
            Website Management
          </p>
        )}

        {renderMenuGroup({
          id: "about",
          title: "About",
          icon: FileText,
          active: isAboutActive,
          isOpen: aboutOpen,
          items: aboutItems,
        })}

        {renderMenuGroup({
          id: "services",
          title: "Services",
          icon: Briefcase,
          active: isServicesActive,
          isOpen: servicesOpen,
          items: servicesItems,
        })}

        {renderMenuGroup({
          id: "scholarships",
          title: "Scholarships",
          icon: Award,
          active: isScholarshipsActive,
          isOpen: scholarshipsOpen,
          items: scholarshipItems,
        })}

        {renderMenuGroup({
          id: "employers",
          title: "Employers",
          icon: Users,
          active: isEmployersActive,
          isOpen: employersOpen,
          items: employersItems,
        })}

        {renderMenuGroup({
          id: "corporate-training",
          title: "Corporate Training",
          icon: Building2,
          active: isCorporateTrainingActive,
          isOpen: corporateTrainingOpen,
          items: corporateTrainingItems,
        })}

        {/* SETTINGS */}

        <div className="pt-4 mt-4 border-t border-white/10">
          {!collapsed && (
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
              Configuration
            </p>
          )}

          {renderMenuGroup({
            id: "settings",
            title: "Settings",
            icon: Settings,
            active: isSettingsActive,
            isOpen: settingsOpen,
            items: settingsItems,
          })}
        </div>
      </nav>

      {/* SIDEBAR FOOTER */}

      <div className="shrink-0 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex w-full items-center justify-center gap-3 rounded-xl p-3 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft
            size={20}
            className={`transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />

          {!collapsed && (
            <span className="text-sm font-medium">Collapse Sidebar</span>
          )}
        </button>
      </div>
    </aside>
  );
}
