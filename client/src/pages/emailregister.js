"use client";
import { useEffect, useState } from "react";

export default function EmailRegister() {
  const [edittingUsername, setEdittingUsername] = useState(false);
  const [username, setUsername] = useState("");

  const [edittingEmail, setEdittingEmail] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <main data-theme="light">
      <div className="flex w-full min-h-screen items-center justify-center bg-gradient-to-br from-primary to-secondary/30">
        <div className="my-12 mx-6 w-full flex flex-col px-8 py-12 rounded-2xl shadow-xl bg-base-200 max-w-[800px]">
          <div className="py-4 border-b-[1px] border-primary/20 w-full text-left">
            <h2 className="text-4xl font-semibold text-base-content mb-2">
              Welcome!
            </h2>
            <p className="text-md text-base-content/80">
              Create an account
            </p>
          </div>
          <div className="grid gap-8 py-8 max-w-[500px] w-full">
            <div className="w-full max-w-[500px] relative duration-200 transition-all">
              <input
                className={`w-full p-3 text-sm bg-none bg-transparent border-[2px] border-base-300 rounded-md focus:outline-none outline-none focus:border-primary ${
                  username.length > 0 && "border-primary"
                }`}
                type="text"
                placeholder="Enter username"
                onFocus={() => setEdittingUsername(true)}
                onBlur={() => setEdittingUsername(false)}
                onChange={(e) => setUsername(e.target.value)}
              />
              <span
                className={`text-xs text-base-content/50 px-2 absolute bg-base-200 left-6 top-[-8px] ${
                  edittingUsername ? "text-primary" : "text-base-content"
                }`}
              >
                Username
              </span>
            </div>
            <div className="w-full max-w-[500px] relative">
              <input
                className={`w-full p-3 text-sm bg-none bg-transparent border-[2px] border-base-300 rounded-md focus:outline-none outline-none focus:border-primary ${
                  email.length > 0 && "border-primary"
                }`}
                type="email"
                placeholder="Enter email"
                onFocus={() => setEdittingEmail(true)}
                onBlur={() => setEdittingEmail(false)}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span
                className={`text-xs text-base-content/50 px-2 absolute bg-base-200 left-6 top-[-8px] ${
                  edittingEmail ? "text-primary" : "text-base-content"
                }`}
              >
                Email
              </span>
            </div>

            <button
              className={`transition-all duration-200 ${
                username.length > 0 && email.length > 0
                  ? "bg-primary text-base-100 cursor-pointer"
                  : "bg-primary/20 text-base-content cursor-not-allowed"
              } p-3 max-w-24 text-sm font-semibold rounded-md shadow-sm`}
            >
              Sign Up
            </button>
          </div>
          <div className="w-full border-b-[1px] border-primary/20"></div>
          <div className="py-8 w-full flex flex-col border-b-[1px] border-primary/20">
            <p className="text-sm text-base-content/60 mb-2 mr-8">
              Prefer other sign-in methods?
            </p>
            <div>
              <a
                href="/register"
                className="text-sm text-primary/50 hover:text-primary/80 mr-4"
              >
                Register with Username, Password
              </a>
              <a
                href="#"
                className="text-sm text-primary/50 hover:text-primary/80"
              >
                Register with Google
              </a>
            </div>
          </div>
          <div className="w-full mt-8 flex items-center">
            <p className="text-sm text-base-content/80 mr-4">
              Already have an account?
            </p>
            <a href="/login" className="text-sm text-primary/90 hover:text-primary">
              Login
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}