import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Billing from "./pages/Billing";
import Invoices from "./pages/Invoices";
import Dashboard from "./pages/Dashboard";
import { testConnection } from "./api";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export const apiBase = API_BASE;

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [route, setRoute] = useState("billing"); // 'billing' or 'dashboard' or 'invoices'
  const [companySeeded, setCompanySeeded] = useState(false);

  useEffect(() => {
    if (!token) setRoute("login");
    else {
      if (route === "login") setRoute("billing");
    }

    // Test backend connection
    testConnection();
  }, [token]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRoute("login");
  };

  if (!token) {
    return (
      <div>
        <Login
          onSignIn={(t) => {
            localStorage.setItem("token", t);
            setToken(t);
          }}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">Billing System</div>
        <nav>
          <button
            className={route === "billing" ? "active" : ""}
            onClick={() => setRoute("billing")}
          >
            Billing
          </button>
          <button
            className={route === "invoices" ? "active" : ""}
            onClick={() => setRoute("invoices")}
          >
            Invoices
          </button>
          <button
            className={route === "dashboard" ? "active" : ""}
            onClick={() => setRoute("dashboard")}
          >
            Dashboard
          </button>
        </nav>
        <div className="signout">
          <button onClick={handleSignOut}>Sign out</button>
        </div>
      </aside>
      <main className="main">
        {route === "billing" && <Billing token={token} />}
        {route === "invoices" && <Invoices token={token} />}
        {route === "dashboard" && <Dashboard token={token} />}
      </main>
    </div>
  );
}

export default App;
