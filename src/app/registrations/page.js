"use client";

import { useEffect, useState } from "react";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        // fetch registration records from the api route
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

    fetchRegistrations();
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
      <h1 className="mb-4 text-2xl font-bold">Vehicle Registrations</h1>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">Registration No.</th>
              <th className="border p-2">Registration Date</th>
              <th className="border p-2">Expiration Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Plate No.</th>
              <th className="border p-2">Vehicle</th>
              <th className="border p-2">Vehicle Type</th>
              <th className="border p-2">Owner</th>
              <th className="border p-2">Driver No.</th>
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
                <td className="border p-2">{registration.vehicletype}</td>
                <td className="border p-2">{getOwnerName(registration)}</td>
                <td className="border p-2">{registration.driverno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}