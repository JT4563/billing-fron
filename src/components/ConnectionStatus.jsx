import React, { useState, useEffect } from "react";
import { apiBase } from "../App";

export default function ConnectionStatus() {
  const [endpoints, setEndpoints] = useState({
    health: { status: "checking", message: "Checking..." },
    dashboard_summary: { status: "checking", message: "Checking..." },
    dashboard_daily: { status: "checking", message: "Checking..." },
    invoices: { status: "checking", message: "Checking..." }
  });
  const [collapsed, setCollapsed] = useState(true);

  const testEndpoint = async (name, url, requiresAuth = false) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };
      
      if (requiresAuth && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          status: "connected",
          message: `✅ ${response.status} - ${JSON.stringify(data).length} bytes`
        };
      } else {
        return {
          status: "error",
          message: `❌ ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        status: "error",
        message: `❌ ${error.message}`
      };
    }
  };

  const checkAllEndpoints = async () => {
    const token = localStorage.getItem("token");
    
    // Test /api/health
    const healthResult = await testEndpoint("health", `${apiBase}/health`, false);
    
    // Test authenticated endpoints only if we have a token
    let dashboardSummaryResult, dashboardDailyResult, invoicesResult;
    
    if (token) {
      dashboardSummaryResult = await testEndpoint("dashboard_summary", `${apiBase}/dashboard/summary`, true);
      dashboardDailyResult = await testEndpoint("dashboard_daily", `${apiBase}/dashboard/daily`, true);
      invoicesResult = await testEndpoint("invoices", `${apiBase}/invoices`, true);
    } else {
      const noAuthMessage = { status: "warning", message: "⚠️ No token - login required" };
      dashboardSummaryResult = noAuthMessage;
      dashboardDailyResult = noAuthMessage;
      invoicesResult = noAuthMessage;
    }

    setEndpoints({
      health: healthResult,
      dashboard_summary: dashboardSummaryResult,
      dashboard_daily: dashboardDailyResult,
      invoices: invoicesResult
    });
  };

  useEffect(() => {
    checkAllEndpoints();
    // Check every 30 seconds
    const interval = setInterval(checkAllEndpoints, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "connected": return "#10b981";
      case "error": return "#ef4444";
      case "warning": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  const getOverallStatus = () => {
    const statuses = Object.values(endpoints).map(e => e.status);
    if (statuses.includes("error")) return "error";
    if (statuses.includes("warning")) return "warning"; 
    if (statuses.every(s => s === "connected")) return "connected";
    return "checking";
  };

  const overallStatus = getOverallStatus();

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      border: `2px solid ${getStatusColor(overallStatus)}`,
      fontSize: "13px",
      zIndex: 1000,
      minWidth: "280px",
      maxWidth: "400px"
    }}>
      <div 
        style={{ 
          padding: "12px 16px",
          cursor: "pointer",
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between"
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>
            {overallStatus === "connected" ? "✅" : 
             overallStatus === "error" ? "❌" : 
             overallStatus === "warning" ? "⚠️" : "🟡"}
          </span>
          <span style={{ fontWeight: "500" }}>API Endpoints</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button 
            onClick={(e) => { e.stopPropagation(); checkAllEndpoints(); }}
            style={{
              padding: "4px 8px",
              fontSize: "11px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              background: "white",
              cursor: "pointer"
            }}
          >
            Refresh
          </button>
          <span style={{ fontSize: "12px" }}>{collapsed ? "▼" : "▲"}</span>
        </div>
      </div>
      
      {!collapsed && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #eee" }}>
          <div style={{ marginTop: "12px", fontSize: "12px", fontWeight: "500", color: "#666" }}>
            Backend: {apiBase}
          </div>
          {Object.entries(endpoints).map(([key, endpoint]) => (
            <div key={key} style={{ 
              marginTop: "8px", 
              padding: "8px",
              background: "#f9f9f9",
              borderRadius: "4px",
              borderLeft: `3px solid ${getStatusColor(endpoint.status)}`
            }}>
              <div style={{ fontWeight: "500", fontSize: "12px" }}>
                /{key.replace('_', '/')}
              </div>
              <div style={{ 
                fontSize: "11px", 
                color: "#666",
                marginTop: "2px",
                wordBreak: "break-word"
              }}>
                {endpoint.message}
              </div>
            </div>
          ))}
          <div style={{ 
            marginTop: "12px", 
            fontSize: "11px", 
            color: "#666",
            padding: "8px",
            background: "#f0f8ff",
            borderRadius: "4px"
          }}>
            💡 <strong>Debug Tips:</strong><br/>
            • Login with: OWNER-123456<br/>
            • Check localStorage for 'token'<br/>
            • Open DevTools → Network tab<br/>
            • Look for Authorization headers
          </div>
        </div>
      )}
    </div>
  );
}
