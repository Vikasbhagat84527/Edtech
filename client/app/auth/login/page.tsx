"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/src/utils/axiosInstance";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to dashboard if the user is already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status]);

  // Handle form submission for both login and signup
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      try {
        const response = await axiosInstance.post(
          "http://localhost:5000/auth/login",
          {
            email,
            password,
          }
        );

        const { accessToken, refreshToken } = response.data;

        // Store tokens in localStorage (or use cookies for better security)
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Redirect to the dashboard
        const verifyResponse = await axiosInstance.get(
          "http://localhost:5000/api/dashboard/user",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (verifyResponse.status === 200) {
          router.push("/dashboard");
        }
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.error || "Login failed. Please try again."
        );
      }
    } else {
      try {
        const response = await axiosInstance.post(
          "http://localhost:5000/auth/signup",
          {
            email,
            password,
          }
        );

        // Handle successful signup
        if (response.status === 200 || response.status === 201) {
          alert("Signup successful! You can now log in.");
          setIsLogin(true); // Switch to Login tab
        }
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.error || "Signup failed. Please try again."
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to MyApp</h1>
        <p className="text-gray-600">Login or Signup to continue</p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-8 rounded shadow-md w-96">
        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 ${
              isLogin ? "font-bold border-b-2 border-blue-500" : ""
            }`}
            onClick={() => {
              setErrorMessage(""); // Clear errors when switching tabs
              setIsLogin(true);
            }}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 ${
              !isLogin ? "font-bold border-b-2 border-blue-500" : ""
            }`}
            onClick={() => {
              setErrorMessage(""); // Clear errors when switching tabs
              setIsLogin(false);
            }}
          >
            Signup
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {/* Error Message */}
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

        {/* Social Login */}
        <div className="text-center mt-4">
          <p className="text-gray-600 mb-2">or</p>
          <button
            onClick={() => {
              // Use next-auth for Google login
              signIn("google");
            }}
            className="bg-green-500 w-full text-white py-2 px-4 rounded hover:bg-green-800"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
