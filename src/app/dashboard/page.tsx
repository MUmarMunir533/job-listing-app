"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaTrash } from "react-icons/fa";
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

  // State for delete confirmation modal
  const [jobToDelete, setJobToDelete] = React.useState<Job | null>(null);

  // Mutation for deleting a job using axios
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-white">Admin Dashboard</h1>
      </header>

      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddJob}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-5 py-3 rounded-md shadow hover:shadow-lg transition-all"
        >
          Add New Job
        </button>
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {job.title}
                </h2>
                <p className="text-gray-600 mb-1">
                  <strong>Category:</strong> {job.category}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Location:</strong> {job.location}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Salary:</strong> ${job.salary.toLocaleString()}
                </p>
                <div className="flex justify-end space-x-4">
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

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <p className="mb-6 text-center text-gray-800">
              Are you sure you want to delete the job{" "}
              <strong>{jobToDelete.title}</strong>?
            </p>
            <div className="flex justify-around">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition-all"
              >
                Yes
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-5 py-2 rounded-md transition-all"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
