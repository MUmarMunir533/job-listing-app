"use client";
import { FiUser, FiBriefcase, FiLogOut, FiSettings } from "react-icons/fi";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <FiLogOut className="text-red-600 cursor-pointer text-2xl" />
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mt-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-3xl">
            <FiUser />
          </div>
          <h3 className="text-2xl font-semibold mt-2">John Doe</h3>
          <p className="text-gray-500">johndoe@example.com</p>
        </div>

        {/* Menu Options */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 p-4 bg-purple-100 rounded-lg cursor-pointer hover:bg-purple-200">
            <FiBriefcase className="text-purple-600 text-2xl" />
            <span className="text-purple-600 font-medium text-lg">My Jobs</span>
          </div>

          <div className="flex items-center gap-3 p-4 bg-yellow-100 rounded-lg cursor-pointer hover:bg-yellow-200">
            <FiSettings className="text-yellow-600 text-2xl" />
            <span className="text-yellow-600 font-medium text-lg">
              Settings
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
