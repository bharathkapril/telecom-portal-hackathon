"use client";

import React, { useState } from "react";
import CustomerDashboard from "@/components/CustomerDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import { Role } from "@/types";

export default function TelecomPortal() {
  const [role, setRole] = useState<Role>(null);

  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Telecom SDLC Portal
          </h1>
          <p className="text-gray-500 mb-8">
            Select a role to view the live prototype.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => setRole("CUSTOMER")}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login as Customer
            </button>
            <button
              onClick={() => setRole("ADMIN")}
              className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Login as Administrator
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md"></div>
            <span className="text-xl font-bold text-gray-900">
              TelecomPortal
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm font-medium text-gray-600">
              Welcome, {role === "CUSTOMER" ? "Test Customer" : "System Admin"}
            </span>
            <button
              onClick={() => setRole(null)}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {role === "CUSTOMER" ? <CustomerDashboard /> : <AdminDashboard />}
      </main>
    </div>
  );
}
