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

      console.log("📅 Daily data response status:", res.status);

      const js = await res.json();
      console.log("📅 Daily data response:", js);

      if (!res.ok) throw new Error(js.message || `HTTP ${res.status}`);
      setDaily(js);
    } catch (err) {
      console.error("❌ Daily data error:", err);
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
          <h3>Dashboard Summary</h3>
          <div>🔄 Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div
          className="card"
          style={{
            background: "#fee",
            border: "1px solid #fcc",
            marginBottom: "16px",
          }}
        >
          <h4 style={{ color: "#c33", margin: "0 0 8px 0" }}>
            ⚠️ Connection Issues
          </h4>
          <div style={{ fontSize: "14px", color: "#a33" }}>{error}</div>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              Promise.all([fetchSummary(), fetchDaily(date)]).finally(() =>
                setLoading(false)
              );
            }}
            style={{
              marginTop: "8px",
              padding: "6px 12px",
              background: "#c33",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🔄 Retry
          </button>
        </div>
      )}

      <div className="card">
        <h3>Dashboard Summary</h3>
        {!summary && !daily ? (
          <div>
            <div>⏳ No summary data available</div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              Check if backend is running on http://localhost:4000 and you're
              logged in with a valid token.
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 12,
            }}
          >
            <div className="card small">
              <div className="small-muted">Invoices</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                {(summary?.invoices > 0
                  ? summary.invoices
                  : daily?.totals?.invoices) || 0}
              </div>
            </div>
            <div className="card small">
              <div className="small-muted">Total Revenue</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                ₹
                {(
                  (summary?.totalRevenue > 0
                    ? summary.totalRevenue
                    : daily?.totals?.totalRevenue) || 0
                ).toLocaleString("en-IN")}
              </div>
            </div>
            <div className="card small">
              <div className="small-muted">Total Trucks</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                {(summary?.totalTrucks > 0
                  ? summary.totalTrucks
                  : daily?.totals?.totalTrucks) || 0}
              </div>
            </div>
            <div className="card small">
              <div className="small-muted">Avg Rate/Ton</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>
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
        <h3>Daily View</h3>
        <div className="form-row">
          <div className="label">Date</div>
          <input
            className="input small"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setLoading(true);
              fetchDaily(e.target.value).finally(() => setLoading(false));
            }}
          />
        </div>
        {daily ? (
          <div>
            <div className="small-muted">Totals</div>
            <div style={{ fontWeight: 700, marginTop: 6 }}>
              Invoices: {daily.totals?.invoices || 0} | Trucks:{" "}
              {daily.totals?.totalTrucks || 0} | Revenue: ₹
              {(daily.totals?.totalRevenue || 0).toLocaleString("en-IN")}
            </div>
            <table className="table" style={{ marginTop: 10 }}>
              <thead>
                <tr>
                  <th>Inv#</th>
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
                      <td>{inv.invoiceNumber}</td>
                      <td>{new Date(inv.createdAt).toLocaleTimeString()}</td>
                      <td>{inv.companyName}</td>
                      <td>{inv.trucks}</td>
                      <td>₹{(inv.total || 0).toLocaleString("en-IN")}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", color: "#666" }}
                    >
                      No invoices for selected date
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ marginTop: "10px", color: "#666" }}>
            ⏳ No daily data available for {date}
          </div>
        )}
      </div>
    </div>
  );
}
