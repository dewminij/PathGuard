
import { useState } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { getApiAccessToken } from "../api/authApi";

function NormalizationTest() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const runTest = async () => {
    if (!isAuthenticated || accounts.length === 0) {
      setResult("Please sign in before running the test.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const account = accounts[0];
      const accessToken = await getApiAccessToken(instance, account);

      // 1. Import a sample security alert.
      const alertResponse = await fetch(
        "http://localhost:6001/api/Alert/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            externalAlertId: "PATHGUARD-NORMALIZATION-TEST-001",
            source: "PathGuard-Test",
            eventType: "Brute Force",
            title: "Multiple failed login attempts",
            description:
              '{"srcip":"192.168.1.25","dstip":"192.168.1.10","hostname":"test-workstation"}',
            severity: "High",
            timestamp: new Date().toISOString(),
            status: "New",
          }),
        }
      );

      if (!alertResponse.ok) {
        throw new Error(
          `Alert import failed (${alertResponse.status}): ${await alertResponse.text()}`
        );
      }

      const alert = await alertResponse.json();
      const alertId = alert.alertId ?? alert.AlertId;

      if (!alertId) {
        throw new Error("Alert was returned without an alert ID.");
      }

      // 2. Normalize the imported alert.
      const normalizeUrl =
        `http://localhost:6001/api/Normalization/${alertId}`;

      const firstResponse = await fetch(normalizeUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!firstResponse.ok) {
        throw new Error(
          `First normalization failed (${firstResponse.status}): ${await firstResponse.text()}`
        );
      }

      const firstNormalized = await firstResponse.json();

      // 3. Normalize it again to test whether the existing record is reused.
      const secondResponse = await fetch(normalizeUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!secondResponse.ok) {
        throw new Error(
          `Second normalization failed (${secondResponse.status}): ${await secondResponse.text()}`
        );
      }

      const secondNormalized = await secondResponse.json();

      const firstId =
        firstNormalized.normalizedAlertId ??
        firstNormalized.NormalizedAlertId;

      const secondId =
        secondNormalized.normalizedAlertId ??
        secondNormalized.NormalizedAlertId;

      setResult(
        JSON.stringify(
          {
            alertId,
            alertImportStatus: alertResponse.status,
            firstNormalized,
            secondNormalized,
            sameNormalizedRecord:
              firstId != null &&
              secondId != null &&
              firstId === secondId,
          },
          null,
          2
        )
      );
    } catch (error) {
      setResult(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">
        PathGuard Normalization Test
      </h1>

      <p className="mb-4">
        Imports a sample alert, normalizes it, and checks whether a second
        request reuses the normalized record.
      </p>

      <button
        onClick={runTest}
        disabled={loading || !isAuthenticated}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Running test..." : "Test Alert Normalization"}
      </button>

      {result && (
        <pre className="mt-6 overflow-auto whitespace-pre-wrap rounded bg-gray-100 p-4 text-sm text-gray-900">
          {result}
        </pre>
      )}
    </div>
  );
}

export default NormalizationTest;
