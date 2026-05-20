"use client";

import { useEffect, useState } from "react";

export default function ViolationsPage() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editViolation, setEditViolation] = useState(null);
  const [form, setForm] = useState({
    violationno: "",
    violationtype: "",
    violationdate: "",
    violationloc: "",
    fineamount: "",
    appofficer: "",
    violationstatus: "",
    driverno: "",
    chassisno: "",
  });

  async function fetchViolations() {
    try {
      setLoading(true);
      const response = await fetch("/api/violations");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch violations");
      }

      setViolations(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchViolations();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openAddModal() {
    setEditViolation(null);
    setForm({
      violationno: "",
      violationtype: "",
      violationdate: "",
      violationloc: "",
      fineamount: "",
      appofficer: "",
      violationstatus: "",
      driverno: "",
      chassisno: "",
    });
    setShowModal(true);
  }

  function openEditModal(violation) {
    setEditViolation(violation);
    
    // Safely parse date back to YYYY-MM-DD input field format
    let rawDate = "";
    if (violation.violationdate) {
      const d = new Date(violation.violationdate);
      if (!isNaN(d.getTime())) {
        rawDate = d.toISOString().split("T")[0];
      }
    }

    setForm({
      violationno: violation.violationno,
      violationtype: violation.violationtype,
      violationdate: rawDate,
      violationloc: violation.violationloc || "",
      fineamount: violation.fineamount || "",
      appofficer: violation.appofficer || "",
      violationstatus: violation.violationstatus || "",
      driverno: violation.driverno,
      chassisno: violation.chassisno,
    });
    setShowModal(true);
  }

  async function handleSubmit() {
    try {
      const method = editViolation ? "PUT" : "POST";
      const response = await fetch("/api/violations", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setShowModal(false);
      fetchViolations();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(violationno) {
    if (!confirm("Are you sure you want to delete this violation record?")) return;
    try {
      const response = await fetch("/api/violations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ violationno }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      fetchViolations();
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

  function formatFineAmount(amount) {
    return Number(amount).toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
    });
  }

  function getDriverName(violation) {
    return [violation.fname, violation.mname, violation.lname]
      .filter(Boolean)
      .join(" ");
  }

  if (loading) {
    return <main className="p-6">Loading violations...</main>;
  }

  if (error) {
    return <main className="p-6">Error: {error}</main>;
  }

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Traffic Violations</h1>
        <button onClick={openAddModal} className="btn-primary">
          + Add Violation
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">Violation No.</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Fine</th>
              <th className="border p-2">Officer</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Driver</th>
              <th className="border p-2">License No.</th>
              <th className="border p-2">Vehicle</th>
              <th className="border p-2">Plate No.</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {violations.map((violation) => (
              <tr key={violation.violationno}>
                <td className="border p-2">{violation.violationno}</td>
                <td className="border p-2">{violation.violationtype}</td>
                <td className="border p-2">{formatDate(violation.violationdate)}</td>
                <td className="border p-2">{violation.violationloc}</td>
                <td className="border p-2">{formatFineAmount(violation.fineamount)}</td>
                <td className="border p-2">{violation.appofficer || "N/A"}</td>
                <td className="border p-2">{violation.violationstatus}</td>
                <td className="border p-2">{getDriverName(violation)}</td>
                <td className="border p-2">{violation.licno}</td>
                <td className="border p-2">
                  {violation.make} {violation.model}
                </td>
                <td className="border p-2">{violation.plateno}</td>
                <td className="border p-2">
                  {/* Flexbox wrapper to guarantee buttons stay horizontally aligned */}
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(violation)}
                      className="btn-primary-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(violation.violationno)}
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
              {editViolation ? "Edit Violation" : "Add Violation"}
            </h2>

            <div className="grid gap-3">
              <input
                name="violationno"
                value={form.violationno}
                onChange={handleChange}
                placeholder="Violation No."
                disabled={!!editViolation}
                className="form-field w-full disabled:bg-slate-100 disabled:text-slate-500"
              />
              <input
                name="violationtype"
                value={form.violationtype}
                onChange={handleChange}
                placeholder="Violation Type"
                className="form-field w-full"
              />
              <input
                name="violationdate"
                value={form.violationdate}
                onChange={handleChange}
                type="date"
                className="form-field w-full"
              />
              <input
                name="violationloc"
                value={form.violationloc}
                onChange={handleChange}
                placeholder="Location"
                className="form-field w-full"
              />
              <input
                name="fineamount"
                value={form.fineamount}
                onChange={handleChange}
                placeholder="Fine Amount"
                type="number"
                step="0.01"
                className="form-field w-full"
              />
              <input
                name="appofficer"
                value={form.appofficer}
                onChange={handleChange}
                placeholder="Approving Officer"
                className="form-field w-full"
              />
              <select
                name="violationstatus"
                value={form.violationstatus}
                onChange={handleChange}
                className="form-field w-full"
              >
                <option value="">Select Status</option>
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="unpaid">unpaid</option>
                <option value="dismissed">dismissed</option>
              </select>
              <input
                name="driverno"
                value={form.driverno}
                onChange={handleChange}
                placeholder="Driver No."
                className="form-field w-full"
              />
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
                {editViolation ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}