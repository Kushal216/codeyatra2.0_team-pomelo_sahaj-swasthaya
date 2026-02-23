'use client';
import { useState } from 'react';

const INITIAL_FORM = {
  name: '',
  department: '',
  specialization: '',
  isActive: true,
};

export function useAddDoctorForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.department) {
      setError('Name and Department are required.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Doctor added successfully!');
        setForm(INITIAL_FORM);
      } else {
        setError(data.error || 'Failed to add doctor.');
      }
    } catch (err) {
      setError(err.message || 'Failed to add doctor.');
    } finally {
      setLoading(false);
    }
  }

  return { form, loading, error, success, handleChange, handleSubmit };
}
