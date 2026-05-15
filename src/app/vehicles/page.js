"use client";

import { useEffect, useState } from "react";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVehicles() {
      try {
        // fetch vehicle records from the api route
        const response = await fetch("/api/vehicles");
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch vehicles");
        }

        setVehicles(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  function formatYear(dateString) {
    if (!dateString) return "N/A";

    // extract the year from the database date value
    return new Date(dateString).getFullYear();
  }

  function getOwnerName(vehicle) {
    return [vehicle.fname, vehicle.mname, vehicle.lname]
      .filter(Boolean)
      .join(" ");
  }

  if (loading) {
    return <main className="p-6">Loading vehicles...</main>;
  }

  if (error) {
    return <main className="p-6">Error: {error}</main>;
  }

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Vehicles</h1>

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
              <th className="border p-2">License No.</th>
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
                <td className="border p-2">{vehicle.licno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}