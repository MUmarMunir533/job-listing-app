"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSignOutAlt,
  FaClipboardList,
  FaTag,
  FaMapMarkerAlt,
  FaDollarSign,
} from "react-icons/fa";
import RingLoader from "react-spinners/RingLoader";
import axios from "axios";

interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  salary: number;
}

const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response = await axios.get("/api/auth/jobs", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch jobs");
  }
};

export default function AdminDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: jobs,
    isLoading,
    isError,
  } = useQuery<Job[], Error>({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });

  const sortedJobs = jobs ? [...jobs].sort((a, b) => b.id - a.id) : [];

  const [jobToDelete, setJobToDelete] = React.useState<Job | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (jobId: number) => {
      try {
        const response = await axios.delete(`/api/auth/editjob?id=${jobId}`, {
          withCredentials: true,
        });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.error || "Failed to delete job");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  const handleAddJob = () => {
    router.push("/addjobs");
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

  const handleEditJob = (id: number) => {
    router.push(`/editjobs/${id}`);
  };

  const handleDeleteClick = (job: Job) => {
    setJobToDelete(job);
  };

  const handleConfirmDelete = async () => {
    if (jobToDelete) {
      await deleteMutation.mutateAsync(jobToDelete.id);
      setJobToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setJobToDelete(null);
  };

  const handleSeeApplication = () => {
    router.push("/seeapplication");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-8">
          <div className="flex items-center justify-start">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSeeApplication}
              className="flex items-center text-white underline text-lg md:text-xl hover:text-gray-200 transition-colors"
            >
              <FaClipboardList className="mr-2" />
              See Application
            </button>
          </div>
          <div className="flex justify-end space-x-2 md:space-x-4">
            <button
              onClick={handleAddJob}
              className="flex items-center bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-2 md:px-5 md:py-3 rounded-md shadow hover:shadow-lg transition-all"
            >
              <FaPlus className="mr-2" />
              Add New Job
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-500 text-white px-3 py-2 md:px-5 md:py-3 rounded-md shadow hover:shadow-lg transition-all"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </header>

        <div className="mb-4">
          <h2 className="text-3xl sm:text-4xl text-center font-bold text-white">
            All Jobs
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <RingLoader color="#ffffff" size={60} />
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 text-lg">
            Error loading jobs
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedJobs && sortedJobs.length > 0 ? (
              sortedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white shadow-md hover:shadow-xl rounded-lg p-4 border-l-4 border-blue-500 transition-all duration-300 transform hover:scale-105"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-2">
                    {job.title}
                  </h2>
                  <p className="text-gray-600 mb-1 flex items-center">
                    <FaTag className="text-purple-500 mr-2" size={16} />
                    <span>
                      <span className="font-semibold text-blue-600">
                        Category:
                      </span>{" "}
                      {job.category}
                    </span>
                  </p>
                  <p className="text-gray-600 mb-1 flex items-center">
                    <FaMapMarkerAlt className="text-red-500 mr-2" size={16} />
                    <span>
                      <span className="font-semibold text-blue-600">
                        Location:
                      </span>{" "}
                      {job.location}
                    </span>
                  </p>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <FaDollarSign className="text-green-500 mr-2" size={16} />
                    <span>
                      <span className="font-semibold text-blue-600">
                        Salary:
                      </span>{" "}
                      ${job.salary.toLocaleString()}
                    </span>
                  </p>
                  <div className="flex justify-end space-x-2 md:space-x-4">
                    <button
                      title="Edit"
                      onClick={() => handleEditJob(job.id)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDeleteClick(job)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-6 text-center text-gray-600">
                No jobs found
              </div>
            )}
          </div>
        )}

        {jobToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
              <p className="mb-4 text-center text-gray-800">
                Are you sure you want to delete the job{" "}
                <strong>{jobToDelete.title}</strong>?
              </p>
              <div className="flex justify-around">
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 text-white px-3 py-2 md:px-5 md:py-2 rounded-md hover:bg-red-600 transition-all"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-2 md:px-5 md:py-2 rounded-md transition-all"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
