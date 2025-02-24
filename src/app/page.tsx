import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
              className="px-6 sm:px-8 py-3 bg-white text-blue-500 font-bold rounded-full shadow-lg hover:bg-gray-200 transition"
            >
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

      <Footer />
    </div>
  );
}
