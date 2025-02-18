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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors w-full"
        >
          <FaSignInAlt className="mr-2" />
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link href="/signup" className="text-green-600 hover:underline">
          Sign up
        </Link>
      </p>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default LoginForm;
