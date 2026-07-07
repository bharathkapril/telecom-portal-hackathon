"use client";

import React, { useState, useEffect } from "react";
import { Plan } from "@/types";

export default function CustomerDashboard() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Live Plans from the Database
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/plans");
        const json = await response.json();
        if (json.success) {
          // Map DB columns to Frontend interface
          const livePlans = json.data.map((dbPlan: any) => ({
            id: dbPlan.id,
            name: dbPlan.plan_name,
            price: parseFloat(dbPlan.price),
            dataLimit: dbPlan.data_limit_gb,
            features: [
              `${dbPlan.data_limit_gb}GB High-Speed Data`,
              "Unlimited Talk & Text",
            ],
          }));
          setPlans(livePlans);
          setCurrentPlan(livePlans[0]); // Set default current plan for demo
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSwitchClick = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // 2. Execute the Database Transaction
  const confirmSwitch = async () => {
    if (selectedPlan) {
      try {
        const response = await fetch("/api/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // ---> PASTE YOUR TEST USER UUID HERE <---
            requestedUserId: "05a4de82-5567-49f0-aca2-984f027c8041",
            newPlanId: selectedPlan.id,
            planName: selectedPlan.name,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setCurrentPlan(selectedPlan);
          setIsModalOpen(false);
          alert(
            `Success! Your database transaction worked. Switched to ${selectedPlan.name}!`,
          );
        } else {
          alert("Database Error: Could not update plan.");
        }
      } catch (error) {
        console.error("Transaction failed", error);
      }
    }
  };

  if (isLoading || !currentPlan)
    return <div className="p-8 text-center">Loading live database...</div>;

  return (
    <div className="space-y-8">
      {/* Current Plan Hero */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Your Current Plan</h2>
        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div>
            <h3 className="text-2xl font-bold text-blue-900">
              {currentPlan.name}
            </h3>
            <p className="text-gray-600">${currentPlan.price} / month</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">Data Usage</p>
            <p className="text-lg font-bold text-gray-800">
              2.1 GB / {currentPlan.dataLimit} GB
            </p>
          </div>
        </div>
      </div>

      {/* Available Plans Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col"
            >
              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <p className="text-3xl font-extrabold my-4">
                ${plan.price}
                <span className="text-sm font-normal text-gray-500">/mo</span>
              </p>
              <ul className="mb-6 flex-1 space-y-2 text-gray-600">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <span className="mr-2 text-green-500">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button
                disabled={currentPlan.id === plan.id}
                onClick={() => handleSwitchClick(plan)}
                className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                  currentPlan.id === plan.id
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {currentPlan.id === plan.id
                  ? "Current Plan"
                  : "Switch to this Plan"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Confirm Plan Change</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to switch to the{" "}
              <strong>{selectedPlan.name}</strong> plan? Your new monthly rate
              will be <strong>${selectedPlan.price}</strong>.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwitch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
