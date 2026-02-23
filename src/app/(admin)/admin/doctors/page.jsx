"use client";
import AddDoctorForm from "@/components/dashboard/AddDoctorForm";
import React, { useEffect, useState } from "react";

const Doctors = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        if (data.success) setDepartments(data.departments);
        else setError("Failed to load departments");
      } catch (err) {
        setError("Failed to load departments");
      } finally {
        setLoading(false);
      }
    }
    fetchDepartments();
  }, []);

  const handleAddDoctor = async (form) => {
    try {
      const res = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create doctor");
      }
    } catch (err) {
      setError(err.message || "Failed to create doctor");
    }
  };

  if (loading) return <div>Loading departments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <AddDoctorForm onSubmit={handleAddDoctor} departments={departments} />
    </div>
  );
};

export default Doctors;
