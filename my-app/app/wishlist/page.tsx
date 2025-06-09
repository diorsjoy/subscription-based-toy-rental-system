// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Heart,
//   ShoppingCart,
//   Calendar,
//   Star,
//   Trash2,
//   Search,
//   Filter,
//   AlertCircle,
// } from "lucide-react";

// const WishlistPage = () => {
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterCategory, setFilterCategory] = useState("all");
//   const [sortBy, setSortBy] = useState("added");
//   const [user, setUser] = useState({ tokens: 150, name: "User" });
//   const [loading, setLoading] = useState(true);

//   // Mock wishlist data - in real app, this would come from API
//   const mockWishlistItems = [
//     {
//       id: 1,
//       name: "LEGO Creator Expert Modular Building",
//       category: "Building Sets",
//       price: 25,
//       rating: 4.8,
//       reviews: 156,
//       image: "/api/placeholder/300/200",
//       availability: "available",
//       ageRange: "12+",
//       addedDate: "2024-05-20",
//       description:
//         "Detailed modular building set with intricate details and advanced building techniques.",
//     },
//     {
//       id: 2,
//       name: "Remote Control Racing Drone",
//       category: "Electronics",
//       price: 35,
//       rating: 4.6,
//       reviews: 89,
//       image: "/api/placeholder/300/200",
//       availability: "rented",
//       ageRange: "14+",
//       addedDate: "2024-05-18",
//       description:
//         "High-speed racing drone with camera and advanced flight controls.",
//     },
//     {
//       id: 3,
//       name: "Educational Chemistry Set",
//       category: "Educational",
//       price: 20,
//       rating: 4.7,
//       reviews: 203,
//       image: "/api/placeholder/300/200",
//       availability: "available",
//       ageRange: "10+",
//       addedDate: "2024-05-15",
//       description:
//         "Safe chemistry experiments with guided instructions and safety equipment.",
//     },
//     {
//       id: 4,
//       name: "Wooden Puzzle Adventure Game",
//       category: "Puzzles",
//       price: 15,
//       rating: 4.5,
//       reviews: 78,
//       image: "/api/placeholder/300/200",
//       availability: "maintenance",
//       ageRange: "8+",
//       addedDate: "2024-05-10",
//       description:
//         "Handcrafted wooden puzzle with multiple difficulty levels and adventure theme.",
//     },
//   ];

//   useEffect(() => {
//     // Simulate loading
//     setTimeout(() => {
//       setWishlistItems(mockWishlistItems);
//       setFilteredItems(mockWishlistItems);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   useEffect(() => {
//     let filtered = wishlistItems.filter((item) => {
//       const matchesSearch =
//         item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.category.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesCategory =
//         filterCategory === "all" || item.category === filterCategory;
//       return matchesSearch && matchesCategory;
//     });

//     // Sort items
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "price-low":
//           return a.price - b.price;
//         case "price-high":
//           return b.price - a.price;
//         case "rating":
//           return b.rating - a.rating;
//         case "name":
//           return a.name.localeCompare(b.name);
//         case "added":
//         default:
//           return new Date(b.addedDate) - new Date(a.addedDate);
//       }
//     });

//     setFilteredItems(filtered);
//   }, [wishlistItems, searchTerm, filterCategory, sortBy]);

//   const removeFromWishlist = (itemId) => {
//     setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
//   };

//   const addToCart = (item) => {
//     if (user.tokens >= item.price) {
//       alert(
//         `${item.name} added to cart! You have ${
//           user.tokens - item.price
//         } tokens remaining.`
//       );
//     } else {
//       alert(
//         `Insufficient tokens! You need ${item.price - user.tokens} more tokens.`
//       );
//     }
//   };

//   const getAvailabilityStatus = (availability) => {
//     switch (availability) {
//       case "available":
//         return { color: "bg-green-100 text-green-800", text: "Available" };
//       case "rented":
//         return { color: "bg-red-100 text-red-800", text: "Currently Rented" };
//       case "maintenance":
//         return {
//           color: "bg-yellow-100 text-yellow-800",
//           text: "Under Maintenance",
//         };
//       default:
//         return { color: "bg-gray-100 text-gray-800", text: "Unknown" };
//     }
//   };

//   const categories = [
//     "all",
//     ...new Set(wishlistItems.map((item) => item.category)),
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading your wishlist...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
//                 <Heart className="h-8 w-8 text-red-500 fill-current" />
//                 My Wishlist
//               </h1>
//               <p className="text-gray-600 mt-1">
//                 {wishlistItems.length}{" "}
//                 {wishlistItems.length === 1 ? "item" : "items"} saved
//               </p>
//             </div>
//             <div className="bg-purple-100 px-4 py-2 rounded-lg">
//               <span className="text-purple-800 font-semibold">
//                 {user.tokens} Tokens Available
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Search and Filter Bar */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder="Search your wishlist..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//             </div>

//             {/* Category Filter */}
//             <div className="relative">
//               <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <select
//                 value={filterCategory}
//                 onChange={(e) => setFilterCategory(e.target.value)}
//                 className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
//               >
//                 {categories.map((category) => (
//                   <option key={category} value={category}>
//                     {category === "all" ? "All Categories" : category}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Sort */}
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             >
//               <option value="added">Recently Added</option>
//               <option value="price-low">Price: Low to High</option>
//               <option value="price-high">Price: High to Low</option>
//               <option value="rating">Highest Rated</option>
//               <option value="name">Name: A-Z</option>
//             </select>
//           </div>
//         </div>

//         {/* Wishlist Items */}
//         {filteredItems.length === 0 ? (
//           <div className="text-center py-16">
//             <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">
//               {searchTerm || filterCategory !== "all"
//                 ? "No items match your search"
//                 : "Your wishlist is empty"}
//             </h3>
//             <p className="text-gray-500">
//               {searchTerm || filterCategory !== "all"
//                 ? "Try adjusting your search or filters"
//                 : "Start browsing toys and add your favorites to your wishlist"}
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredItems.map((item) => {
//               const status = getAvailabilityStatus(item.availability);
//               const canAfford = user.tokens >= item.price;

//               return (
//                 <div
//                   key={item.id}
//                   className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
//                 >
//                   {/* Image */}
//                   <div className="relative">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-full h-48 object-cover rounded-t-lg"
//                     />
//                     <button
//                       onClick={() => removeFromWishlist(item.id)}
//                       className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
//                       title="Remove from wishlist"
//                     >
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </button>
//                     <div className="absolute top-3 left-3">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
//                       >
//                         {status.text}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Content */}
//                   <div className="p-6">
//                     <div className="flex items-start justify-between mb-2">
//                       <h3 className="font-semibold text-lg text-gray-900 leading-tight">
//                         {item.name}
//                       </h3>
//                     </div>

//                     <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                       {item.description}
//                     </p>

//                     <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
//                       <span className="bg-gray-100 px-2 py-1 rounded">
//                         {item.category}
//                       </span>
//                       <span className="bg-gray-100 px-2 py-1 rounded">
//                         Age {item.ageRange}
//                       </span>
//                     </div>

//                     <div className="flex items-center mb-4">
//                       <div className="flex items-center">
//                         <Star className="h-4 w-4 text-yellow-400 fill-current" />
//                         <span className="ml-1 text-sm font-medium text-gray-700">
//                           {item.rating}
//                         </span>
//                         <span className="ml-1 text-sm text-gray-500">
//                           ({item.reviews} reviews)
//                         </span>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div className="text-lg font-bold text-purple-600">
//                         {item.price} Tokens
//                       </div>

//                       <div className="flex gap-2">
//                         {item.availability === "available" ? (
//                           <button
//                             onClick={() => addToCart(item)}
//                             disabled={!canAfford}
//                             className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//                               canAfford
//                                 ? "bg-purple-600 text-white hover:bg-purple-700"
//                                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                             }`}
//                           >
//                             <ShoppingCart className="h-4 w-4" />
//                             Rent Now
//                           </button>
//                         ) : (
//                           <button
//                             disabled
//                             className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
//                           >
//                             <Calendar className="h-4 w-4" />
//                             Notify Me
//                           </button>
//                         )}
//                       </div>
//                     </div>

//                     {!canAfford && item.availability === "available" && (
//                       <div className="mt-3 flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
//                         <AlertCircle className="h-4 w-4" />
//                         Need {item.price - user.tokens} more tokens
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Quick Actions */}
//         {filteredItems.length > 0 && (
//           <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Quick Actions
//             </h3>
//             <div className="flex flex-wrap gap-3">
//               <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
//                 Share Wishlist
//               </button>
//               <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
//                 Add All Available to Cart
//               </button>
//               <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
//                 Get Notified When Available
//               </button>
//               <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
//                 Clear Wishlist
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WishlistPage;
