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
        <h3>Invoice Management</h3>
        <div className="invoice-header">
          <div className="total-count">
            Total Invoices: <strong>{total}</strong>
          </div>
          <button
            onClick={() => fetchPage(1)}
            className="btn outline"
          >
            Refresh Data
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
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
                    <td>
                      <code className="invoice-number">{inv.invoiceNumber}</code>
                    </td>
                    <td>
                      <div className="datetime">
                        <div className="date">
                          {new Date(inv.createdAt).toLocaleDateString("en-IN")}
                        </div>
                        <div className="time">
                          {new Date(inv.createdAt).toLocaleTimeString("en-IN")}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="company-name">{inv.companyName}</div>
                        {inv.companyPhone && (
                          <div className="phone">{inv.companyPhone}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="truck-badge">
                        {inv.trucks} truck{inv.trucks > 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="currency">
                      ₹{(inv.total || 0).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn success small"
                          onClick={() =>
                            downloadPdf(inv._id, inv.invoiceNumber)
                          }
                          title="Download PDF"
                        >
                          Download
                        </button>
                        <button
                          className="btn secondary small"
                          onClick={() => printInvoice(inv._id)}
                          title="Print Invoice"
                        >
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    <div className="empty-state">
                      <div className="empty-title">No invoices found</div>
                      <div className="empty-subtitle">
                        Create your first invoice from the Billing page
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <div className="pagination-controls">
            <button
              onClick={() => fetchPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="btn outline"
            >
              Previous
            </button>
            <button
              onClick={() => fetchPage(page + 1)}
              className="btn outline"
            >
              Next
            </button>
          </div>
          <div className="pagination-info">
            Page {page} • {total} total invoices
          </div>
        </div>
      </div>
    </div>
  );
}
