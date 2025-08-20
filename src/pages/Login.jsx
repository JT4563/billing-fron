import React, { useState } from "react";
import { apiBase } from "../App";

export default function Login({ onSignIn }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e && e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Sign-in failed");
      onSignIn(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--gradient-primary)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "48px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Company Branding */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "var(--gradient-primary)",
              borderRadius: "20px",
              margin: "0 auto 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "32px",
              fontWeight: "700",
              letterSpacing: "-1px",
            }}
          >
            SB
          </div>
          <h1
            style={{
              color: "var(--text)",
              fontSize: "28px",
              fontWeight: "700",
              margin: "0 0 8px 0",
              letterSpacing: "-0.5px",
            }}
          >
            Sand Billing System
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "16px",
              margin: "0",
              fontWeight: "500",
            }}
          >
            Secure Access – Enter your code
          </p>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                color: "var(--text)",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Access Code
            </label>
            <input
              className="input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your access code"
              style={{
                width: "100%",
                fontSize: "18px",
                padding: "16px 20px",
                textAlign: "center",
                letterSpacing: "2px",
                fontWeight: "600",
                border: error
                  ? "2px solid var(--error)"
                  : "2px solid var(--border)",
              }}
              autoFocus
              autoComplete="off"
            />
            {error && (
              <div
                style={{
                  color: "var(--error)",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginTop: "8px",
                  padding: "8px 12px",
                  background: "#fef2f2",
                  borderRadius: "6px",
                  border: "1px solid #fecaca",
                }}
              >
                Access Denied: {error}
              </div>
            )}
          </div>

          <button
            className="btn"
            type="submit"
            disabled={loading || !code.trim()}
            style={{
              width: "100%",
              fontSize: "16px",
              padding: "16px",
              fontWeight: "700",
              background:
                loading || !code.trim() ? "var(--muted)" : "var(--primary)",
            }}
          >
            {loading ? (
              <span className="loading">Authenticating...</span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer Information */}
        <div
          style={{
            marginTop: "32px",
            padding: "20px",
            background: "#f8fafc",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "var(--text)",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Professional Billing Solution
          </div>
          <div
            style={{
              color: "var(--muted)",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
          >
            Secure billing system for construction and sand delivery operations.
            <br />
            Contact your administrator for access credentials.
          </div>
        </div>
      </div>
    </div>
  );
}
