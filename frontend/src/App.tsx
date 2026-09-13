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