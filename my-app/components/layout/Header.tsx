import React from "react";
import { useSubscription } from "@/hooks/useSubscription";

export const Header = () => {
  const { subscription, loading } = useSubscription();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Аренда игрушек</h1>
          </div>

          <nav className="flex items-center space-x-6">
            <a href="/" className="text-gray-600 hover:text-gray-900">
              Каталог
            </a>
            <a href="/my-rentals" className="text-gray-600 hover:text-gray-900">
              Мои аренды
            </a>

            {!loading && (
              <>
                {subscription ? (
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Токены: </span>
                      <span className="font-semibold text-green-600">
                        {subscription.remaining_limit}
                      </span>
                    </div>
                    <a
                      href="/subscription/manage"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Подписка
                    </a>
                    <a
                      href="/tokens/purchase"
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Купить токены
                    </a>
                  </div>
                ) : (
                  <a
                    href="/subscription/plans"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Оформить подписку
                  </a>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
