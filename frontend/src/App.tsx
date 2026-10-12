import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

import Login from "./pages/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import { getApiAccessToken } from "./api/authApi";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();


  useEffect(() => {
    const testApiConnection = async () => {
      if (!isAuthenticated || accounts.length === 0) {
        return;
      }

      try {
        const account = accounts[0];

        const accessToken = await getApiAccessToken(
          instance,
          account
        );

        const response = await fetch(
          "http://localhost:6001/api/AuthTest",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

       

      } catch (error) {
        console.error("API authentication failed:", error);
        // setApiStatus("API authentication failed.");
      }
    };

    testApiConnection();
  }, [isAuthenticated, accounts, instance]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

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

          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;