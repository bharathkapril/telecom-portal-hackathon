"use client";

import React, { useState, useEffect } from "react";
import { Plan, AuditLog } from "@/types";

export default function AdminDashboard() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // Modal State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    dataLimit: "",
  });

  const fetchPlans = () => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setPlans(
            json.data.map((p: any) => ({
              id: p.id,
              name: p.plan_name,
              price: p.price,
              dataLimit: p.data_limit_gb,
              features: [],
            })),
          );
        }
      });
  };

  useEffect(() => {
    fetchPlans();
    fetch("/api/logs")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setLogs(json.data);
      });
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({ name: "", price: "", dataLimit: "" });
    setIsPlanModalOpen(true);
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      dataLimit: plan.dataLimit.toString(),
    });
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = async () => {
    const method = editingPlan ? "PUT" : "POST";
    const body = JSON.stringify({
      id: editingPlan?.id,
      name: formData.name,
      price: parseFloat(formData.price),
      dataLimit: parseInt(formData.dataLimit, 10),
    });

    const res = await fetch("/api/plans", {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    const result = await res.json();
    if (result.success) {
      setIsPlanModalOpen(false);
      fetchPlans(); // Refresh table
    } else {
      alert("Error saving plan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      const res = await fetch("/api/plans", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (result.success) {
        fetchPlans(); // Refresh table
      } else {
        alert(result.error || "Error deleting plan.");
      }
    }
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,ID,Customer ID,Action,Date\n" +
      logs
        .map((e) => `${e.id},${e.customerId},${e.action},${e.date}`)
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Manage Plans Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Manage Plans</h2>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
          >
            + Create New Plan
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="pb-3 font-medium">Plan Name</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Data Limit</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr
                  key={plan.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="py-4 font-medium text-gray-900">
                    {plan.name}
                  </td>
                  <td className="py-4 text-gray-600">${plan.price}</td>
                  <td className="py-4 text-gray-600">{plan.dataLimit} GB</td>
                  <td className="py-4 text-right space-x-3">
                    <button
                      onClick={() => openEditModal(plan)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Modal Form */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4">
              {editingPlan ? "Edit Plan" : "Create New Plan"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monthly Price ($)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data Limit (GB)
                </label>
                <input
                  type="number"
                  value={formData.dataLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, dataLimit: e.target.value })
                  }
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlan}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Audit Logs</h2>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            Export to CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="pb-3 font-medium">Date/Time</th>
                <th className="pb-3 font-medium">Customer Username</th>
                <th className="pb-3 font-medium">Action Taken</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500">
                    No logs yet. Switch a plan as a customer to create one!
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-4 text-sm text-gray-500">{log.date}</td>
                    <td className="py-4 font-medium text-gray-900">
                      {log.customerId}
                    </td>
                    <td className="py-4 text-gray-600">{log.action}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
