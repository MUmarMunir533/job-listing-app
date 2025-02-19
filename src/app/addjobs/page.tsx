"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  salary: z
    .number({
      invalid_type_error: "Salary must be a number",
    })
    .positive("Salary must be positive"),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function CreateJobPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const response = await axios.post("/api/auth/addjob", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      router.push("/dashboard");
    },
  });

  const onSubmit = (data: JobFormData) => {
    mutation.mutate(data);
  };

  // Updated common input styling classes
  const inputClasses =
    "mt-1 block w-full bg-gray-50 border border-gray-300 rounded-lg p-3 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Create New Job
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              {...register("title")}
              placeholder="Job title"
              className={inputClasses}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              placeholder="Job description"
              rows={3}
              className={inputClasses}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              {...register("category")}
              placeholder="Job category"
              className={inputClasses}
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              {...register("location")}
              placeholder="Job location"
              className={inputClasses}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Salary
            </label>
            <input
              type="number"
              step="0.01"
              {...register("salary", { valueAsNumber: true })}
              placeholder="Job salary"
              className={inputClasses}
            />
            {errors.salary && (
              <p className="text-red-500 text-sm mt-1">
                {errors.salary.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-md transition-colors"
          >
            {mutation.isPending ? "Creating..." : "Create Job"}
          </button>

          {/* Button to navigate back to the dashboard */}
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full bg-gradient-to-br from-blue-500 to-purple-600 text-white py-2 rounded-md transition-colors mt-2"
          >
            Back to Dashboard
          </button>

          {mutation.isError && (
            <p className="text-red-500 text-sm mt-2">
              Error creating job. Please try again.
            </p>
          )}
          {mutation.isSuccess && (
            <p className="text-green-500 text-sm mt-2">
              Job created successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
