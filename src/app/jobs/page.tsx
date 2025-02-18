"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

  const mutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const response = await axios.post("/api/auth/jobs", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  const onSubmit = (data: JobFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Job</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            {...register("title")}
            className="mt-1 block w-full border rounded-md p-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            {...register("description")}
            className="mt-1 block w-full border rounded-md p-2"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            {...register("category")}
            className="mt-1 block w-full border rounded-md p-2"
          />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            {...register("location")}
            className="mt-1 block w-full border rounded-md p-2"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Salary</label>
          <input
            type="number"
            step="0.01"
            {...register("salary", { valueAsNumber: true })}
            className="mt-1 block w-full border rounded-md p-2"
          />
          {errors.salary && (
            <p className="text-red-500 text-sm">{errors.salary.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create Job"}
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
  );
}
