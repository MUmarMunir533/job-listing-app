"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { FaPaperPlane } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const applicationSchema = z.object({
  fullName: z.string().nonempty("Full name is required"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  coverLetter: z.string().nonempty("Cover letter is required"),
  resume: z
    .any()
    .refine((files) => files && files.length > 0, "Resume is required"),
});

type ApplicationFormInputs = z.infer<typeof applicationSchema>;

const ApplicationForm = () => {
  const { id } = useParams();
  const router = useRouter();
  const jobId = id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormInputs>({
    resolver: zodResolver(applicationSchema),
  });

  const mutation = useMutation<any, Error, ApplicationFormInputs>({
    mutationFn: async (data: ApplicationFormInputs) => {
      const formData = new FormData();
      formData.append("jobId", jobId as string);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("coverLetter", data.coverLetter);

      if (data.resume && data.resume[0]) {
        formData.append("resume", data.resume[0]);
      }

      const response = await axios.post(
        `/api/auth/application/${jobId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Application submitted successfully!", {
          position: "top-right",
        });
        setTimeout(() => {
          router.push("/alljobs");
        }, 2000);
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Failed to submit application.",
        { position: "top-right" }
      );
      console.error(
        error.response?.data?.error || "Failed to submit application."
      );
    },
  });

  const onSubmit = (data: ApplicationFormInputs) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-3xl p-8 space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-blue-700">
          Apply for Job
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              {...register("fullName")}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Example@gmail.com"
              {...register("email")}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cover Letter
            </label>
            <textarea
              placeholder="Your cover letter..."
              rows={4}
              {...register("coverLetter")}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300"
            />
            {errors.coverLetter && (
              <p className="text-red-500 text-sm mt-1">
                {errors.coverLetter.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Resume Upload (PDF, DOC)
            </label>
            <input
              type="file"
              {...register("resume")}
              accept=".pdf, .doc, .docx"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300 cursor-pointer"
            />
            {errors.resume && (
              <p className="text-red-500 text-sm mt-1">
                {errors.resume.message as string}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Submitting..." : "Submit Application"}
            {!mutation.isPending && <FaPaperPlane className="ml-2" />}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default ApplicationForm;
