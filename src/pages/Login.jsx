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
        display: "grid",
        placeItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div
        className="card"
        style={{
          width: "450px",
          maxWidth: "90vw",
          textAlign: "center",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              fontSize: "48px",
              marginBottom: "16px",
            }}
          >
            🏗️
          </div>
          <h2
            style={{
              margin: "0 0 8px 0",
              color: "var(--accent)",
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            Sand Company Billing
          </h2>
          <p className="small-muted" style={{ fontSize: "16px" }}>
            Owner Access Portal
          </p>
        </div>

        <form onSubmit={submit}>
          <div
            className="form-row"
            style={{
              flexDirection: "column",
              alignItems: "stretch",
              textAlign: "left",
            }}
          >
            <div
              className="label"
              style={{ marginBottom: "8px", fontWeight: "600" }}
            >
              🔐 Access Code
            </div>
            <input
              className="input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your access code"
              style={{
                fontSize: "16px",
                padding: "16px",
                textAlign: "center",
                letterSpacing: "2px",
                fontWeight: "600",
              }}
              autoFocus
            />
          </div>

          {error && (
            <div
              className="alert error"
              style={{ marginTop: "16px", textAlign: "left" }}
            >
              <strong>❌ Access Denied</strong>
              <div>{error}</div>
            </div>
          )}

          <div style={{ marginTop: "24px" }}>
            <button
              className="btn"
              onClick={submit}
              disabled={loading || !code.trim()}
              style={{
                width: "100%",
                fontSize: "16px",
                padding: "16px",
                fontWeight: "600",
              }}
            >
              {loading ? (
                <span className="loading">Authenticating...</span>
              ) : (
                <>🚀 Sign In</>
              )}
            </button>
          </div>
        </form>

        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            background: "#f8fafc",
            borderRadius: "8px",
            fontSize: "14px",
            color: "var(--muted)",
          }}
        >
          <div style={{ fontWeight: "600", marginBottom: "4px" }}>
            📋 System Information
          </div>
          <div>Secure billing system for sand delivery operations</div>
          <div>Contact administrator for access code</div>
        </div>
      </div>
    </div>
  );
}
