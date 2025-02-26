"use client";

import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEye, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
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
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<Application[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await axios.get("/api/auth/application");
      let data: Application[] = response.data;

      data.sort((a, b) => b.id - a.id);
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: number; newStatus: "accepted" | "rejected"; }) => {
      const response = await axios.patch(`/api/auth/application?id=${id}`, {
        status: newStatus,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`/api/auth/application?id=${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  const updateStatus = (id: number, newStatus: "accepted" | "rejected") => {
    updateStatusMutation.mutate({ id, newStatus });
  };

  const deleteApplication = (id: number) => {
    deleteApplicationMutation.mutate(id);
  };

  const openDeleteModal = (id: number) => {
    setSelectedDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedDeleteId !== null) {
      deleteApplication(selectedDeleteId);
    }
    setShowDeleteModal(false);
    setSelectedDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedDeleteId(null);
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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Job Applications
        </h1>
        <Link href="/dashboard">
          <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-2 sm:mt-2 md:px-5 md:py-3 rounded-md shadow hover:shadow-lg transition-all">
            Back to Dashboard
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((app) => (
          <div
            key={app.id}
            className={`bg-white rounded-lg shadow-xl p-4 flex flex-col justify-between transform transition duration-300 hover:scale-105 hover:shadow-2xl border-l-4 ${
              app.status === "pending"
                ? "border-yellow-500"
                : app.status === "accepted"
                ? "border-green-500"
                : "border-red-500"
            }`}
          >
            <div className="mb-3">
              <h2 className="text-xl font-bold text-gray-900">
                {app.userName}
              </h2>
              <p className="text-gray-700 text-sm">{app.email}</p>
              <div className="mt-2">
                <Link
                  href={app.resume}
                  target="_blank"
                  className="inline-flex items-center space-x-1 text-blue-500 hover:text-blue-700 font-medium text-sm"
                  title="View Resume"
                >
                  <FaEye className="w-4 h-4" />
                  <span>View Resume</span>
                </Link>
              </div>
              <div className="mt-2">
                {app.status === "pending" && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                    Pending
                  </span>
                )}
                {app.status === "accepted" && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                    Accepted
                  </span>
                )}
                {app.status === "rejected" && (
                  <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                    Rejected
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                className="bg-red-700 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-800 transition-colors"
                onClick={() => openDeleteModal(app.id)}
                title="Delete Application"
              >
                <FaTrash className="w-4 h-4" />
              </button>
              {app.status === "pending" ? (
                <div className="flex items-center space-x-2">
                  <button
                    className="bg-green-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-600 transition-colors"
                    onClick={() => updateStatus(app.id, "accepted")}
                    title="Accept Application"
                  >
                    <FaCheck className="w-4 h-4" />
                  </button>
                  <button
                    className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-600 transition-colors"
                    onClick={() => updateStatus(app.id, "rejected")}
                    title="Reject Application"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              ) : app.status === "accepted" ? (
                <button
                  className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-600 transition-colors"
                  onClick={() => updateStatus(app.id, "rejected")}
                  title="Reject Application"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              ) : app.status === "rejected" ? (
                <button
                  className="bg-green-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-600 transition-colors"
                  onClick={() => updateStatus(app.id, "accepted")}
                  title="Accept Application"
                >
                  <FaCheck className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-gray-600 text-center">
              Are you sure you want to delete this application?
            </p>
            <div className="flex justify-around">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold mb-4 text-center">
              {selectedApplication.userName}'s Resume
            </h2>
            <p className="mb-4 text-gray-700 text-sm">
              {selectedApplication.resume}
            </p>
            <button
              className="bg-gray-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-600 transition-all mx-auto"
              onClick={() => setSelectedApplication(null)}
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
