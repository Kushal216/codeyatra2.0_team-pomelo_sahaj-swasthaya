"use client";
import { useState } from "react";
import { useAuth } from "@/lib/context";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    insured: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          insured: formData.insured,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Registered! Please login.");
        window.location.href = "/login";
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl mb-6 font-bold text-center">Register</h2>

        <label className="block mb-1">Name:</label>
        <input
          className="w-full p-2 mb-4 border rounded"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <label className="block mb-1">Email:</label>
        <input
          className="w-full p-2 mb-4 border rounded"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />

        <label className="block mb-1">Phone Number:</label>
        <input
          className="w-full p-2 mb-4 border rounded"
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          required
        />

        <label className="block mb-1">Password:</label>
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

        <label className="block mb-1">Confirm Password:</label>
        <input
          className="w-full p-2 mb-4 border rounded"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          required
        />

        <label className="block mb-1">Health Insurance Number:</label>
        <input
          className="w-full p-2 mb-4 border rounded"
          type="text"
          placeholder="Health Insurance Number"
          value={formData.insured}
          onChange={(e) =>
            setFormData({ ...formData, insured:e.target.value })
          }
        />

        <button
          type="submit"
          className={`w-full bg-green-600 text-white p-2 rounded-xl ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}