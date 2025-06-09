// Simple Cart Fix - Just Get Toy Names
"use client";

import {
  useState,
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Loader2, Camera, Plus, Minus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";

// Toy interface
interface Toy {
  id: number;
  title: string;
  desc: string;
  value: number;
  images: string[];
  skills: string[];
  categories: string[];
  recommendedAge: string;
  manufacturer: string;
  isAvailable: boolean;
}

// Cart item
type CartItem = {
  toyId: string | number;
  quantity: number;
  // Enhanced fields
  title?: string;
  value?: number;
  desc?: string;
  images?: string[];
  categories?: string[];
  recommendedAge?: string;
  manufacturer?: string;
  isAvailable?: boolean;
};

type OperationStatus =
  | "STATUS_OK"
  | "STATUS_INVALID_TOY"
  | "STATUS_INVALID_USER"
  | "STATUS_INVALID_QTY"
  | "STATUS_INTERNAL_ERROR"
  | "STATUS_CART_EMPTY"
  | "STATUS_TOY_NOT_IN_CART"
  | "STATUS_UNAUTHORIZED"
  | "STATUS_DUPLICATE_ITEM";

type AddToCartResponse = {
  opStatus: OperationStatus;
  message: string;
};

type DelFromCartResponse = {
  opStatus: OperationStatus;
  message: string;
};

type GetCartResponse = {
  items: CartItem[];
  total_items?: number;
  totalItems?: number;
  total_quantity?: number;
  totalQuantity?: number;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalQuantity: number;
  loading: boolean;
  addItem: (toyId: number, quantity?: number) => Promise<boolean>;
  removeItem: (toyId: number) => Promise<boolean>;
  updateQuantity: (toyId: number, quantity: number) => Promise<boolean>;
  refreshCart: () => Promise<void>;
  clearCart: () => Promise<boolean>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// API URLs - Fixed to remove double v1
const CART_API_URL =
  process.env.NEXT_PUBLIC_GRPC_GATEWAY_URL2 || "http://localhost:8081";
const TOY_API_URL =
  process.env.NEXT_PUBLIC_GRPC_GATEWAY_URL1 || "http://localhost:3030";

// Simple function to get toy details
async function getToyDetails(toyId: number): Promise<Toy | null> {
  try {
    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Fixed: Use /toys/ instead of /v1/toys/ since TOY_API_URL already includes /v1
    const url = `${TOY_API_URL}/toys/${toyId}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ Failed to fetch toy ${toyId}: ${response.status} - ${errorText}`
      );
      return null;
    }

    const data = await response.json();

    // Handle different response formats
    if (data.toy) {
      return data.toy;
    } else if (data.id) {
      return data;
    } else {
      console.error(`❌ Unexpected response format for toy ${toyId}:`, data);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error fetching toy ${toyId}:`, error);
    return null;
  }
}

// Cart API Service
class CartService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${CART_API_URL}${endpoint}`, {
      headers,
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.errorMsg || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  static async addToCart(
    toyId: number,
    quantity: number = 1
  ): Promise<AddToCartResponse> {
    return this.request<AddToCartResponse>("/v1/cart", {
      method: "POST",
      body: JSON.stringify({ toy_id: toyId, quantity }),
    });
  }

  static async removeFromCart(toyId: number): Promise<DelFromCartResponse> {
    return this.request<DelFromCartResponse>(`/v1/cart/${toyId}`, {
      method: "DELETE",
    });
  }

  static async updateCartQuantity(
    toyId: number,
    quantity: number
  ): Promise<AddToCartResponse> {
    return this.request<AddToCartResponse>("/v1/cart", {
      method: "PUT",
      body: JSON.stringify({ toy_id: toyId, quantity }),
    });
  }

  static async getCart(): Promise<GetCartResponse> {
    return this.request<GetCartResponse>("/v1/cart", { method: "GET" });
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setItems([]);
      setTotalItems(0);
      setTotalQuantity(0);
      return;
    }

    setLoading(true);
    try {
      const response = await CartService.getCart();

      const cartItems = response.items || [];

      if (cartItems.length === 0) {
        setItems([]);
        setTotalItems(0);
        setTotalQuantity(0);
        setLoading(false);
        return;
      }

      // Process each cart item and try to get toy details
      const enhancedItems: CartItem[] = [];

      for (const cartItem of cartItems) {
        const toyId =
          typeof cartItem.toyId === "string"
            ? parseInt(cartItem.toyId, 10)
            : cartItem.toyId;

        const toyDetails = await getToyDetails(toyId);

        if (toyDetails) {
          enhancedItems.push({
            ...cartItem,
            toyId,
            title: toyDetails.title,
            value: toyDetails.value,
            desc: toyDetails.desc,
            images: toyDetails.images,
            categories: toyDetails.categories,
            recommendedAge: toyDetails.recommendedAge,
            manufacturer: toyDetails.manufacturer,
            isAvailable: toyDetails.isAvailable,
          });
        } else {
          enhancedItems.push({
            ...cartItem,
            toyId,
            title: cartItem.title || `Toy #${toyId}`,
            value: cartItem.value || 0,
            desc: cartItem.desc || "",
            images: cartItem.images || [],
            categories: cartItem.categories || [],
            recommendedAge: cartItem.recommendedAge || "",
            manufacturer: cartItem.manufacturer || "",
            isAvailable: cartItem.isAvailable !== false,
          });
        }
      }

      const totalItems =
        response.totalItems || response.total_items || enhancedItems.length;
      const totalQuantity =
        response.totalQuantity ||
        response.total_quantity ||
        enhancedItems.reduce((sum, item) => sum + item.quantity, 0);

      setItems(enhancedItems);
      setTotalItems(totalItems);
      setTotalQuantity(totalQuantity);
    } catch (error) {
      console.error("❌ Failed to refresh cart:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (isAuthenticated) {
        toast({
          title: "Error",
          description: `Failed to load cart: ${errorMessage}`,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (
    toyId: number,
    quantity: number = 1
  ): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    try {
      const response = await CartService.addToCart(toyId, quantity);

      if (response.opStatus === "STATUS_OK") {
        await refreshCart();

        // Try to get toy name for better message
        const toyDetails = await getToyDetails(toyId);
        const toyName = toyDetails?.title || `Toy #${toyId}`;

        toast({
          title: "Added to Cart! 🛒",
          description: `${toyName} has been added to your cart`,
        });
        return true;
      } else {
        let errorMessage = response.message || "Failed to add item to cart";
        if (response.opStatus === "STATUS_INVALID_USER") {
          errorMessage = "Authentication expired. Please log in again.";
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("❌ Failed to add item to cart:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (toyId: number): Promise<boolean> => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to manage your cart.",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    try {
      const item = items.find((item) => Number(item.toyId) === toyId);
      const itemName = item?.title || `Toy #${toyId}`;

      const response = await CartService.removeFromCart(toyId);

      if (response.opStatus === "STATUS_OK") {
        await refreshCart();
        toast({
          title: "Removed from Cart",
          description: `${itemName} has been removed from your cart`,
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to remove item from cart",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (
    toyId: number,
    quantity: number
  ): Promise<boolean> => {
    if (!isAuthenticated) return false;
    if (quantity <= 0) return removeItem(toyId);

    setLoading(true);
    try {
      const response = await CartService.updateCartQuantity(toyId, quantity);

      if (response.opStatus === "STATUS_OK") {
        await refreshCart();
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update quantity",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async (): Promise<boolean> => {
    if (!isAuthenticated) return false;

    setLoading(true);
    try {
      const clearPromises = items.map((item) =>
        CartService.removeFromCart(Number(item.toyId))
      );
      await Promise.all(clearPromises);

      await refreshCart();
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart",
      });
      return true;
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setItems([]);
      setTotalItems(0);
      setTotalQuantity(0);
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalQuantity,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        refreshCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartButton() {
  const { totalItems, loading } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative" disabled={loading}>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ShoppingCart className="h-5 w-5" />
          )}
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <CartDrawer />
      </SheetContent>
    </Sheet>
  );
}

function CartDrawer() {
  const {
    items,
    totalQuantity,
    loading,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const totalCost = items.reduce((sum, item) => {
    const price = item.value || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Checkout Initiated",
      description: "Redirecting to payment page...",
    });
    router.push("/checkout");
  };

  const handleRemoveItem = async (item: CartItem) => {
    const toyId = Number(item.toyId);
    if (!toyId || isNaN(toyId)) {
      toast({
        title: "Error",
        description: "Cannot remove item - invalid toy ID",
        variant: "destructive",
      });
      return;
    }
    await removeItem(toyId);
  };

  const handleQuantityChange = async (item: CartItem, newQuantity: number) => {
    const toyId = Number(item.toyId);
    if (!toyId || isNaN(toyId)) {
      toast({
        title: "Error",
        description: "Cannot update quantity - invalid toy ID",
        variant: "destructive",
      });
      return;
    }
    await updateQuantity(toyId, newQuantity);
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Your Cart ({totalQuantity} items)
        </SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading cart...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => router.push("/browse")}>Browse Toys</Button>
          </div>
        ) : (
          items.map((item, index) => {
            const toyName = item.title || `Toy #${item.toyId}`;
            const toyPrice = item.value || 0;
            const toyDescription = item.desc || "";
            const toyImage = item.images?.[0] || "";
            const itemTotal = toyPrice * item.quantity;

            return (
              <div
                key={`cart-item-${index}-${item.toyId}`}
                className="mb-4 p-4 border rounded-lg bg-white shadow-sm"
              >
                <div className="flex gap-3">
                  {/* Toy Image */}
                  <div className="w-20 h-20 flex-shrink-0">
                    {toyImage ? (
                      <img
                        src={toyImage}
                        alt={toyName}
                        className="w-full h-full object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback =
                            e.currentTarget.parentElement?.querySelector(
                              ".cart-image-fallback"
                            );
                          if (fallback) {
                            (fallback as HTMLElement).style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className={`cart-image-fallback w-full h-full bg-gray-100 rounded-lg border flex items-center justify-center ${
                        toyImage ? "hidden" : "flex"
                      }`}
                    >
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>

                  {/* Toy Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg leading-tight">
                          {toyName}
                        </h3>

                        {item.manufacturer && (
                          <p className="text-sm text-gray-600 mt-1">
                            by {item.manufacturer}
                          </p>
                        )}

                        {toyDescription && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            {toyDescription}
                          </p>
                        )}

                        {/* Categories and Age */}
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {item.categories?.slice(0, 2).map((category) => (
                            <span
                              key={category}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                          {item.recommendedAge && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Age: {item.recommendedAge}
                            </span>
                          )}
                        </div>

                        {/* Price */}
                        <div className="mt-3">
                          <p className="text-lg font-bold text-blue-600">
                            {toyPrice.toLocaleString()} KZT each
                          </p>
                          <p className="text-sm text-gray-600">
                            Total: {itemTotal.toLocaleString()} KZT
                          </p>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item)}
                        disabled={loading}
                        className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Quantity:</span>
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item, item.quantity - 1)
                            }
                            disabled={loading || item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item, item.quantity + 1)
                            }
                            disabled={loading}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Summary */}
      {items.length > 0 && (
        <div className="border-t pt-4 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Total Items:</span>
              <span className="font-medium">{totalQuantity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total Cost:</span>
              <span className="text-lg font-bold text-blue-600">
                {totalCost.toLocaleString()} KZT
              </span>
            </div>
          </div>

          <Button
            className="w-full h-12 text-lg"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span className="font-medium">Proceed to Checkout</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={clearCart}
            disabled={loading}
          >
            Clear Cart
          </Button>
        </div>
      )}
    </div>
  );
}
