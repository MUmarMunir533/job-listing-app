"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserPlus } from "react-icons/fa";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const registerUser = async (data: RegisterFormInputs) => {
  const response = await axios.post("/api/auth/register", data);
  return response.data;
};

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("User registered successfully!");
      reset();
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.error ||
        "Registration failed. Please try again.";
      toast.error(errorMsg);
    },
  });

  const onSubmit = (data: RegisterFormInputs) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white bg-opacity-90 backdrop-filter backdrop-blur-md shadow-xl rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Create Account
        </h2>
        <div>
          <label
            htmlFor="name"
            className="block text-gray-700 font-semibold mb-2"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 font-semibold mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            placeholder="********"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-blue-600 transition duration-300"
        >
          <FaUserPlus className="mr-2" />
          {mutation.isPending ? "Registering..." : "Register"}
        </button>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-500 font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </form>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default RegisterForm;
