import { useMsal } from "@azure/msal-react";

function TopNavigation() {
  const { accounts } = useMsal();

  const account = accounts[0];

  const userName =
    account?.name ||
    account?.username ||
    "PathGuard User";

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

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
            {userName
              .split(" ")
              .map((name) => name[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>

          <div className="hidden text-left sm:block">
            <p className="max-w-40 truncate text-sm font-semibold text-slate-800">
              {userName}
            </p>

            <p className="text-xs text-slate-400">
              Security Analyst
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavigation;