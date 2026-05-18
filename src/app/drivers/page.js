"use client";

import { useEffect, useState } from "react";

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editDriver, setEditDriver] = useState(null);
  const [form, setForm] = useState({
    driverno: "",
    licno: "",
    fname: "",
    mname: "",
    lname: "",
    sex: "",
    birthdate: "",
    address: "",
    lictype: "",
    licstatus: "",
    licexpiration: "",
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  async function fetchDrivers() {
    try {
      setLoading(true);
      const response = await fetch("/api/drivers");
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setDrivers(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openAddModal() {
    setEditDriver(null);
    setForm({
      driverno: "", licno: "", fname: "", mname: "", lname: "",
      sex: "", birthdate: "", address: "", lictype: "", licstatus: "", licexpiration: "",
    });
    setShowModal(true);
  }

  function openEditModal(driver) {
    setEditDriver(driver);
    setForm({
      driverno: driver.driverno,
      licno: driver.licno,
      fname: driver.fname,
      mname: driver.mname || "",
      lname: driver.lname,
      sex: driver.sex,
      birthdate: driver.birthdate ? new Date(driver.birthdate).toISOString().split("T")[0] : "",
      address: driver.address,
      lictype: driver.lictype,
      licstatus: driver.licstatus,
      licexpiration: driver.licexpiration ? new Date(driver.licexpiration).toISOString().split("T")[0] : "",
    });
    setShowModal(true);
  }

  async function handleSubmit() {
    try {
      const method = editDriver ? "PUT" : "POST";
      const response = await fetch("/api/drivers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setShowModal(false);
      fetchDrivers();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(driverno) {
    if (!confirm("Are you sure you want to delete this driver?")) return;
    try {
      const response = await fetch("/api/drivers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverno }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      fetchDrivers();
    } catch (err) {
      if (err.message.includes("foreign key constraint")) {
        alert("Cannot delete this driver because they have linked vehicles, registrations, or violations.");
      } else {
        alert(err.message);
      }
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric", month: "short", day: "numeric",
    });
  }

  if (loading) return <main className="p-6">Loading drivers...</main>;
  if (error) return <main className="p-6">Error: {error}</main>;

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Drivers</h1>
        <button onClick={openAddModal} className="rounded bg-black px-4 py-2 text-white">
          + Add Driver
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">Driver No.</th>
              <th className="border p-2">License No.</th>
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Sex</th>
              <th className="border p-2">Birthdate</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">License Type</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Expiration</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.driverno}>
                <td className="border p-2">{driver.driverno}</td>
                <td className="border p-2">{driver.licno}</td>
                <td className="border p-2">{[driver.fname, driver.mname, driver.lname].filter(Boolean).join(" ")}</td>
                <td className="border p-2">{driver.sex}</td>
                <td className="border p-2">{formatDate(driver.birthdate)}</td>
                <td className="border p-2">{driver.address}</td>
                <td className="border p-2">{driver.lictype}</td>
                <td className="border p-2">{driver.licstatus}</td>
                <td className="border p-2">{formatDate(driver.licexpiration)}</td>
                <td className="border p-2">
                  <button onClick={() => openEditModal(driver)} className="mr-2 rounded bg-blue-500 px-2 py-1 text-white text-xs">Edit</button>
                  <button onClick={() => handleDelete(driver.driverno)} className="rounded bg-red-500 px-2 py-1 text-white text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold">{editDriver ? "Edit Driver" : "Add Driver"}</h2>

            <div className="grid gap-3">
              <input name="driverno" value={form.driverno} onChange={handleChange} placeholder="Driver No." disabled={!!editDriver} className="rounded border p-2 w-full disabled:bg-gray-100" />
              <input name="licno" value={form.licno} onChange={handleChange} placeholder="License No." className="rounded border p-2 w-full" />
              <input name="fname" value={form.fname} onChange={handleChange} placeholder="First Name" className="rounded border p-2 w-full" />
              <input name="mname" value={form.mname} onChange={handleChange} placeholder="Middle Name" className="rounded border p-2 w-full" />
              <input name="lname" value={form.lname} onChange={handleChange} placeholder="Last Name" className="rounded border p-2 w-full" />
              <select name="sex" value={form.sex} onChange={handleChange} className="rounded border p-2 w-full">
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input name="birthdate" value={form.birthdate} onChange={handleChange} type="date" placeholder="Birthdate" className="rounded border p-2 w-full" />
              <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="rounded border p-2 w-full" />
              <select name="lictype" value={form.lictype} onChange={handleChange} className="rounded border p-2 w-full">
                <option value="">Select License Type</option>
                <option value="Student Permit">Student Permit</option>
                <option value="Non-Professional">Non-Professional</option>
                <option value="Professional">Professional</option>
              </select>
              <select name="licstatus" value={form.licstatus} onChange={handleChange} className="rounded border p-2 w-full">
                <option value="">Select Status</option>
                <option value="valid">valid</option>
                <option value="expired">expired</option>
                <option value="suspended">suspended</option>
                <option value="revoked">revoked</option>
              </select>
              <input name="licexpiration" value={form.licexpiration} onChange={handleChange} type="date" placeholder="License Expiration" className="rounded border p-2 w-full" />
            </div>

            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setShowModal(false)} className="rounded border px-4 py-2">Cancel</button>
              <button onClick={handleSubmit} className="rounded bg-black px-4 py-2 text-white">{editDriver ? "Update" : "Add"}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}