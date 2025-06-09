import React from "react";
import { Plan } from "@/types/subscription";

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  onSelect: (planId: number) => void;
  loading?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isCurrentPlan,
  onSelect,
  loading,
}) => {
  return (
    <div
      className={`border rounded-lg p-6 ${
        isCurrentPlan
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
      {plan.description && (
        <p className="text-gray-600 mb-4">{plan.description}</p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Лимит аренды:</span>
          <span className="font-medium">{plan.rental_limit} игрушек</span>
        </div>
        <div className="flex justify-between">
          <span>Длительность:</span>
          <span className="font-medium">{plan.duration}</span>
        </div>
        <div className="flex justify-between">
          <span>Цена:</span>
          <span className="font-bold text-lg">
            {plan.price.toLocaleString()} ₸
          </span>
        </div>
      </div>

      {isCurrentPlan ? (
        <div className="bg-blue-100 text-blue-800 py-2 px-4 rounded text-center">
          Текущий план
        </div>
      ) : (
        <button
          onClick={() => onSelect(plan.plan_id)}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Choose Plan"}
        </button>
      )}
    </div>
  );
};
