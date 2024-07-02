import React from "react";

export default function Navbar() {
  return (
    <nav className="">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-white text-2xl font-bold">Pomodoro</div>
          <div className="hidden md:flex space-x-4">
            <a href="#report" className="text-white hover:text-gray-300">
              Report
            </a>
            <a href="#settings" className="text-white hover:text-gray-300">
              Settings
            </a>
            <a href="#signin" className="text-white hover:text-gray-300">
              Signin
            </a>
          </div>
          <div className="md:hidden">
            <button className="text-white focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
