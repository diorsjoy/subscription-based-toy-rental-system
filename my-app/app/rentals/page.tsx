import { RentalManagement } from "@/components/rentals/RentalManagement";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ProtectedRoute } from "@/lib/contexts/AuthContext";

export default function RentalsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">My Rentals</h1>
              <p className="text-gray-600">
                Manage your current and past toy rentals
              </p>
            </div>
            <RentalManagement />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
