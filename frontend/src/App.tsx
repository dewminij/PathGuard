/* this is the comment done in 13/09/2026 - this is for entra verification part, make in invisible for the UI in dashboard

import { useEffect, useState } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import Login from "./pages/Login";
import { getApiAccessToken } from "./api/authApi";

function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();

  const [apiStatus, setApiStatus] = useState("Checking API connection...");

  useEffect(() => {
    const testApiConnection = async () => {
      if (!isAuthenticated || accounts.length === 0) {
        return;
      }

      try {
        const account = accounts[0];

        const accessToken = await getApiAccessToken(instance, account);

        const response = await fetch(
          "http://localhost:5211/api/AuthTest",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        setApiStatus(
          `${data.message} Signed in as ${data.name || "user"}.`
        );
      } catch (error) {
        console.error("API authentication failed:", error);
        setApiStatus("API authentication failed.");
      }
    };

    testApiConnection();
  }, [isAuthenticated, accounts, instance]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600">
          PathGuard
        </h1>

        <p className="mt-4 text-gray-600">
          {apiStatus}
        </p>
      </div>
    </div>
  );
}

export default App;

*/

/* first dashboard look on 13/09/2026 -- keep as comments not sure whether to roll back

import { useEffect, useState } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { getApiAccessToken } from "./api/authApi";

function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();

  const [apiStatus, setApiStatus] = useState("Checking API connection...");

  useEffect(() => {
    const testApiConnection = async () => {
      if (!isAuthenticated || accounts.length === 0) {
        return;
      }

      try {
        const account = accounts[0];

        const accessToken = await getApiAccessToken(instance, account);

        const response = await fetch(
          "http://localhost:5211/api/AuthTest",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        setApiStatus(
          `${data.message} Signed in as ${data.name || "user"}.`
        );
      } catch (error) {
        console.error("API authentication failed:", error);
        setApiStatus("API authentication failed.");
      }
    };

    testApiConnection();
  }, [isAuthenticated, accounts, instance]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div>
      <div className="border-b border-slate-200 bg-white px-6 py-3">
        <p className="text-sm text-slate-500">
          {apiStatus}
        </p>
      </div>

      <Dashboard />
    </div>
  );
}

export default App;

*/

import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

import Login from "./pages/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import { getApiAccessToken } from "./api/authApi";

function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();

  const [apiStatus, setApiStatus] = useState("Checking API connection...");

  useEffect(() => {
    const testApiConnection = async () => {
      if (!isAuthenticated || accounts.length === 0) {
        return;
      }

      try {
        const account = accounts[0];

        const accessToken = await getApiAccessToken(instance, account);

        const response = await fetch(
          "http://localhost:5211/api/AuthTest",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        setApiStatus(
          `${data.message} Signed in as ${data.name || "user"}.`
        );
      } catch (error) {
        console.error("API authentication failed:", error);
        setApiStatus("API authentication failed.");
      }
    };

    testApiConnection();
  }, [isAuthenticated, accounts, instance]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div>
        {/* Authentication Status */}
        <div className="border-b border-slate-200 bg-white px-6 py-3">
          <p className="text-sm text-slate-500">
            {apiStatus}
          </p>
        </div>

        {/* Application Routes */}
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Future pages */}
            <Route
              path="/alerts"
              element={
                <div className="p-6 text-xl font-semibold">
                  Alerts page coming soon
                </div>
              }
            />

            <Route
              path="/attack-mapping"
              element={
                <div className="p-6 text-xl font-semibold">
                  Attack Mapping page coming soon
                </div>
              }
            />

            <Route
              path="/attack-path"
              element={
                <div className="p-6 text-xl font-semibold">
                  Attack Path page coming soon
                </div>
              }
            />

            <Route
              path="/reports"
              element={
                <div className="p-6 text-xl font-semibold">
                  Reports page coming soon
                </div>
              }
            />

            <Route
              path="/audit-logs"
              element={
                <div className="p-6 text-xl font-semibold">
                  Audit Logs page coming soon
                </div>
              }
            />

            <Route
              path="/settings"
              element={
                <div className="p-6 text-xl font-semibold">
                  Settings page coming soon
                </div>
              }
            />

            <Route
              path="/user-roles"
              element={
                <div className="p-6 text-xl font-semibold">
                  User Roles page coming soon
                </div>
              }
            />

            <Route
              path="/profile"
              element={
                <div className="p-6 text-xl font-semibold">
                  User Profile page coming soon
                </div>
              }
            />
          </Route>

          {/* Default route */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;