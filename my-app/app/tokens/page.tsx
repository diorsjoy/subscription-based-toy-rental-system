import { TokenPurchase } from "@/components/tokens/TokenPurchase";
import { CurrencyConverter } from "@/components/tokens/CurrencyConverter";
import { KazakhstanPaymentInfo } from "@/components/tokens/KazakhstanPaymentInfo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ProtectedRoute } from "@/lib/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTokens } from "@/components/providers/token-provider";

export default function TokensPage() {
  const { balance, transactions } = useTokens();

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Token Management</h1>
              <p className="text-gray-600">
                Purchase and manage your rental tokens
              </p>
            </div>

            {/* Token Balance Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Current Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {balance} Tokens
                </div>
                <p className="text-gray-600 mt-2">Available for toy rentals</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="purchase" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="purchase">Purchase Tokens</TabsTrigger>
                <TabsTrigger value="converter">Currency Converter</TabsTrigger>
                <TabsTrigger value="payment-info">Payment Methods</TabsTrigger>
              </TabsList>

              <TabsContent value="purchase" className="mt-6">
                <TokenPurchase />
              </TabsContent>

              <TabsContent value="converter" className="mt-6">
                <CurrencyConverter />
              </TabsContent>

              <TabsContent value="payment-info" className="mt-6">
                <KazakhstanPaymentInfo />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
