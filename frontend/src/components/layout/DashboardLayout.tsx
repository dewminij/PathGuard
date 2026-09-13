import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        {/* Top Bar */}
        <div className="flex h-20 items-center border-b border-slate-200 bg-white px-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Security Operations Center
            </h2>

            <p className="text-sm text-slate-400">
              PathGuard Security Monitoring
            </p>
          </div>
        </div>

        {/* Current Route/Page */}
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;