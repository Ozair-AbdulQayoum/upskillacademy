import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F7FB]">
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`
          min-h-screen
          transition-all
          duration-300
          ease-in-out
          ${collapsed ? "ml-20" : "ml-64"}
        `}
      >
        {/* Header */}
        <AdminHeader onToggle={toggleSidebar} />

        {/* Page Content */}
        <main className="p-4 sm:p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
