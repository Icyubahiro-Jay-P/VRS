import React from "react";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");

  if (!user) {
    return window.location.replace("/");
  }

  return children;
}
