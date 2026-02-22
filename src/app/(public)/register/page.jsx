"use client";
import { useState } from "react";
import { useAuth } from "@/lib/context";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    insured: false,
  });
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success) {
      alert("Registered! Please login.");
      window.location.href = "/login";
    } else alert(data.error);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded shadow-md w-96"
      >
        <h2 className="text-2xl mb-4 font-bold">Register</h2>
        <label>Name: </label>
        <input
          className="w-full p-2 mb-4 border rounded"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <label>Email: </label>
        <input
          className="w-full p-2 mb-4 border rounded"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <label>Phone Number: </label>
        <input
          className="w-full p-2 mb-4 border rounded"
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <label>Password: </label>
        <input
          className="w-full p-2 mb-4 border rounded"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <label>Confirm Password: </label>
        <input
          className="w-full p-2 mb-4 border rounded"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <label>Health Insurance number: </label>
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Health Insurance Number"
          checked={formData.insured}
          onChange={(e) =>
            setFormData({ ...formData, insured: e.target.checked })
          }
        />
        <button className="w-full bg-green-600 text-white p-2 rounded-xl">
          Register
        </button>
        <p className="mt-4 text-sm text-center">
          Have an account?{" "}
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
