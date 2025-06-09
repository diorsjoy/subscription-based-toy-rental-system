import React, { useEffect, useState } from "react";
import { Subscription } from "@/types/subscription";
import { subscriptionAPI } from "@/api/subscription";

export const SubscriptionStatus: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const status = await subscriptionAPI.checkSubscription();
      if (status.sub_status) {
        const details = await subscriptionAPI.getSubscriptionDetails();
        setSubscription(details);
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!confirm("Вы уверены, что хотите отменить подписку?")) return;

    try {
      await subscriptionAPI.unsubscribe();
      setSubscription(null);
    } catch (error) {
      console.error("Error unsubscribing:", error);
      alert("Ошибка при отмене подписки");
    }
  };

  if (loading) return <div>Загрузка...</div>;

  if (!subscription) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">У вас нет активной подписки</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Ваша подписка</h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>План:</span>
          <span className="font-medium">{subscription.plan_name}</span>
        </div>
        <div className="flex justify-between">
          <span>Осталось аренд:</span>
          <span className="font-medium">{subscription.remaining_limit}</span>
        </div>
        <div className="flex justify-between">
          <span>Действует до:</span>
          <span className="font-medium">
            {new Date(subscription.expires_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <button
          onClick={() => (window.location.href = "/subscription/plans")}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Изменить план
        </button>
        <button
          onClick={handleUnsubscribe}
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Отменить подписку
        </button>
      </div>
    </div>
  );
};
