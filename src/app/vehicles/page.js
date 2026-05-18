"use client";

import { useEffect, useState } from "react";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [form, setForm] = useState({
    chassisno: "",
    engineno: "",
    plateno: "",
    color: "",
    myear: "",
    vehicletype: "",
    model: "",
    make: "",
    driverno: "",
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  async function fetchVehicles() {
    try {
      setLoading(true);
      const response = await fetch("/api/vehicles");
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setVehicles(result.data);
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
    setEditVehicle(null);
    setForm({
      chassisno: "", engineno: "", plateno: "", color: "",
      myear: "", vehicletype: "", model: "", make: "", driverno: "",
    });
    setShowModal(true);
  }

  function openEditModal(vehicle) {
    setEditVehicle(vehicle);
    setForm({
      chassisno: vehicle.chassisno,
      engineno: vehicle.engineno,
      plateno: vehicle.plateno,
      color: vehicle.color,
      myear: vehicle.myear ? new Date(vehicle.myear).getFullYear().toString() : "",
      vehicletype: vehicle.vehicletype,
      model: vehicle.model,
      make: vehicle.make,
      driverno: vehicle.driverno,
    });
    setShowModal(true);
  }

  async function handleSubmit() {
    try {
      const method = editVehicle ? "PUT" : "POST";
      const response = await fetch("/api/vehicles", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          myear: form.myear ? `${form.myear}-01-01` : "",
        }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setShowModal(false);
      fetchVehicles();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(chassisno) {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      const response = await fetch("/api/vehicles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chassisno }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      fetchVehicles();
    } catch (err) {
      alert(err.message);
    }
  }

  function formatYear(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).getFullYear();
  }

  function getOwnerName(vehicle) {
    return [vehicle.fname, vehicle.mname, vehicle.lname].filter(Boolean).join(" ");
  }

  if (loading) return <main className="p-6">Loading vehicles...</main>;
  if (error) return <main className="p-6">Error: {error}</main>;

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <button onClick={openAddModal} className="btn-primary">
          + Add Vehicle
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">Plate No.</th>
              <th className="border p-2">Chassis No.</th>
              <th className="border p-2">Engine No.</th>
              <th className="border p-2">Vehicle Type</th>
              <th className="border p-2">Make</th>
              <th className="border p-2">Model</th>
              <th className="border p-2">Year</th>
              <th className="border p-2">Color</th>
              <th className="border p-2">Owner</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.chassisno}>
                <td className="border p-2">{vehicle.plateno}</td>
                <td className="border p-2">{vehicle.chassisno}</td>
                <td className="border p-2">{vehicle.engineno}</td>
                <td className="border p-2">{vehicle.vehicletype}</td>
                <td className="border p-2">{vehicle.make}</td>
                <td className="border p-2">{vehicle.model}</td>
                <td className="border p-2">{formatYear(vehicle.myear)}</td>
                <td className="border p-2">{vehicle.color}</td>
                <td className="border p-2">{getOwnerName(vehicle)}</td>
                <td className="border p-2">
                  <button
                    onClick={() => openEditModal(vehicle)}
                    className="mr-2 btn-primary-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.chassisno)}
                    className="btn-danger-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold">{editVehicle ? "Edit Vehicle" : "Add Vehicle"}</h2>

            <div className="grid gap-3">
              <input name="chassisno" value={form.chassisno} onChange={handleChange} placeholder="Chassis No." disabled={!!editVehicle} className="form-field w-full disabled:bg-slate-100 disabled:text-slate-500" />
              <input name="engineno" value={form.engineno} onChange={handleChange} placeholder="Engine No." className="form-field w-full" />
              <input name="plateno" value={form.plateno} onChange={handleChange} placeholder="Plate No." className="form-field w-full" />
              <input name="color" value={form.color} onChange={handleChange} placeholder="Color" className="form-field w-full" />
              <input name="myear" value={form.myear} onChange={handleChange} placeholder="Year (e.g. 2020)" type="number" className="form-field w-full" />
              <select name="vehicletype" value={form.vehicletype} onChange={handleChange} className="form-field w-full">
                <option value="">Select Vehicle Type</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="private car">Private Car</option>
                <option value="public utility vehicle">Public Utility Vehicle</option>
              </select>
              <input name="model" value={form.model} onChange={handleChange} placeholder="Model" className="form-field w-full" />
              <input name="make" value={form.make} onChange={handleChange} placeholder="Make" className="form-field w-full" />
              <input name="driverno" value={form.driverno} onChange={handleChange} placeholder="Driver No. (e.g. D000000000001)" className="form-field w-full" />
            </div>

            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setShowModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                {editVehicle ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}