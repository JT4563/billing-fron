import React, { useState } from "react";
import { apiBase } from "../App";

export default function Billing({ token }) {
  const [companyName, setCompanyName] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyGst, setCompanyGst] = useState("");
  const [ratePerTon, setRatePerTon] = useState(0);
  const [trucks, setTrucks] = useState(1);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState(null);
  const [creating, setCreating] = useState(false);
  const [lastCreatedInvoice, setLastCreatedInvoice] = useState(null);

  const total = Number(ratePerTon || 0) * Number(trucks || 0);

  const createInvoice = async () => {
    setMessage(null);
    setCreating(true);
    try {
      const res = await fetch(`${apiBase}/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName,
          companyPhone,
          companyAddress,
          companyGst,
          ratePerTon: Number(ratePerTon),
          trucks: Number(trucks),
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Create failed");
      setMessage({
        type: "success",
        text: `Invoice ${data.invoiceNumber} created — Total ₹${data.total}`,
      });
      setLastCreatedInvoice(data); // Store the created invoice data
      // reset minimal fields for next invoice
      setCompanyName("");
      setCompanyPhone("");
      setCompanyAddress("");
      setCompanyGst("");
      setRatePerTon(0);
      setTrucks(1);
      setNotes("");
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setCreating(false);
    }
  };

  const downloadInvoicePdf = async (invoiceId, invoiceNumber) => {
    try {
      const response = await fetch(`${apiBase}/invoices/${invoiceId}/pdf`, {
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

  const printInvoice = async (invoiceId) => {
    try {
      const response = await fetch(`${apiBase}/invoices/${invoiceId}/pdf`, {
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
        <h3>Create New Invoice</h3>

        {/* Customer Information Section */}
        <div style={{ marginBottom: "32px" }}>
          <div className="section-title">Customer / Company Details</div>

          <div className="form-row">
            <label className="label required">Company Name</label>
            <input
              className="input"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter customer or company name"
              required
            />
          </div>

          <div className="form-row split">
            <label className="label">Phone Number</label>
            <input
              className="input"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
            <label className="label">GST Number</label>
            <input
              className="input"
              value={companyGst}
              onChange={(e) => setCompanyGst(e.target.value)}
              placeholder="22AAAAA0000A1Z5"
            />
          </div>

          <div className="form-row">
            <label className="label">Billing Address</label>
            <input
              className="input"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              placeholder="Complete address for invoice"
            />
          </div>
        </div>

        {/* Invoice Details Section */}
        <div style={{ marginBottom: "32px" }}>
          <div className="section-title">Invoice Details</div>

          <div className="form-row split">
            <label className="label required">Rate per Ton (₹)</label>
            <input
              className="input"
              type="number"
              value={ratePerTon}
              onChange={(e) => setRatePerTon(e.target.value)}
              placeholder="1500"
              min="0"
              step="50"
              required
            />
            <label className="label required">Trucks (Qty)</label>
            <input
              className="input"
              type="number"
              value={trucks}
              onChange={(e) => setTrucks(e.target.value)}
              placeholder="1"
              min="1"
              required
            />
          </div>

          <div className="form-row">
            <label className="label">Additional Notes</label>
            <input
              className="input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special delivery instructions or remarks"
            />
          </div>
        </div>

        {/* Total Calculation */}
        <div className="total-display">
          <div className="total-label">Total Invoice Amount</div>
          <div className="total-amount">₹{total.toLocaleString("en-IN")}</div>
          {total > 0 && (
            <div className="total-breakdown">
              {trucks} truck{trucks > 1 ? "s" : ""} × ₹
              {Number(ratePerTon).toLocaleString("en-IN")}
              /ton
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}
        >
          <button
            className="btn outline"
            type="button"
            onClick={() => {
              setCompanyName("");
              setCompanyPhone("");
              setCompanyAddress("");
              setCompanyGst("");
              setRatePerTon(0);
              setTrucks(1);
              setNotes("");
              setMessage(null);
            }}
          >
            Clear Form
          </button>
          <button
            className="btn"
            onClick={createInvoice}
            disabled={creating || !companyName || !ratePerTon || !trucks}
            style={{ fontSize: "16px", padding: "16px 32px" }}
          >
            {creating ? (
              <span className="loading">Creating Invoice...</span>
            ) : (
              "Generate Invoice"
            )}
          </button>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className={`alert ${message.type}`}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "700", marginBottom: "4px" }}>
                {message.type === "success"
                  ? "Invoice Created Successfully"
                  : "Error Creating Invoice"}
              </div>
              <div>{message.text}</div>
            </div>
            {message.type === "success" && lastCreatedInvoice && (
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginLeft: "20px",
                }}
              >
                <button
                  className="btn success"
                  onClick={() =>
                    downloadInvoicePdf(
                      lastCreatedInvoice._id,
                      lastCreatedInvoice.invoiceNumber
                    )
                  }
                  style={{ fontSize: "14px", padding: "12px 16px" }}
                >
                  Download PDF
                </button>
                <button
                  className="btn secondary"
                  onClick={() => printInvoice(lastCreatedInvoice._id)}
                  style={{ fontSize: "14px", padding: "12px 16px" }}
                >
                  Print Invoice
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
