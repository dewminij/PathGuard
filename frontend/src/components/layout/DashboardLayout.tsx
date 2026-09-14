import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavigation from "./TopNavigation";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        {/* Top Navigation */}
        <TopNavigation />

        {/* Current Route/Page */}
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;