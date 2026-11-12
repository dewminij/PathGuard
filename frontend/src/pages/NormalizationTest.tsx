/*
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
*/


import { useState } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { getApiAccessToken } from "../api/authApi";

const API_URL = "http://localhost:6001/api";

function NormalizationTest() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const getHeaders = (accessToken: string) => ({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const importAndNormalize = async (
    accessToken: string,
    externalAlertId: string,
    sourceIP: string,
    timestamp: string
  ) => {
    const alertResponse = await fetch(`${API_URL}/Alert/upload`, {
      method: "POST",
      headers: getHeaders(accessToken),
      body: JSON.stringify({
        externalAlertId,
        source: "PathGuard-Correlation-Test",
        eventType: "Brute Force",
        title: "Multiple failed login attempts",
        description: JSON.stringify({
          srcip: sourceIP,
          dstip: "192.168.1.10",
          hostname: "correlation-test-workstation",
        }),
        severity: "High",
        timestamp,
        status: "New",
      }),
    });

    if (!alertResponse.ok) {
      throw new Error(
        `Alert import failed (${alertResponse.status}): ${await alertResponse.text()}`
      );
    }

    const alert = await alertResponse.json();
    const alertId = alert.alertId ?? alert.AlertId;

    if (!alertId) {
      throw new Error("Imported alert was returned without an alert ID.");
    }

    const normalizeResponse = await fetch(
      `${API_URL}/Normalization/${alertId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!normalizeResponse.ok) {
      throw new Error(
        `Normalization failed (${normalizeResponse.status}): ${await normalizeResponse.text()}`
      );
    }

    const normalized = await normalizeResponse.json();
    const normalizedAlertId =
      normalized.normalizedAlertId ?? normalized.NormalizedAlertId;

    if (!normalizedAlertId) {
      throw new Error("Normalized alert was returned without an ID.");
    }

    return {
      alertId,
      normalizedAlertId,
      normalized,
    };
  };

  const runTest = async () => {
    if (!isAuthenticated || accounts.length === 0) {
      setResult("Please sign in before running the test.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const accessToken = await getApiAccessToken(instance, accounts[0]);

      const imported = await importAndNormalize(
        accessToken,
        "PATHGUARD-NORMALIZATION-TEST-001",
        "192.168.1.25",
        new Date().toISOString()
      );

      const normalizeUrl = `${API_URL}/Normalization/${imported.alertId}`;

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
      const secondId =
        secondNormalized.normalizedAlertId ??
        secondNormalized.NormalizedAlertId;

      setResult(
        JSON.stringify(
          {
            test: "Alert normalization and idempotency",
            alertId: imported.alertId,
            firstNormalized: imported.normalized,
            secondNormalized,
            sameNormalizedRecord:
              imported.normalizedAlertId === secondId,
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

  const runCorrelationTest = async () => {
    if (!isAuthenticated || accounts.length === 0) {
      setResult("Please sign in before running the test.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const accessToken = await getApiAccessToken(instance, accounts[0]);

      // Use a unique ID for every test run to avoid duplicate imports.
      const runId = Date.now();
      const baseTime = Date.now();

      // Alert A: same source IP as B.
      const alertA = await importAndNormalize(
        accessToken,
        `PATHGUARD-CORRELATION-${runId}-A`,
        "192.168.1.25",
        new Date(baseTime).toISOString()
      );

      // Alert B: same source IP and event, five minutes after A.
      const alertB = await importAndNormalize(
        accessToken,
        `PATHGUARD-CORRELATION-${runId}-B`,
        "192.168.1.25",
        new Date(baseTime + 5 * 60 * 1000).toISOString()
      );

      // Alert C: different source IP, four minutes after A.
      const alertC = await importAndNormalize(
        accessToken,
        `PATHGUARD-CORRELATION-${runId}-C`,
        "192.168.1.90",
        new Date(baseTime + 4 * 60 * 1000).toISOString()
      );

      const getCandidates = async (normalizedAlertId: number) => {
        const response = await fetch(
          `${API_URL}/Correlation/${normalizedAlertId}/candidates`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Correlation request failed (${response.status}): ${await response.text()}`
          );
        }

        return response.json();
      };

      const [candidatesA, candidatesB, candidatesC] = await Promise.all([
        getCandidates(alertA.normalizedAlertId),
        getCandidates(alertB.normalizedAlertId),
        getCandidates(alertC.normalizedAlertId),
      ]);

      const idsA = candidatesA.candidates.map(
        (item: any) => item.normalizedAlertId ?? item.NormalizedAlertId
      );

      const idsB = candidatesB.candidates.map(
        (item: any) => item.normalizedAlertId ?? item.NormalizedAlertId
      );

      const idsC = candidatesC.candidates.map(
        (item: any) => item.normalizedAlertId ?? item.NormalizedAlertId
      );

      const results = {
        test: "Alert correlation",
        alerts: {
          A: alertA,
          B: alertB,
          C: alertC,
        },
        candidateResults: {
          A: candidatesA,
          B: candidatesB,
          C: candidatesC,
        },
        checks: {
          A_finds_B: idsA.includes(alertB.normalizedAlertId),
          B_finds_A: idsB.includes(alertA.normalizedAlertId),
          C_does_not_find_A_or_B:
            !idsC.includes(alertA.normalizedAlertId) &&
            !idsC.includes(alertB.normalizedAlertId),
        },
      };

      setResult(JSON.stringify(results, null, 2));
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
        PathGuard Security Testing
      </h1>

      <p className="mb-4">
        Test alert normalization, duplicate handling, and correlation using
        authenticated API requests.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={runTest}
          disabled={loading || !isAuthenticated}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Test Alert Normalization
        </button>

        <button
          onClick={runCorrelationTest}
          disabled={loading || !isAuthenticated}
          className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Test Alert Correlation
        </button>
      </div>

      {!isAuthenticated && (
        <p className="mt-4 text-sm text-red-600">
          Please sign in to run the tests.
        </p>
      )}

      {loading && (
        <p className="mt-4 text-sm">Running test. Please wait...</p>
      )}

      {result && (
        <pre className="mt-6 overflow-auto whitespace-pre-wrap rounded bg-gray-100 p-4 text-sm text-gray-900">
          {result}
        </pre>
      )}
    </div>
  );
}

export default NormalizationTest;
