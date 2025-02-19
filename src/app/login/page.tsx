"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSignInAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

const loginUser = async (data: LoginFormInputs): Promise<LoginResponse> => {
  const response = await axios.post("/api/auth/login", data);
  return response.data;
};

const LoginForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation<LoginResponse, unknown, LoginFormInputs>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success("Logged in successfully!");
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      reset();
      if (data.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/user-dashboard");
      }
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMsg);
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-filter backdrop-blur-md shadow-xl rounded-2xl p-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="********"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
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
            className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-blue-600 transition-colors"
          >
            <FaSignInAlt className="mr-2" />
            {mutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-500 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default LoginForm;
