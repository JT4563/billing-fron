// API utility functions for the billing frontend
import { apiBase } from "./App";

// Test backend connection
export const testConnection = async () => {
  try {
    const response = await fetch(`${apiBase}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("✅ Backend connection successful");
      return true;
    } else {
      console.log("❌ Backend connection failed:", response.status);
      return false;
    }
  } catch (error) {
    console.log("❌ Backend connection error:", error.message);
    return false;
  }
};

// Generic API call function with authentication
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${apiBase}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
