"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import RingLoader from "react-spinners/RingLoader";
import axios from "axios";

export default function UserDashboard() {
  const router = useRouter();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
      }
      return null;
    },
  });

  const {
    data: applications,
    isLoading: isLoadingApplications,
    error: errorApplications,
  } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await axios.get("/api/auth/application/user", {
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!user,
  });

  if (isLoading || isLoadingApplications) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen">
        <RingLoader color="#ffffff" size={60} />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen">
        <div className="text-center text-red-500 text-lg">
          Error loading user data
        </div>
      </div>
    );
  }

  if (errorApplications) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen">
        <div className="text-center text-red-500 text-lg">
          Error loading applications
        </div>
      </div>
    );
  }

  const handleSeeJobs = () => {
    router.push("/alljobs");
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("user");
      router.push("/");
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "accept":
        return "bg-green-200 text-green-800";
      case "reject":
        return "bg-red-200 text-red-800";
      case "pending":
        return "bg-orange-200 text-orange-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 sm:p-6 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row items-center justify-between">
        <h1 className="text-4xl font-extrabold text-white text-center md:text-left">
          User Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="mt-4 md:mt-0 bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      </header>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">
          Welcome, {user.name}
        </h2>
        <p className="text-gray-600 mb-2">Email: {user.email}</p>
        <p className="text-gray-600">Role: {user.role}</p>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={handleSeeJobs}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-5 py-3 rounded-md shadow hover:shadow-lg transition-all w-full md:w-auto"
        >
          See Jobs
        </button>
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-4">
        Application Status
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {applications && applications.length > 0 ? (
          applications.map((app: any) => (
            <div key={app.id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold text-blue-800 mb-2">
                {app.job?.title || "No Job Title"}
              </h2>

              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClasses(
                  app.status
                )}`}
              >
                {app.status}
              </span>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">
            No applications found.
          </div>
        )}
      </div>
    </div>
  );
}
