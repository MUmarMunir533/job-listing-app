"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import RingLoader from "react-spinners/RingLoader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FaSearch,
  FaPaperPlane,
  FaMapMarkerAlt,
  FaDollarSign,
  FaBriefcase,
} from "react-icons/fa";

interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  salary: number;
}

const searchSchema = z.object({
  location: z.string().optional(),
  category: z.string().optional(),
  salary: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().optional()
  ),
});

type SearchFormData = z.infer<typeof searchSchema>;

export default function JobListingPage() {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      location: "",
      category: "",
      salary: undefined,
    },
  });

  const filters = watch();

  const {
    data: jobs,
    isLoading,
    isError,
  } = useQuery<Job[], Error>({
    queryKey: ["jobs", filters.location, filters.category, filters.salary],
    queryFn: async () => {
      const response = await axios.get("/api/auth/jobs");
      let data: Job[] = response.data;

      const loc = filters.location || "";
      const cat = filters.category || "";
      const sal = filters.salary;

      if (loc) {
        data = data.filter((job) =>
          job.location.toLowerCase().includes(loc.toLowerCase())
        );
      }
      if (cat) {
        data = data.filter((job) =>
          job.category.toLowerCase().includes(cat.toLowerCase())
        );
      }
      if (sal !== undefined) {
        data = data.filter((job) => job.salary >= sal);
      }
      data.sort((a, b) => b.id - a.id);

      return data;
    },
  });

  const onSubmit = (data: SearchFormData) => {
  };

  const handleApply = (id: number) => {
    router.push(`/alljobs/${id}`);
  };

  const handleBackToDashboard = () => {
    router.push("/user-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center sm:text-left mb-4 sm:mb-0">
            User Dashboard
          </h1>
          <button
            onClick={handleBackToDashboard}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:shadow-xl transition transform hover:scale-105"
          >
            Back To User Dashboard
          </button>
        </header>

        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg mb-8 max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Location"
                {...register("location")}
                className="p-3 pl-12 w-full border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
              />
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 text-xl hover:scale-110 transition-transform" />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Category"
                {...register("category")}
                className="p-3 pl-12 w-full border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
              />
              <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 text-xl hover:scale-110 transition-transform" />
            </div>

            <div className="relative">
              <input
                type="number"
                placeholder="Min Salary"
                {...register("salary")}
                className="p-3 pl-12 w-full border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
              />
              <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 text-xl hover:scale-110 transition-transform" />
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-3 rounded-md shadow-md hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaSearch className="text-xl hover:scale-110 transition-transform" />
              Search
            </button>
          </form>
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {jobs && jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="relative bg-white shadow-lg rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-300 transform hover:shadow-2xl hover:scale-105"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-green-500 to-blue-500"></div>
                  <div className="p-4 sm:p-6 pl-4 sm:pl-8 flex flex-col justify-between h-full">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-2">
                        {job.title}
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base mb-1 flex items-center gap-2">
                        <FaBriefcase className="text-indigo-500 text-base hover:scale-110 transition-transform" />
                        <span>
                          <strong>Category:</strong> {job.category}
                        </span>
                      </p>
                      <p className="text-gray-600 text-sm sm:text-base mb-1 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-purple-500 text-base hover:scale-110 transition-transform" />
                        <span>
                          <strong>Location:</strong> {job.location}
                        </span>
                      </p>
                      <p className="text-gray-600 text-sm sm:text-base mb-4 flex items-center gap-2">
                        <FaDollarSign className="text-green-500 text-base hover:scale-110 transition-transform" />
                        <span>
                          <strong>Salary:</strong> ${job.salary.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleApply(job.id)}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-md mt-4 flex items-center justify-center gap-2 hover:shadow-lg transition transform hover:scale-105"
                    >
                      <FaPaperPlane className="text-base hover:scale-110 transition-transform" />
                      Apply
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
      </div>
    </div>
  );
}
