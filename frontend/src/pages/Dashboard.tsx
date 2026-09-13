function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Security Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor your security environment and incident activity.
        </p>
      </div>

      {/* Empty Dashboard Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        
        {/* Alerts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Active Alerts
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            --
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Security alerts will appear here
          </p>
        </div>

        {/* Incidents */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Open Incidents
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            --
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Incident information will appear here
          </p>
        </div>

        {/* Risk */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            High Risk
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            --
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Risk information will appear here
          </p>
        </div>

        {/* Assets */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Monitored Assets
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            --
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Asset information will appear here
          </p>
        </div>
      </div>

      {/* Main Dashboard Area */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Recent Alerts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Alerts
          </h2>

          <div className="mt-6 flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-400">
              No alert data available yet
            </p>
          </div>
        </div>

        {/* Risk Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Risk Overview
          </h2>

          <div className="mt-6 flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-400">
              Risk analysis will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;