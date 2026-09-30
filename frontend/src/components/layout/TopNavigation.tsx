import { useState } from "react";
import { useMsal } from "@azure/msal-react";

function TopNavigation() {
  const { instance, accounts } = useMsal();

  const account = accounts[0];

  const [profileOpen, setProfileOpen] = useState(false);

  const userName =
    account?.name ||
    account?.username ||
    "PathGuard User";

  const initials = userName
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSignOut = () => {
    instance.logoutRedirect();
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Security Operations Center
        </h2>

        <p className="text-sm text-slate-400">
          PathGuard Security Monitoring
        </p>
      </div>

      <div className="flex items-center gap-5">
        {/* Notification Button */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notifications"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 0 0-12 0v.75c0 2.307-.872 4.508-2.311 6.022a23.848 23.848 0 0 0 5.454 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="h-8 w-px bg-slate-200" />

        {/* User Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
          >
            {/* Profile Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
              {initials}
            </div>

            {/* User Information */}
            <div className="hidden text-left sm:block">
              <p className="max-w-40 truncate text-sm font-semibold text-slate-800">
                {userName}
              </p>

              <p className="text-xs text-slate-400">
                Security Analyst
              </p>
            </div>

            {/* Dropdown Arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className={`h-4 w-4 text-slate-400 transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-14 z-50 w-36 rounded-lg border border-slate-200/70 bg-white/90 p-1 shadow-lg backdrop-blur-md">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100/80 hover:text-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H3"
                  />
                </svg>

                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavigation;