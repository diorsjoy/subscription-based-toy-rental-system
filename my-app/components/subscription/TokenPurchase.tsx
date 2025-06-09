import React, { useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
const TOKEN_PACKAGES = [
  { amount: 5, price: 1000, bonus: 0 },
  { amount: 10, price: 1800, bonus: 2 },
  { amount: 25, price: 4000, bonus: 5 },
  { amount: 50, price: 7500, bonus: 15 },
];

export const TokenPurchase: React.FC = () => {
  const { subscription, addTokens } = useSubscription();
  const [purchasing, setPurchasing] = useState<number | null>(null);

  const handlePurchase = async (packageIndex: number) => {
    const tokenPackage = TOKEN_PACKAGES[packageIndex];

    setPurchasing(packageIndex);
    try {
      // Simulate payment process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Add tokens to balance
      const totalTokens = tokenPackage.amount + tokenPackage.bonus;
      await addTokens(totalTokens);

      alert(`Успешно куплено ${totalTokens} токенов!`);
    } catch (error) {
      alert("Ошибка при покупке токенов");
    } finally {
      setPurchasing(null);
    }
  };

  if (!subscription) {
    return (
      <div className="text-center py-8">
        <p>Сначала оформите подписку для покупки токенов</p>
        <button
          onClick={() => (window.location.href = "/subscription/plans")}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Оформить подписку
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Покупка токенов</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800">
          Текущий баланс:{" "}
          <strong>{subscription.remaining_limit} токенов</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TOKEN_PACKAGES.map((pkg, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              {pkg.amount} токенов
              {pkg.bonus > 0 && (
                <span className="text-green-600"> +{pkg.bonus} бонус</span>
              )}
            </h3>
            <p className="text-gray-600 mb-4">{pkg.price.toLocaleString()} ₸</p>
            <button
              onClick={() => handlePurchase(index)}
              disabled={purchasing === index}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {purchasing === index ? "Покупка..." : "Купить"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
