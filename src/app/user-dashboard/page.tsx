"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import RingLoader from "react-spinners/RingLoader";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaUserShield,
  FaBriefcase,
  FaSignOutAlt,
} from "react-icons/fa";

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
      case "accepted":
        return "bg-green-200 text-green-800";
      case "rejected":
        return "bg-red-200 text-red-800";
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getCardBorderClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "border-green-500";
      case "rejected":
        return "border-red-500";
      case "pending":
        return "border-yellow-500";
      default:
        return "border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center md:text-left flex items-center gap-2">
            <FaUser className="text-blue-500 text-xl sm:text-2xl" /> User Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition-all flex items-center gap-2"
          >
            <FaSignOutAlt className="text-xl sm:text-2xl" />
            Logout
          </button>
        </header>

        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">
            <FaUser className="text-blue-500 text-xl sm:text-2xl" />
            Welcome, {user.name}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-2 flex items-center gap-2">
            <FaEnvelope className="text-blue-500 text-lg sm:text-xl" />
            Email: {user.email}
          </p>
          <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
            <FaUserShield className="text-blue-500 text-lg sm:text-xl" />
            Role: {user.role}
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={handleSeeJobs}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-md shadow hover:shadow-lg transition-all w-full md:w-auto flex items-center gap-2"
          >
            <FaBriefcase className="text-lg sm:text-xl" />
            See Jobs
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-4">
          Application Status
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {applications && applications.length > 0 ? (
            applications.map((app: any) => (
              <div
                key={app.id}
                className={`bg-white shadow-lg rounded-lg p-4 sm:p-6 border-l-4 ${getCardBorderClass(
                  app.status
                )} transition-all duration-300 transform hover:shadow-2xl hover:scale-105`}
              >
                <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <FaBriefcase className="text-lg sm:text-xl" />
                  {app.job?.title || "No Job Title"}
                </h2>
                <span
                  className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusBadgeClasses(
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
    </div>
  );
}
