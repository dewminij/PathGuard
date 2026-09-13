import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "▣" },
    { name: "Alerts", path: "/alerts", icon: "⚠" },
    { name: "Attack Mapping", path: "/attack-mapping", icon: "⌘" },
    { name: "Attack Path", path: "/attack-path", icon: "↗" },
    { name: "Reports", path: "/reports", icon: "▤" },
    { name: "Audit Logs", path: "/audit-logs", icon: "◷" },
    { name: "Settings", path: "/settings", icon: "⚙" },
    { name: "User Roles", path: "/user-roles", icon: "♙" },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo / Brand */}
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">
            PathGuard
          </h1>

          <p className="text-xs text-slate-400">
            Security Operations
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <span className="flex w-6 justify-center text-base">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-200 p-4">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex w-full items-center gap-3 rounded-xl p-3 transition ${
              isActive
                ? "bg-blue-50"
                : "hover:bg-slate-50"
            }`
          }
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
            TD
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              User Profile
            </p>

            <p className="truncate text-xs text-slate-400">
              Security Analyst
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;