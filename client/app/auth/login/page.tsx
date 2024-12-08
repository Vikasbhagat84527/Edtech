"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/src/utils/axiosInstance";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (status === "authenticated" && accessToken) {
      router.push("https://edtech-2-7uho.onrender.com/dashboard");
    } else if (status === "unauthenticated") {
      router.push("https://edtech-2-7uho.onrender.com/auth/login");
    }
  }, [status]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      try {
        const response = await axiosInstance.post(
          "https://edtech-2-7uho.onrender.com/auth/login",
          {
            email,
            password,
          }
        );

        const { accessToken, refreshToken, name, profilePicture } =
          response.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userProfilePicture", profilePicture);
        const signInResponse = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        if (signInResponse?.error) {
          setErrorMessage("Failed to synchronize session. Please try again.");
        } else {
          router.push("https://edtech-2-7uho.onrender.com/dashboard");
        }
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.error || "Login failed. Please try again."
        );
      }
    } else {
      try {
        const response = await axiosInstance.post(
          "https://edtech-2-7uho.onrender.com/auth/signup",
          {
            email,
            password,
          }
        );

        if (response.status === 201) {
          alert("Signup successful! You can now log in.");
          setIsLogin(true);
        }
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.error || "Signup failed. Please try again."
        );
      }
    }
  };

  const handleFacebookLogin = () => {
    signIn("facebook", {
      callbackUrl: "https://edtech-2-7uho.onrender.com/dashboard",
      auth_type: "reauthenticate",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to MyApp</h1>
        <p className="text-gray-600">Login or Signup to continue</p>
      </div>
      <div className="bg-white p-8 rounded shadow-md w-96">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 ${
              isLogin ? "font-bold border-b-2 border-blue-500" : ""
            }`}
            onClick={() => {
              setErrorMessage("");
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
              setErrorMessage("");
              setIsLogin(false);
            }}
          >
            Signup
          </button>
        </div>
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
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        <div className="text-center mt-4">
          <p className="text-gray-600 mb-2">or</p>
          <button
            onClick={() => signIn("google")}
            className="bg-green-500 w-full text-white py-2 px-4 rounded hover:bg-green-800"
          >
            Sign in with Google
          </button>
          <button
            onClick={handleFacebookLogin}
            className="bg-blue-700 w-full text-white py-2 px-4 rounded hover:bg-blue-900 mt-2"
          >
            Sign in with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
