"use client";
import { useState } from "react";
import Link from "next/link";
import { HiOutlineMenu, HiX } from "react-icons/hi";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-transparent backdrop-blur-md p-4 md:p-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          Job Finder
        </h1>

        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiOutlineMenu />}
        </button>

        <nav
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-blue-600 md:bg-transparent md:flex items-center space-y-3 md:space-y-0 md:space-x-4 p-5 md:p-0 transition-all duration-300 ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <Link
            href="/login"
            className="block md:inline-block px-6 py-2 bg-white text-blue-500 font-semibold rounded-lg shadow hover:bg-gray-200 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="block md:inline-block px-6 py-2 border border-white font-semibold rounded-lg shadow hover:bg-white hover:text-blue-500 transition"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
