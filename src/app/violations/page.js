"use client";

import { useEffect, useState } from "react";

export default function ViolationsPage() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchViolations() {
      try {
        // fetch traffic violation records from the api route
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

    fetchViolations();
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
      <h1 className="mb-4 text-2xl font-bold">Traffic Violations</h1>

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
            </tr>
          </thead>

          <tbody>
            {violations.map((violation) => (
              <tr key={violation.violationno}>
                <td className="border p-2">{violation.violationno}</td>
                <td className="border p-2">{violation.violationtype}</td>
                <td className="border p-2">
                  {formatDate(violation.violationdate)}
                </td>
                <td className="border p-2">{violation.violationloc}</td>
                <td className="border p-2">
                  {formatFineAmount(violation.fineamount)}
                </td>
                <td className="border p-2">{violation.appofficer || "N/A"}</td>
                <td className="border p-2">{violation.violationstatus}</td>
                <td className="border p-2">{getDriverName(violation)}</td>
                <td className="border p-2">{violation.licno}</td>
                <td className="border p-2">
                  {violation.make} {violation.model}
                </td>
                <td className="border p-2">{violation.plateno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}