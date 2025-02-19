"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import RingLoader from "react-spinners/RingLoader";

interface DummyData {
  id: number;
  title: string;
  description: string;
}

const dummyData: DummyData[] = [
  {
    id: 1,
    title: "Dummy Card Title",
    description: "This is a dummy description for demonstration purposes.",
  },
  {
    id: 2,
    title: "Dummy Card Title",
    description: "This is a dummy description for demonstration purposes.",
  },
  {
    id: 3,
    title: "Dummy Card Title",
    description: "This is a dummy description for demonstration purposes.",
  },
  {
    id: 4,
    title: "Dummy Card Title",
    description: "This is a dummy description for demonstration purposes.",
  },
];

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

  if (isLoading) {
    return (
      <div className="flex items-center bg-gradient-to-br from-blue-500 to-purple-600 justify-center min-h-screen">
        <RingLoader color="#ffffff" size={60} />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center text-red-500 text-lg">
        Error loading user data
      </div>
    );
  }

  const handleSeeJobs = () => {
    router.push("/alljobs");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-white">User Dashboard</h1>
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
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-5 py-3 rounded-md shadow hover:shadow-lg transition-all"
        >
          See Jobs
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dummyData.map((item) => (
          <div key={item.id} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              {item.title}
            </h2>
            <p className="text-gray-600 mb-4">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
