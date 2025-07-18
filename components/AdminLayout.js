import React from "react";
import { useRouter } from "next/router";

const AdminLayout = ({ children, activeTab }) => {
  const router = useRouter();

  const handleTabChange = (tab) => {
    if (tab === "statistics") {
      router.push("/admin");
    } else if (tab === "restaurants") {
      router.push("/admin/restaurants");
    } else if (tab === "users") {
      router.push("/admin/users");
    }
  };

  return (
    <div className="p-6">
      <div className="text-2xl font-bold mb-6">Admin Panel</div>

      <div className="flex flex-wrap border-b border-gray-200 mb-6">
        <button
          onClick={() => handleTabChange("statistics")}
          className={`px-4 py-2 mr-2 font-medium text-sm border-b-2 ${
            activeTab === "statistics"
              ? "border-teal-500 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Statistics
        </button>
        <button
          onClick={() => handleTabChange("restaurants")}
          className={`px-4 py-2 mr-2 font-medium text-sm border-b-2 ${
            activeTab === "restaurants"
              ? "border-teal-500 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Restaurants
        </button>
        <button
          onClick={() => handleTabChange("users")}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeTab === "users"
              ? "border-teal-500 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Users
        </button>
      </div>

      {children}
    </div>
  );
};

export default AdminLayout;
