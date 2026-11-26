import { useState } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { getApiAccessToken } from "../api/authApi";

const API_URL = "http://localhost:6001/api";

function NormalizationTest() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  // Store the latest normalized alert IDs for incident testing.
  const [correlationAlertIds, setCorrelationAlertIds] = useState<{
    A: number;
    B: number;
    C: number;
  } | null>(null);

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

  // TEST 1: Alert normalization and duplicate handling.
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

// TEST 2: Alert correlation.
const runCorrelationTest = async () => {
  if (!isAuthenticated || accounts.length === 0) {
    setResult("Please sign in before running the test.");
    return;
  }

  setLoading(true);
  setResult("");
  setCorrelationAlertIds(null);

  try {
    const accessToken = await getApiAccessToken(instance, accounts[0]);

    const runId = Date.now();
    const baseTime = Date.now();

    // Generate a different synthetic source IP for every test run.
    // This prevents older test runs from matching the current run.
    const uniqueIP = (timestamp: number) => {
      const part1 = Math.floor(timestamp / 65536) % 256;
      const part2 = Math.floor(timestamp / 256) % 256;
      return `10.200.${part1}.${part2}`;
    };

    const sharedSourceIP = uniqueIP(runId);
    const isolatedSourceIP = `10.201.${Math.floor(runId / 65536) % 256}.${Math.floor(runId / 256) % 256}`;

    const alertA = await importAndNormalize(
      accessToken,
      `PATHGUARD-CORRELATION-${runId}-A`,
      sharedSourceIP,
      new Date(baseTime).toISOString()
    );

    const alertB = await importAndNormalize(
      accessToken,
      `PATHGUARD-CORRELATION-${runId}-B`,
      sharedSourceIP,
      new Date(baseTime + 5 * 60 * 1000).toISOString()
    );

    const alertC = await importAndNormalize(
      accessToken,
      `PATHGUARD-CORRELATION-${runId}-C`,
      isolatedSourceIP,
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

    // Verify both correct matches and absence of unexpected matches.
    const checks = {
      A_finds_only_B:
        idsA.length === 1 &&
        idsA.includes(alertB.normalizedAlertId),

      B_finds_only_A:
        idsB.length === 1 &&
        idsB.includes(alertA.normalizedAlertId),

      C_has_no_candidates:
        idsC.length === 0,
    };

    setCorrelationAlertIds({
      A: alertA.normalizedAlertId,
      B: alertB.normalizedAlertId,
      C: alertC.normalizedAlertId,
    });

    setResult(
      JSON.stringify(
        {
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
          checks,
          allChecksPassed: Object.values(checks).every(Boolean),
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


  // TEST 3: Incident creation and alert association.
  const runIncidentTest = async () => {
    if (!isAuthenticated || accounts.length === 0) {
      setResult("Please sign in before running the test.");
      return;
    }

    if (!correlationAlertIds) {
      setResult(
        "Please run the Alert Correlation test first. Incident testing requires its latest alert IDs."
      );
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const accessToken = await getApiAccessToken(instance, accounts[0]);

      const createIncident = async (normalizedAlertId: number) => {
        const response = await fetch(
          `${API_URL}/Incident/create/${normalizedAlertId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Incident creation failed (${response.status}): ${await response.text()}`
          );
        }

        return response.json();
      };

      // Create or reuse incidents for the latest correlation test alerts.
      const incidentA = await createIncident(correlationAlertIds.A);
      const incidentB = await createIncident(correlationAlertIds.B);
      const incidentC = await createIncident(correlationAlertIds.C);

      const getIncidentId = (response: any) =>
        response.incident?.incidentId ??
        response.incident?.IncidentId ??
        null;

      const incidentAId = getIncidentId(incidentA);
      const incidentBId = getIncidentId(incidentB);
      const incidentCId = getIncidentId(incidentC);

      const checks = {
        A_and_B_share_incident:
          incidentAId !== null && incidentAId === incidentBId,

        C_remains_unassigned:
          incidentCId === null,
      };

      setResult(
        JSON.stringify(
          {
            test: "Incident creation and association",
            normalizedAlertIds: correlationAlertIds,
            results: {
              alertA: incidentA,
              alertB: incidentB,
              alertC: incidentC,
            },
            checks,
          },
          null,
          2
        )
      );
    } catch (error) {
      setResult(
        error instanceof Error ? error.message : "Unexpected error occurred."
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
        Test alert normalization, duplicate handling, correlation, and incident
        creation using authenticated API requests.
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

        <button
          onClick={runIncidentTest}
          disabled={loading || !isAuthenticated}
          className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Test Incident Creation
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
