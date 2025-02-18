"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  salary: string;
}

const fetchJobs = async (): Promise<Job[]> => {
  const response = await fetch("/api/jobs");
  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return response.json();
};

export default function AdminDashboard() {
  const router = useRouter();

  const dummyJobs: Job[] = [
    {
      id: 1,
      title: "Software Engineer",
      description: "Develop and maintain software solutions.",
      category: "IT",
      location: "Remote",
      salary: "$80k - $120k",
    },
    {
      id: 2,
      title: "Product Manager",
      description: "Oversee product development lifecycle.",
      category: "Management",
      location: "New York",
      salary: "$90k - $130k",
    },
  ];

  const jobs = dummyJobs;

  const handleAddJob = () => {
    router.push("/jobs");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </header>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddJob}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Job
        </button>
      </div>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Salary
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {job.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {job.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {job.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {job.salary}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex justify-center space-x-4">
                  <button
                    title="Edit"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    title="Delete"
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
