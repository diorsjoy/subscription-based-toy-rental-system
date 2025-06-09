"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  Calendar,
  MapPin,
  Upload,
  X,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Grid,
  List,
  SlidersHorizontal,
  Camera,
  Package,
  LogOut,
  User,
} from "lucide-react";
import { useAuth, ProtectedRoute } from "@/lib/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Types
interface ToyData {
  title: string;
  description: string;
  value: string;
  images: string[];
  skills: string[];
  categories: string[];
  recommendedAge: string;
  manufacturer: string;
  isAvailable: boolean;
}

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

interface ApiFilters {
  page?: string;
  pageSize?: string;
  sort?: string;
  title?: string;
  from?: string;
  to?: string;
  categories?: string[];
  skills?: string[];
}

interface ApiMetadata {
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  firstPage: number;
  lastPage: number;
}

interface ApiResponse {
  toys: Toy[];
  metadata: ApiMetadata;
  status: string;
  errorMsg?: string;
}

interface NotificationProps {
  type: "error" | "success";
  message: string;
  onClose: () => void;
}

// Backend API integration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_GRPC_GATEWAY_URL1 || "http://localhost:3030";

// Use AuthContext for token management
const useApiHeaders = () => {
  const { user } = useAuth();

  const getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  };

  return (): Record<string, string> => {
    const token = getAuthToken();
    console.log("🔑 Using token:", token ? "Token exists" : "No token found");
    console.log("👤 User email:", user?.email);

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };
};

// API calls with better error handling and validation
const createToyAPI = (getHeaders: () => Record<string, string>) => ({
  // List toys with filters
  listToys: async (filters: ApiFilters = {}): Promise<ApiResponse> => {
    const params = new URLSearchParams({
      page: filters.page || "1",
      pageSize: filters.pageSize || "20",
      sort: filters.sort || "id",
      title: filters.title || "",
      from: filters.from || "0",
      to: filters.to || "150000",
    });

    if (filters.categories?.length) {
      filters.categories.forEach((cat: string) =>
        params.append("categories", cat)
      );
    }
    if (filters.skills?.length) {
      filters.skills.forEach((skill: string) => params.append("skills", skill));
    }

    console.log("🔍 Fetching toys with params:", params.toString());

    const response = await fetch(`${API_BASE_URL}/toys?${params}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      throw new Error("Failed to fetch toys");
    }

    const data = await response.json();
    console.log("📦 Toys API Response:", data);
    return data;
  },

  // Create new toy - FIXED: Ensure isAvailable defaults to true
  createToy: async (toyData: ToyData): Promise<any> => {
    console.log("🚀 Creating toy:", toyData);

    // Validate required fields
    if (!toyData.title?.trim()) {
      throw new Error("Title is required");
    }
    if (!toyData.description?.trim()) {
      throw new Error("Description is required");
    }
    if (!toyData.value || parseInt(toyData.value) <= 0) {
      throw new Error("Valid value is required");
    }
    if (!toyData.manufacturer?.trim()) {
      throw new Error("Manufacturer is required");
    }
    if (!toyData.recommendedAge?.trim()) {
      throw new Error("Recommended age is required");
    }
    if (!toyData.categories?.length) {
      throw new Error("At least one category is required");
    }
    if (!toyData.skills?.length) {
      throw new Error("At least one skill is required");
    }
    if (!toyData.images?.length) {
      throw new Error("At least one image is required");
    }

    const payload = {
      title: toyData.title.trim(),
      desc: toyData.description.trim(),
      value: parseInt(toyData.value),
      images: toyData.images,
      skills: toyData.skills,
      categories: toyData.categories,
      recommendedAge: toyData.recommendedAge.trim(),
      manufacturer: toyData.manufacturer.trim(),
      // FIXED: Default to available
      isAvailable:
        toyData.isAvailable !== undefined ? toyData.isAvailable : true,
    };

    console.log("📤 Sending payload:", payload);

    try {
      const response = await fetch(`${API_BASE_URL}/toys`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);

        if (response.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        }
        if (response.status === 403) {
          throw new Error("Admin privileges required to create toys.");
        }
        if (response.status === 400) {
          throw new Error("Invalid toy data: " + errorText);
        }
        if (response.status === 404) {
          throw new Error(
            "API endpoint not found. Check if backend is running."
          );
        }

        throw new Error(
          `Failed to create toy: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("✅ Success response:", result);
      return result;
    } catch (error) {
      console.error("🔥 Create toy error:", error);
      throw error;
    }
  },

  // Update toy - FIXED: Add proper validation
  updateToy: async (toyId: number, toyData: ToyData): Promise<any> => {
    console.log("🔄 Updating toy:", toyId, toyData);

    // Validate required fields
    if (!toyData.title?.trim()) {
      throw new Error("Title is required");
    }
    if (!toyData.description?.trim()) {
      throw new Error("Description is required");
    }
    if (!toyData.value || parseInt(toyData.value) <= 0) {
      throw new Error("Valid value is required");
    }
    if (!toyData.manufacturer?.trim()) {
      throw new Error("Manufacturer is required");
    }
    if (!toyData.recommendedAge?.trim()) {
      throw new Error("Recommended age is required");
    }
    if (!toyData.categories?.length) {
      throw new Error("At least one category is required");
    }
    if (!toyData.skills?.length) {
      throw new Error("At least one skill is required");
    }
    if (!toyData.images?.length) {
      throw new Error("At least one image is required");
    }

    const payload = {
      toy: {
        id: toyId,
        title: toyData.title.trim(),
        desc: toyData.description.trim(),
        value: parseInt(toyData.value),
        images: toyData.images,
        skills: toyData.skills,
        categories: toyData.categories,
        recommendedAge: toyData.recommendedAge.trim(),
        manufacturer: toyData.manufacturer.trim(),
        isAvailable: toyData.isAvailable,
      },
    };

    console.log("📤 Update payload:", payload);

    const response = await fetch(`${API_BASE_URL}/toys/${toyId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Update Error:", errorText);

      if (response.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      if (response.status === 400) {
        throw new Error("Invalid toy data: " + errorText);
      }
      if (response.status === 404) {
        throw new Error("Toy not found");
      }

      throw new Error(
        `Failed to update toy: ${response.status} - ${errorText}`
      );
    }

    const result = await response.json();
    console.log("✅ Update success:", result);
    return result;
  },

  // Delete toy
  deleteToy: async (toyId: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/toys/${toyId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      if (response.status === 404) {
        throw new Error("Toy not found");
      }
      throw new Error("Failed to delete toy");
    }
    return response.json();
  },

  // Get single toy - FIXED: Better error handling
  getToy: async (toyId: number): Promise<any> => {
    console.log("🔍 Fetching toy:", toyId);

    const response = await fetch(`${API_BASE_URL}/toys/${toyId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    console.log("📡 Get toy response status:", response.status);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      if (response.status === 404) {
        throw new Error("Toy not found");
      }
      throw new Error("Failed to fetch toy");
    }

    const result = await response.json();
    console.log("📦 Get toy result:", result);
    return result;
  },
});

const ToysAdminPanel: React.FC = () => {
  // Auth context integration
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const getHeaders = useApiHeaders();
  const toyAPI = createToyAPI(getHeaders);

  const [activeTab, setActiveTab] = useState("admin");
  const [toys, setToys] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form and filter states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingToy, setEditingToy] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [metadata, setMetadata] = useState<ApiMetadata>({
    totalRecords: 0,
    currentPage: 1,
    pageSize: 20,
    firstPage: 1,
    lastPage: 1,
  });

  // Categories and skills based on your backend structure
  const categories = [
    "Educational",
    "Building Sets",
    "Action Figures",
    "Dolls & Accessories",
    "Board Games",
    "Outdoor Toys",
    "Electronic Toys",
    "Arts & Crafts",
  ];

  const skillOptions = [
    "Problem Solving",
    "Creativity",
    "Motor Skills",
    "Social Skills",
    "Logic",
    "Imagination",
    "Coordination",
    "Memory",
    "Engineering",
  ];

  // FIXED: Default form data with isAvailable: true
  const [formData, setFormData] = useState<ToyData>({
    title: "",
    description: "",
    value: "",
    images: [],
    skills: [],
    categories: [],
    recommendedAge: "",
    manufacturer: "",
    isAvailable: true, // FIXED: Default to available
  });

  // Load toys on component mount and when filters change
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadToys();
    }
  }, [
    searchTerm,
    selectedCategory,
    priceRange,
    currentPage,
    isAuthenticated,
    authLoading,
  ]);

  const loadToys = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const filters: ApiFilters = {
        page: currentPage.toString(),
        pageSize: "20",
        title: searchTerm,
        from: priceRange[0].toString(),
        to: priceRange[1].toString(),
        categories: selectedCategory ? [selectedCategory] : [],
        sort: "id",
      };

      const response = await toyAPI.listToys(filters);
      console.log("📊 Setting toys:", response.toys);
      setToys(response.toys || []);
      setMetadata(
        response.metadata || {
          totalRecords: 0,
          currentPage: 1,
          pageSize: 20,
          firstPage: 1,
          lastPage: 1,
        }
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError("Failed to load toys: " + errorMessage);
      if (errorMessage.includes("Authentication required")) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToy = async (): Promise<void> => {
    console.log("🎯 Add toy form data:", formData);

    // Client-side validation
    if (!formData.title?.trim()) {
      setError("Please fill in the title");
      return;
    }
    if (!formData.description?.trim()) {
      setError("Please fill in the description");
      return;
    }
    if (!formData.value || parseInt(formData.value) <= 0) {
      setError("Please enter a valid value");
      return;
    }
    if (!formData.manufacturer?.trim()) {
      setError("Please fill in the manufacturer");
      return;
    }
    if (!formData.recommendedAge?.trim()) {
      setError("Please fill in the recommended age");
      return;
    }
    if (formData.categories.length === 0) {
      setError("Please select at least one category");
      return;
    }
    if (formData.skills.length === 0) {
      setError("Please select at least one skill");
      return;
    }
    if (formData.images.length === 0) {
      setError("Please add at least one image");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await toyAPI.createToy(formData);
      setSuccess("Toy added successfully!");
      resetForm();
      loadToys();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      if (errorMessage.includes("Authentication required")) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditToy = async (toy: Toy): Promise<void> => {
    console.log("✏️ Editing toy:", toy);

    // FIXED: Properly load toy data for editing
    try {
      const toyResponse = await toyAPI.getToy(toy.id);
      const toyData = toyResponse.toy || toy;

      setEditingToy(toy.id);
      setFormData({
        title: toyData.title || "",
        description: toyData.desc || "",
        value: toyData.value ? toyData.value.toString() : "",
        images: toyData.images || [],
        skills: toyData.skills || [],
        categories: toyData.categories || [],
        recommendedAge: toyData.recommendedAge || "",
        manufacturer: toyData.manufacturer || "",
        isAvailable:
          toyData.isAvailable !== undefined ? toyData.isAvailable : true,
      });
      setShowAddForm(true);
    } catch (err) {
      console.error("Error loading toy for edit:", err);
      setError("Failed to load toy data for editing");
    }
  };

  const handleUpdateToy = async (): Promise<void> => {
    if (!editingToy) {
      setError("No toy selected for editing");
      return;
    }

    console.log("🔄 Updating toy with data:", formData);

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await toyAPI.updateToy(editingToy, formData);
      setSuccess("Toy updated successfully!");
      resetForm();
      loadToys();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      if (errorMessage.includes("Authentication required")) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteToy = async (id: number): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this toy?")) return;

    setLoading(true);
    setError("");

    try {
      await toyAPI.deleteToy(id);
      setSuccess("Toy deleted successfully!");
      loadToys();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError("Failed to delete toy: " + errorMessage);
      if (errorMessage.includes("Authentication required")) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // FIXED: Reset form with default available status
  const resetForm = (): void => {
    setFormData({
      title: "",
      description: "",
      value: "",
      images: [],
      skills: [],
      categories: [],
      recommendedAge: "",
      manufacturer: "",
      isAvailable: true, // FIXED: Default to available
    });
    setShowAddForm(false);
    setEditingToy(null);
    setError("");
    setSuccess("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    // In production, upload to your image service and get URLs
    const imageUrls = files.map((file: File) => URL.createObjectURL(file));
    setFormData({ ...formData, images: [...formData.images, ...imageUrls] });
  };

  const removeImage = (index: number): void => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const toggleSkill = (skill: string): void => {
    const newSkills = formData.skills.includes(skill)
      ? formData.skills.filter((s: string) => s !== skill)
      : [...formData.skills, skill];
    setFormData({ ...formData, skills: newSkills });
  };

  const toggleCategory = (category: string): void => {
    const newCategories = formData.categories.includes(category)
      ? formData.categories.filter((c: string) => c !== category)
      : [...formData.categories, category];
    setFormData({ ...formData, categories: newCategories });
  };

  // Notification component
  const Notification: React.FC<NotificationProps> = ({
    type,
    message,
    onClose,
  }) => (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === "error"
          ? "bg-red-50 text-red-800 border border-red-200"
          : "bg-green-50 text-green-800 border border-green-200"
      }`}
    >
      <div className="flex items-center">
        {type === "error" ? (
          <AlertCircle className="w-5 h-5 mr-2" />
        ) : (
          <CheckCircle className="w-5 h-5 mr-2" />
        )}
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Toy Form Modal - FIXED: Better validation and default values
  const ToyForm: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">
              {editingToy ? "Edit Toy" : "Add New Toy"}
            </h3>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Basic Information</h4>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter toy title"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Enter toy description"
                  maxLength={5000}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Value (KZT) *
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="2000"
                    min="2000"
                    max="150000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Recommended Age *
                  </label>
                  <input
                    type="text"
                    value={formData.recommendedAge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recommendedAge: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="3-8 years"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Manufacturer *
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) =>
                    setFormData({ ...formData, manufacturer: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter manufacturer name"
                />
              </div>

              {/* FIXED: Better availability toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isAvailable" className="text-sm">
                  Available for rent
                </label>
              </div>
            </div>

            {/* Categories, Skills, and Images */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Categories & Skills</h4>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Categories (1-7 required) *
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                  {categories.map((category: string) => (
                    <label
                      key={category}
                      className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">{category}</span>
                    </label>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Selected: {formData.categories.length}/7
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Skills (1-7 required) *
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                  {skillOptions.map((skill: string) => (
                    <label
                      key={skill}
                      className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">{skill}</span>
                    </label>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Selected: {formData.skills.length}/7
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Images (1-5 required) *
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {formData.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {formData.images.map((img: string, index: number) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt=""
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Images: {formData.images.length}/5
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={resetForm}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={editingToy ? handleUpdateToy : handleAddToy}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {editingToy ? "Update Toy" : "Add Toy"}
          </button>
        </div>
      </div>
    </div>
  );

  // Admin Panel View
  const AdminPanel: React.FC = () => (
    <div className="space-y-6">
      {/* Fixed Header with Add Button */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Toys Management
            </h2>
            <p className="text-gray-600 mt-1">Manage your toy inventory</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={loadToys}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-700"
              title="Refresh toys list"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <button
              onClick={() => {
                console.log("Add New Toy button clicked!");
                resetForm(); // FIXED: Reset form first to ensure clean state
                setShowAddForm(true);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium shadow-sm min-w-[140px]"
            >
              <Plus className="w-5 h-5" />
              Add New Toy
            </button>
          </div>
        </div>

        {/* Debug Info */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <strong>Debug:</strong> Form visible: {showAddForm ? "Yes" : "No"} |
          Authenticated: {isAuthenticated ? "Yes" : "No"} | Loading:{" "}
          {loading ? "Yes" : "No"} | Toys count: {toys.length} | Available toys:{" "}
          {toys.filter((t) => t.isAvailable).length}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search toys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat: string) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Price Range: {priceRange[0]} - {priceRange[1]} KZT
            </label>
            <input
              type="range"
              min="0"
              max="150000"
              step="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Toys</p>
              <p className="text-2xl font-bold">
                {metadata.totalRecords || toys.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold">
                {toys.filter((t: Toy) => t.isAvailable).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rented</p>
              <p className="text-2xl font-bold">
                {toys.filter((t: Toy) => !t.isAvailable).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toys Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Loading toys...
          </div>
        )}

        {!loading && toys.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No toys found</p>
            <p className="text-gray-400">
              Try adjusting your filters or add some toys
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Your First Toy
            </button>
          </div>
        )}

        {!loading && toys.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Toy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categories
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {toys.map((toy: Toy) => (
                  <tr key={toy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          {toy.images && toy.images[0] ? (
                            <img
                              src={toy.images[0]}
                              alt={toy.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <Camera className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {toy.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {toy.manufacturer}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(toy.categories || [])
                          .slice(0, 2)
                          .map((cat: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                              {cat}
                            </span>
                          ))}
                        {toy.categories && toy.categories.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{toy.categories.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {toy.value?.toLocaleString()} KZT
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {toy.recommendedAge}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          toy.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {toy.isAvailable ? "Available" : "Rented"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditToy(toy)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteToy(toy.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {metadata.totalRecords > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * 20 + 1} to{" "}
              {Math.min(currentPage * 20, metadata.totalRecords)} of{" "}
              {metadata.totalRecords} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {currentPage} of {metadata.lastPage || 1}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(metadata.lastPage || 1, currentPage + 1)
                  )
                }
                disabled={currentPage >= (metadata.lastPage || 1)}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  ToyRental KZ - Admin
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{user?.email || "Admin"}</span>
                  </div>

                  <button
                    onClick={() => setActiveTab("admin")}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Package className="w-4 h-4 inline mr-2" />
                    Admin Panel
                  </button>

                  <button
                    onClick={loadToys}
                    disabled={loading}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    title="Refresh"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                    />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md text-sm"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <AdminPanel />
          </div>
        </main>

        {/* Add/Edit Form Modal */}
        {showAddForm && <ToyForm />}

        {/* Notifications */}
        {error && (
          <Notification
            type="error"
            message={error}
            onClose={() => setError("")}
          />
        )}
        {success && (
          <Notification
            type="success"
            message={success}
            onClose={() => setSuccess("")}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ToysAdminPanel;
