import React, { useEffect, useState } from "react";
import { apiBase } from "../App";

export default function Invoices({ token }) {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPage = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/invoices?page=${p}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Error");
      setData(json.data);
      setPage(json.page);
      setTotal(json.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  const downloadPdf = async (id, invoiceNumber) => {
    try {
      const response = await fetch(`${apiBase}/invoices/${id}/pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const printInvoice = async (id) => {
    try {
      const response = await fetch(`${apiBase}/invoices/${id}/pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url, "_blank");
      printWindow.onload = () => {
        printWindow.print();
      };
    } catch (error) {
      console.error("Error printing invoice:", error);
      alert("Failed to open invoice for printing. Please try again.");
    }
  };

  return (
    <div>
      <div className="card">
        <h3>📄 Invoice Management</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div className="small-muted">
            <strong>Total Invoices:</strong> {total}
          </div>
          <button
            onClick={() => fetchPage(1)}
            className="btn"
            style={{ padding: "8px 16px", fontSize: "14px" }}
          >
            🔄 Refresh
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Trucks</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((inv) => (
                  <tr key={inv._id}>
                    <td style={{ fontWeight: "600", color: "var(--accent)" }}>
                      {inv.invoiceNumber}
                    </td>
                    <td>
                      <div>
                        {new Date(inv.createdAt).toLocaleDateString("en-IN")}
                      </div>
                      <div className="small-muted">
                        {new Date(inv.createdAt).toLocaleTimeString("en-IN")}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: "500" }}>{inv.companyName}</div>
                      {inv.companyPhone && (
                        <div className="small-muted">{inv.companyPhone}</div>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          background: "#e0f2fe",
                          color: "#0369a1",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {inv.trucks} truck{inv.trucks > 1 ? "s" : ""}
                      </span>
                    </td>
                    <td style={{ fontWeight: "600", fontSize: "16px" }}>
                      ₹{(inv.total || 0).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          className="btn success"
                          onClick={() =>
                            downloadPdf(inv._id, inv.invoiceNumber)
                          }
                          style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            borderRadius: "6px",
                          }}
                        >
                          📄 PDF
                        </button>
                        <button
                          className="btn"
                          onClick={() => printInvoice(inv._id)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            background: "#0284c7",
                            borderRadius: "6px",
                          }}
                        >
                          🖨️ Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#64748b",
                    }}
                  >
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                      📄
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "500" }}>
                      No invoices found
                    </div>
                    <div style={{ fontSize: "14px", marginTop: "8px" }}>
                      Create your first invoice from the Billing page
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            padding: "16px 0",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => fetchPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="btn"
              style={{
                padding: "8px 16px",
                background: page <= 1 ? "#94a3b8" : "var(--accent)",
                fontSize: "14px",
              }}
            >
              ← Previous
            </button>
            <button
              onClick={() => fetchPage(page + 1)}
              className="btn"
              style={{ padding: "8px 16px", fontSize: "14px" }}
            >
              Next →
            </button>
          </div>
          <div className="small-muted" style={{ fontWeight: "500" }}>
            Page {page} • {total} total invoices
          </div>
        </div>
      </div>
    </div>
  );
}
