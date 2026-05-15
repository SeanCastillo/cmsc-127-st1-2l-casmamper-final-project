"use client";

import { useEffect, useState } from "react";

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDrivers() {
      try {
        // fetch driver records from the api route
        const response = await fetch("/api/drivers");
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch drivers");
        }

        setDrivers(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDrivers();
  }, []);

  function formatDate(dateString) {
    if (!dateString) return "N/A";

    // convert database date into a readable format
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return <main className="p-6">Loading drivers...</main>;
  }

  if (error) {
    return <main className="p-6">Error: {error}</main>;
  }

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Drivers</h1>

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
            </tr>
          </thead>

          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.driverno}>
                <td className="border p-2">{driver.driverno}</td>
                <td className="border p-2">{driver.licno}</td>
                <td className="border p-2">
                  {[driver.fname, driver.mname, driver.lname]
                    .filter(Boolean)
                    .join(" ")}
                </td>
                <td className="border p-2">{driver.sex}</td>
                <td className="border p-2">{formatDate(driver.birthdate)}</td>
                <td className="border p-2">{driver.address}</td>
                <td className="border p-2">{driver.lictype}</td>
                <td className="border p-2">{driver.licstatus}</td>
                <td className="border p-2">
                  {formatDate(driver.licexpiration)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}