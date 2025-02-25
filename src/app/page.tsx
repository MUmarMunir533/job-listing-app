"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import {
  FaPaperPlane,
  FaMapMarkerAlt,
  FaBriefcase,
  FaDollarSign,
} from "react-icons/fa";

interface Job {
  id: number;
  title: string;
  category: string;
  location: string;
  salary: number;
}

const dummyJobs: Job[] = [
  {
    id: 1,
    title: "Software Engineer",
    category: "Engineering",
    location: "Remote",
    salary: 80000,
  },
  {
    id: 2,
    title: "Product Manager",
    category: "Management",
    location: "Lahore",
    salary: 90000,
  },
  {
    id: 3,
    title: "UI/UX Designer",
    category: "Design",
    location: "Karachi",
    salary: 70000,
  },
  {
    id: 4,
    title: "Data Analyst",
    category: "Analytics",
    location: "Islamabad",
    salary: 60000,
  },
  {
    id: 5,
    title: "DevOps Engineer",
    category: "Operations",
    location: "Faisalabad",
    salary: 85000,
  },
  {
    id: 6,
    title: "QA Tester",
    category: "Testing",
    location: "Lahore",
    salary: 55000,
  },
];

function CardGrid() {
  const router = useRouter();

  const handleApply = (job: Job) => {
    router.push("/login");
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <h3 className="text-2xl font-bold text-center mb-6 text-white">
        Featured Opportunities
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dummyJobs.map((job) => (
          <div
            key={job.id}
            className="relative bg-white shadow-lg rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-300 transform hover:shadow-2xl hover:scale-105"
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-green-500 to-blue-500"></div>
            <div className="p-6 pl-8 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-2">
                  {job.title}
                </h2>
                <p className="text-gray-600 flex items-center gap-2 mb-1">
                  <FaBriefcase className="text-green-500" />
                  <strong>Category:</strong> {job.category}
                </p>
                <p className="text-gray-600 flex items-center gap-2 mb-1">
                  <FaMapMarkerAlt className="text-red-500" />
                  <strong>Location:</strong> {job.location}
                </p>
                <p className="text-gray-600 flex items-center gap-2 mb-4">
                  <FaDollarSign className="text-yellow-500" />
                  <strong>Salary:</strong> ${job.salary.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleApply(job)}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-md mt-4 flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105 transition-all"
              >
                <FaPaperPlane className="animate-bounce" />
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white flex flex-col">
      <Header />

      <main className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-center flex-1 px-4 sm:px-4 lg:px-6 py-4">
        <div className="md:w-1/2 space-y-8 text-center md:text-left px-2 sm:px-6">
          <h2 className="text-3xl sm:text-4xl sm:pt-11 md:text-5xl font-bold leading-tight">
            Discover Your Next Career Move
          </h2>
          <p className="text-base sm:text-lg opacity-90">
            Browse thousands of job listings from top companies and take the
            next step in your career.
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="px-6 sm:px-8 py-3 bg-white text-blue-500 font-bold rounded-full shadow-lg hover:bg-gray-200 transition flex items-center gap-2 justify-center"
            >
              <FaPaperPlane />
              Explore Jobs
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center px-4">
          <Image
            src="/home.svg"
            alt="Job search illustration"
            width={500}
            height={500}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-lg"
          />
        </div>
      </main>

      <CardGrid />

      <Footer />
    </div>
  );
}
