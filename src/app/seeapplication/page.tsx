"use client";

import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEye } from "react-icons/fa";
import Link from "next/link";
import RingLoader from "react-spinners/RingLoader";

interface Application {
  id: number;
  userName: string;
  email: string;
  status: "pending" | "accepted" | "rejected";
  resume: string;
}

export default function ApplicationsPage() {
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<Application[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await axios.get("/api/auth/application");
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      newStatus,
    }: {
      id: number;
      newStatus: "accepted" | "rejected";
    }) => {
      const response = await axios.patch(`/api/auth/application?id=${id}`, {
        status: newStatus,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  const updateStatus = (id: number, newStatus: "accepted" | "rejected") => {
    updateStatusMutation.mutate({ id, newStatus });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <RingLoader color="#ffffff" size={60} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-center text-red-500 text-lg">
          Error loading applications
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">
        Job Applications
      </h1>
      <div className="bg-white bg-opacity-90 rounded shadow-lg p-4 md:p-6 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Resume</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((app) => (
              <tr key={app.id} className="border-b">
                <td className="py-2 px-4">{app.userName}</td>
                <td className="py-2 px-4">{app.email}</td>
                <td className="py-2 px-4">
                  <Link
                    href={app.resume}
                    className="flex items-center space-x-1 text-blue-500 hover:text-blue-700"
                    title="View Resume"
                  >
                    <FaEye />
                    <span>View</span>
                  </Link>
                </td>
                <td className="py-2 px-4 capitalize">{app.status}</td>
                <td className="py-2 px-4 text-center">
                  {app.status === "pending" ? (
                    <div className="flex justify-center space-x-2">
                      <button
                        className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition-colors"
                        onClick={() => updateStatus(app.id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
                        onClick={() => updateStatus(app.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  ) : app.status === "accepted" ? (
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
                      onClick={() => updateStatus(app.id, "rejected")}
                    >
                      Reject
                    </button>
                  ) : app.status === "rejected" ? (
                    <button
                      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition-colors"
                      onClick={() => updateStatus(app.id, "accepted")}
                    >
                      Accept
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-center">
              {selectedApplication.userName}'s Resume
            </h2>
            <p className="mb-4">{selectedApplication.resume}</p>
            <button
              className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 transition-all"
              onClick={() => setSelectedApplication(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
