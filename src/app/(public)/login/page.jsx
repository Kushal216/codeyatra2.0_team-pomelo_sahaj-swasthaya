"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) login(data.token, data.user);
    else alert(data.error);
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gray-100 rounded-4xl">
        <form
          onSubmit={handleSubmit}
          className="p-8 bg-white rounded shadow-md w-96"
        >
          <h2 className="text-2xl mb-4 font-bold">Login</h2>
          <label>Email: </label>
          <input
            className="w-full p-2 mb-4 border  rounded-xl"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password: </label>
          <input
            className="w-full p-2 mb-4 border  rounded-xl"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded-xl">
            Login
          </button>
          <p className="mt-4 text-sm text-center">
            Don,t have an account?{" "}
            <Link href="/register" className="text-blue-500 ">
              Register
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;
