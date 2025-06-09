import React, { useEffect, useState } from "react";
import { Plan, Subscription } from "@/types/subscription";
import { subscriptionAPI } from "@/api/subscription";
import { PlanCard } from "./PlanCard";

export const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansResponse, subscriptionStatus] = await Promise.all([
        subscriptionAPI.getPlans(),
        subscriptionAPI.checkSubscription(),
      ]);

      setPlans(plansResponse.plans);

      if (subscriptionStatus.sub_status) {
        const subscription = await subscriptionAPI.getSubscriptionDetails();
        setCurrentSubscription(subscription);
      }
    } catch (error) {
      console.error("Error loading subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planId: number) => {
    setSubscribing(planId);
    try {
      if (currentSubscription) {
        await subscriptionAPI.changePlan(planId);
      } else {
        await subscriptionAPI.subscribe(planId);
      }
      await loadData(); // Reload data after subscription
    } catch (error) {
      console.error("Error subscribing:", error);
      alert("Error subscribing");
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка планов...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Планы подписки</h2>

      {currentSubscription && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-800">Активная подписка</h3>
          <p>План: {currentSubscription.plan_name}</p>
          <p>Осталось: {currentSubscription.remaining_limit} аренд</p>
          <p>
            Действует до:{" "}
            {new Date(currentSubscription.expires_at).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.plan_id}
            plan={plan}
            isCurrentPlan={currentSubscription?.plan_id === plan.plan_id}
            onSelect={handleSelectPlan}
            loading={subscribing === plan.plan_id}
          />
        ))}
      </div>
    </div>
  );
};
