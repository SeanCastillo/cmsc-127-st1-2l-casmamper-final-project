"use client";

import { useEffect, useState } from "react";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editRegistration, setEditRegistration] = useState(null);
  const [form, setForm] = useState({
    registrationno: "",
    registrationdate: "",
    expirationdate: "",
    registrationstatus: "",
    chassisno: "",
  });

  async function fetchRegistrations() {
    try {
      setLoading(true);
      const response = await fetch("/api/registrations");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch registrations");
      }

      setRegistrations(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRegistrations();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openAddModal() {
    setEditRegistration(null);
    setForm({
      registrationno: "",
      registrationdate: "",
      expirationdate: "",
      registrationstatus: "",
      chassisno: "",
    });
    setShowModal(true);
  }

  function openEditModal(registration) {
    setEditRegistration(registration);
    
    let rawRegDate = "";
    if (registration.registrationdate) {
      const d = new Date(registration.registrationdate);
      if (!isNaN(d.getTime())) {
        rawRegDate = d.toISOString().split("T")[0];
      }
    }

    let rawExpDate = "";
    if (registration.expirationdate) {
      const d = new Date(registration.expirationdate);
      if (!isNaN(d.getTime())) {
        rawExpDate = d.toISOString().split("T")[0];
      }
    }

    setForm({
      registrationno: registration.registrationno,
      registrationdate: rawRegDate,
      expirationdate: rawExpDate,
      registrationstatus: registration.registrationstatus || "",
      chassisno: registration.chassisno,
    });
    setShowModal(true);
  }

  async function handleSubmit() {
    try {
      const method = editRegistration ? "PUT" : "POST";
      const response = await fetch("/api/registrations", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setShowModal(false);
      fetchRegistrations();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(registrationno) {
    if (!confirm("Are you sure you want to delete this registration record?")) return;
    try {
      const response = await fetch("/api/registrations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationno }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      fetchRegistrations();
    } catch (err) {
      alert(err.message);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getOwnerName(registration) {
    return [registration.fname, registration.mname, registration.lname]
      .filter(Boolean)
      .join(" ");
  }

  if (loading) {
    return <main className="p-6">Loading registrations...</main>;
  }

  if (error) {
    return <main className="p-6">Error: {error}</main>;
  }

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vehicle Registrations</h1>
        <button onClick={openAddModal} className="btn-primary">
          + Add Registration
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">Registration No.</th>
              <th className="border p-2">Reg. Date</th>
              <th className="border p-2">Exp. Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Plate No.</th>
              <th className="border p-2">Vehicle</th>
              <th className="border p-2">Owner</th>
              <th className="border p-2">Chassis No.</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {registrations.map((registration) => (
              <tr key={registration.registrationno}>
                <td className="border p-2">{registration.registrationno}</td>
                <td className="border p-2">
                  {formatDate(registration.registrationdate)}
                </td>
                <td className="border p-2">
                  {formatDate(registration.expirationdate)}
                </td>
                <td className="border p-2">
                  {registration.registrationstatus}
                </td>
                <td className="border p-2">{registration.plateno}</td>
                <td className="border p-2">
                  {registration.make} {registration.model}
                </td>
                <td className="border p-2">{getOwnerName(registration)}</td>
                <td className="border p-2">{registration.chassisno}</td>
                <td className="border p-2">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(registration)}
                      className="btn-primary-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(registration.registrationno)}
                      className="btn-danger-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold">
              {editRegistration ? "Edit Registration" : "Add Registration"}
            </h2>

            <div className="grid gap-3">
              <input
                name="registrationno"
                value={form.registrationno}
                onChange={handleChange}
                placeholder="Registration No."
                disabled={!!editRegistration}
                className="form-field w-full disabled:bg-slate-100 disabled:text-slate-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Reg. Date</label>
                  <input
                    name="registrationdate"
                    value={form.registrationdate}
                    onChange={handleChange}
                    type="date"
                    className="form-field w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Exp. Date</label>
                  <input
                    name="expirationdate"
                    value={form.expirationdate}
                    onChange={handleChange}
                    type="date"
                    className="form-field w-full"
                  />
                </div>
              </div>
              <select
                name="registrationstatus"
                value={form.registrationstatus}
                onChange={handleChange}
                className="form-field w-full"
              >
                <option value="">Select Status</option>
                <option value="active">active</option>
                <option value="expired">expired</option>
                <option value="pending">pending</option>
              </select>
              <input
                name="chassisno"
                value={form.chassisno}
                onChange={handleChange}
                placeholder="Chassis No."
                className="form-field w-full"
              />
            </div>

            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setShowModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                {editRegistration ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}