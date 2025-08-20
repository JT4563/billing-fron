import React, { useEffect, useState } from "react";
import { apiBase } from "../App";
import dayjs from "dayjs";

export default function Dashboard({ token }) {
  const [summary, setSummary] = useState(null);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    try {
      console.log(
        "🔄 Fetching dashboard summary from:",
        `${apiBase}/dashboard/summary`
      );
      console.log("🔑 Using token:", token ? "Present" : "Missing");

      const res = await fetch(`${apiBase}/dashboard/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📊 Dashboard summary response status:", res.status);

      const js = await res.json();
      console.log("📊 Dashboard summary response data:", js);

      if (!res.ok) throw new Error(js.message || `HTTP ${res.status}`);
      setSummary(js);
      setError(null);
    } catch (err) {
      console.error("❌ Dashboard summary error:", err);
      setError(`Summary error: ${err.message}`);
    }
  };

  const fetchDaily = async (d) => {
    try {
      console.log(
        "🔄 Fetching daily data from:",
        `${apiBase}/dashboard/daily?date=${d}`
      );

      const res = await fetch(`${apiBase}/dashboard/daily?date=${d}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Daily data response status:", res.status);

      const js = await res.json();
      console.log("Daily data response:", js);

      if (!res.ok) throw new Error(js.message || `HTTP ${res.status}`);
      setDaily(js);
    } catch (err) {
      console.error("Daily data error:", err);
      setError((prev) =>
        prev
          ? `${prev} | Daily error: ${err.message}`
          : `Daily error: ${err.message}`
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchSummary(), fetchDaily(date)]).finally(() =>
      setLoading(false)
    );
  }, [token]);

  if (loading) {
    return (
      <div>
        <div className="card">
          <h3>Dashboard Overview</h3>
          <div className="loading">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="alert error" style={{ marginBottom: "24px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "700", marginBottom: "4px" }}>
              Connection Issues
            </div>
            <div style={{ fontSize: "14px" }}>{error}</div>
          </div>
          <button
            className="btn outline"
            onClick={() => {
              setError(null);
              setLoading(true);
              Promise.all([fetchSummary(), fetchDaily(date)]).finally(() =>
                setLoading(false)
              );
            }}
          >
            Retry Connection
          </button>
        </div>
      )}

      <div className="card">
        <h3>Business Overview</h3>
        {!summary && !daily ? (
          <div className="alert info">
            <div>No summary data available</div>
            <div style={{ fontSize: "12px", marginTop: "8px" }}>
              Check if backend is running on http://localhost:4000 and you're
              logged in with a valid token.
            </div>
          </div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Invoices Created</div>
              <div className="stat-value">
                {(summary?.invoices > 0
                  ? summary.invoices
                  : daily?.totals?.invoices) || 0}
              </div>
            </div>
            <div className="stat-card primary">
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">
                ₹
                {(
                  (summary?.totalRevenue > 0
                    ? summary.totalRevenue
                    : daily?.totals?.totalRevenue) || 0
                ).toLocaleString("en-IN")}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Trucks</div>
              <div className="stat-value">
                {(summary?.totalTrucks > 0
                  ? summary.totalTrucks
                  : daily?.totals?.totalTrucks) || 0}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Average Rate per Ton</div>
              <div className="stat-value">
                ₹
                {Math.round(
                  (summary?.avgRatePerTon > 0
                    ? summary.avgRatePerTon
                    : daily?.totals?.totalRevenue && daily?.totals?.totalTrucks
                    ? daily.totals.totalRevenue / daily.totals.totalTrucks
                    : 0) || 0
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Daily Activity</h3>
        <div className="form-row">
          <label className="label">Select Date</label>
          <input
            className="input"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setLoading(true);
              fetchDaily(e.target.value).finally(() => setLoading(false));
            }}
            style={{ maxWidth: "200px" }}
          />
        </div>
        {daily ? (
          <div>
            <div className="daily-summary">
              <div className="summary-item">
                <span className="summary-label">Invoices:</span>
                <span className="summary-value">
                  {daily.totals?.invoices || 0}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Trucks:</span>
                <span className="summary-value">
                  {daily.totals?.totalTrucks || 0}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Revenue:</span>
                <span className="summary-value">
                  ₹{(daily.totals?.totalRevenue || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Time</th>
                    <th>Company</th>
                    <th>Trucks</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {daily.invoices?.length > 0 ? (
                    daily.invoices.map((inv) => (
                      <tr key={inv._id}>
                        <td>
                          <code>{inv.invoiceNumber}</code>
                        </td>
                        <td>{new Date(inv.createdAt).toLocaleTimeString()}</td>
                        <td>{inv.companyName}</td>
                        <td>{inv.trucks}</td>
                        <td className="currency">
                          ₹{(inv.total || 0).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">
                        No invoices for selected date
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="alert info">No daily data available for {date}</div>
        )}
      </div>
    </div>
  );
}
