import React, { useState, useEffect } from "react";
import { apiBase } from "../App";

export default function ApiTest({ token }) {
  const [results, setResults] = useState({});
  const [testing, setTesting] = useState(false);

  const testEndpoint = async (name, endpoint, needsAuth = false) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (needsAuth && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiBase}${endpoint}`, {
        method: "GET",
        headers: headers,
      });

      const data = await response.json();
      return {
        status: response.status,
        ok: response.ok,
        data: data,
      };
    } catch (error) {
      return {
        status: "ERROR",
        ok: false,
        error: error.message,
      };
    }
  };

  const runTests = async () => {
    setTesting(true);
    const testResults = {};

    // Test health endpoint
    testResults.health = await testEndpoint("Health", "/health");

    if (token) {
      // Test authenticated endpoints
      testResults.dashboard = await testEndpoint(
        "Dashboard Summary",
        "/dashboard/summary",
        true
      );
      testResults.daily = await testEndpoint(
        "Daily Stats",
        "/dashboard/daily",
        true
      );
      testResults.invoices = await testEndpoint("Invoices", "/invoices", true);
    }

    setResults(testResults);
    setTesting(false);
  };

  useEffect(() => {
    runTests();
  }, [token]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "white",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        border: "1px solid #ddd",
        fontSize: "12px",
        zIndex: 1000,
        maxWidth: "350px",
        maxHeight: "400px",
        overflow: "auto",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "12px" }}>
        API Endpoint Tests
        <button
          onClick={runTests}
          disabled={testing}
          style={{
            marginLeft: "10px",
            padding: "4px 8px",
            fontSize: "11px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            background: "white",
            cursor: "pointer",
          }}
        >
          {testing ? "Testing..." : "Refresh"}
        </button>
      </div>

      {Object.entries(results).map(([key, result]) => (
        <div
          key={key}
          style={{
            marginBottom: "8px",
            padding: "8px",
            background: "#f8f9fa",
            borderRadius: "4px",
          }}
        >
          <div style={{ fontWeight: "bold" }}>
            {key === "health" && "🏥 /api/health"}
            {key === "dashboard" && "📊 /api/dashboard/summary"}
            {key === "daily" && "📅 /api/dashboard/daily"}
            {key === "invoices" && "📄 /api/invoices"}
          </div>
          <div
            style={{
              color: result.ok ? "green" : "red",
              fontSize: "11px",
              marginTop: "4px",
            }}
          >
            Status: {result.status} {result.ok ? "✅" : "❌"}
          </div>
          {result.error && (
            <div style={{ color: "red", fontSize: "11px" }}>
              Error: {result.error}
            </div>
          )}
          {result.data && (
            <div style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>
              Response: {JSON.stringify(result.data).substring(0, 100)}...
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: "12px", fontSize: "11px", color: "#666" }}>
        API Base: {apiBase}
        <br />
        Token: {token ? "✅ Present" : "❌ Missing"}
        <br />
        Frontend: localhost:3004
      </div>
    </div>
  );
}
