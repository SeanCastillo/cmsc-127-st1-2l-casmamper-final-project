"use client";

import { useEffect, useState } from "react";

export default function ReportsPage() {
    // stores the driver report results
    const [drivers, setDrivers] = useState([]);

    // stores the selected report filters
    const [filters, setFilters] = useState({
        licenseType: "",
        licenseStatus: "",
        sex: "",
        minAge: "",
        maxAge: "",
    });

    // handles loading and error states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // stores the vehicles by driver report results
    const [driverVehicles, setDriverVehicles] = useState([]);

    // stores the selected driver number for the vehicle ownership report
    const [selectedDriverNo, setSelectedDriverNo] = useState("");

    // handles the vehicle ownership report error state
    const [driverVehiclesError, setDriverVehiclesError] = useState("");

    // stores the expired registration report results
    const [expiredRegistrations, setExpiredRegistrations] = useState([]);

    // stores the selected date for checking expired registrations
    const [asOfDate, setAsOfDate] = useState("");

    // handles the expired registration report error state
    const [expiredRegistrationsError, setExpiredRegistrationsError] = useState("");

    // stores the invalid licenses report results
    const [invalidLicenses, setInvalidLicenses] = useState([]);

    // handles the invalid licenses report error state
    const [invalidLicensesError, setInvalidLicensesError] = useState("");

    // stores the violations by driver report results
    const [driverViolations, setDriverViolations] = useState([]);

    // stores filters for the driver violations report
    const [driverViolationFilters, setDriverViolationFilters] = useState({
        driverNo: "",
        startDate: "",
        endDate: "",
    });

    // handles the driver violations report error state
    const [driverViolationsError, setDriverViolationsError] = useState("");

    // stores the violations per type report results
    const [violationsPerType, setViolationsPerType] = useState([]);

    // stores the selected year for the violation count report
    const [violationYear, setViolationYear] = useState("");

    // handles the violations per type report error state
    const [violationsPerTypeError, setViolationsPerTypeError] = useState("");

    // stores the vehicles by location report results
    const [vehiclesByLocation, setVehiclesByLocation] = useState([]);

    // stores the selected city or region for the vehicle location report
    const [violationLocation, setViolationLocation] = useState("");

    // handles the vehicles by location report error state
    const [vehiclesByLocationError, setVehiclesByLocationError] = useState("");

    async function fetchDriverReport() {
        try {
            setLoading(true);
            setError("");

            // builds query parameters based on non-empty filters
            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            // requests the filtered driver report from the api
            const response = await fetch(`/api/reports/drivers?${params}`);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || "Failed to generate driver report");
            }

            setDrivers(result.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchVehiclesByDriver() {
        try {
            setDriverVehiclesError("");

            if (!selectedDriverNo) {
                setDriverVehiclesError("Please enter a driver number.");
                return;
            }

            // requests vehicles owned by the selected driver
            const response = await fetch(
                `/api/reports/vehicles-by-driver?driverNo=${selectedDriverNo}`
            );
            const result = await response.json();

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to generate vehicles by driver report"
                );
            }

            setDriverVehicles(result.data);
        } catch (err) {
            setDriverVehiclesError(err.message);
        }
    }

    async function fetchExpiredRegistrations() {
        try {
            setExpiredRegistrationsError("");

            if (!asOfDate) {
                setExpiredRegistrationsError("Please select an as of date.");
                return;
            }

            // requests vehicles with expired registrations as of the selected date
            const response = await fetch(
                `/api/reports/expired-registrations?asOfDate=${asOfDate}`
            );
            const result = await response.json();

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to generate expired registrations report"
                );
            }

            setExpiredRegistrations(result.data);
        } catch (err) {
            setExpiredRegistrationsError(err.message);
        }
    }

    async function fetchInvalidLicenses() {
        try {
            setInvalidLicensesError("");

            // requests drivers with expired or suspended licenses
            const response = await fetch("/api/reports/invalid-licenses");
            const result = await response.json();

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to generate invalid licenses report"
                );
            }

            setInvalidLicenses(result.data);
        } catch (err) {
            setInvalidLicensesError(err.message);
        }
    }

    async function fetchViolationsByDriver() {
        try {
            setDriverViolationsError("");

            const { driverNo, startDate, endDate } = driverViolationFilters;

            if (!driverNo || !startDate || !endDate) {
                setDriverViolationsError(
                    "Please enter a driver number, start date, and end date."
                );
                return;
            }

            // requests violations committed by the selected driver within the date range
            const params = new URLSearchParams(driverViolationFilters);
            const response = await fetch(`/api/reports/violations-by-driver?${params}`);
            const result = await response.json();

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to generate violations by driver report"
                );
            }

            setDriverViolations(result.data);
        } catch (err) {
            setDriverViolationsError(err.message);
        }
    }

    async function fetchViolationsPerType() {
        try {
            setViolationsPerTypeError("");

            if (!violationYear) {
                setViolationsPerTypeError("Please enter a year.");
                return;
            }

            // requests violation totals grouped by violation type
            const response = await fetch(
                `/api/reports/violations-per-type?year=${violationYear}`
            );
            const result = await response.json();

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to generate violations per type report"
                );
            }

            setViolationsPerType(result.data);
        } catch (err) {
            setViolationsPerTypeError(err.message);
        }
    }

    async function fetchVehiclesByLocation() {
        try {
            setVehiclesByLocationError("");

            if (!violationLocation) {
                setVehiclesByLocationError("Please enter a city or region.");
                return;
            }

            // requests vehicles involved in violations within the selected location
            const response = await fetch(
                `/api/reports/vehicles-by-location?location=${violationLocation}`
            );
            const result = await response.json();

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to generate vehicles by location report"
                );
            }

            setVehiclesByLocation(result.data);
        } catch (err) {
            setVehiclesByLocationError(err.message);
        }
    }

    useEffect(() => {
        // loads the report once when the page opens
        fetchDriverReport();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        // prevents negative age filter values
        if ((name === "minAge" || name === "maxAge") && Number(value) < 0) {
            return;
        }

        // updates the changed filter field only
        setFilters((currentFilters) => ({
            ...currentFilters,
            [name]: value,
        }));
    }

    function formatDate(dateString) {
        if (!dateString) return "N/A";

        // converts database date into a readable format
        return new Date(dateString).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    function getDriverName(driver) {
        // combines first, middle, and last name while skipping null values
        return [driver.fname, driver.mname, driver.lname]
            .filter(Boolean)
            .join(" ");
    }

    function clearFilters() {
        // resets all filters to their default values
        setFilters({
            licenseType: "",
            licenseStatus: "",
            sex: "",
            minAge: "",
            maxAge: "",
        });
    }

    function formatYear(dateString) {
        if (!dateString) return "N/A";

        // extracts the vehicle model year from the database date value
        return new Date(dateString).getFullYear();
    }

    function handleDriverViolationFilterChange(event) {
        const { name, value } = event.target;

        // updates the changed driver violation filter field only
        setDriverViolationFilters((currentFilters) => ({
            ...currentFilters,
            [name]: value,
        }));
    }

    return (
        <main className="p-6">
            <h1 className="mb-2 text-2xl font-bold">Reports</h1>
            <p className="mb-6 text-sm text-gray-600">
                Generate SQL-based reports from the LTOIMS database.
            </p>

            <section className="mb-8 rounded-lg border p-4">
                <h2 className="mb-4 text-xl font-semibold">
                    Registered Drivers Report
                </h2>

                {/* filter controls for the driver report */}
                <div className="mb-4 grid gap-3 md:grid-cols-5">
                    <select
                        name="licenseType"
                        value={filters.licenseType}
                        onChange={handleChange}
                        className="rounded border p-2"
                    >
                        <option value="">All License Types</option>
                        <option value="Student Permit">Student Permit</option>
                        <option value="Non-Professional">Non-Professional</option>
                        <option value="Professional">Professional</option>
                    </select>

                    <select
                        name="licenseStatus"
                        value={filters.licenseStatus}
                        onChange={handleChange}
                        className="rounded border p-2"
                    >
                        <option value="">All Statuses</option>
                        <option value="valid">valid</option>
                        <option value="expired">expired</option>
                        <option value="suspended">suspended</option>
                        <option value="revoked">revoked</option>
                    </select>

                    <select
                        name="sex"
                        value={filters.sex}
                        onChange={handleChange}
                        className="rounded border p-2"
                    >
                        <option value="">All Sexes</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>

                    <input
                        type="number"
                        name="minAge"
                        value={filters.minAge}
                        onChange={handleChange}
                        placeholder="Min age"
                        min="0"
                        className="rounded border p-2"
                    />

                    <input
                        type="number"
                        name="maxAge"
                        value={filters.maxAge}
                        onChange={handleChange}
                        placeholder="Max age"
                        min="0"
                        className="rounded border p-2"
                    />
                </div>

                {/* report actions */}
                <div className="mb-4 flex gap-2">
                    <button
                        onClick={fetchDriverReport}
                        className="rounded bg-black px-4 py-2 text-white"
                    >
                        Generate Report
                    </button>

                    <button onClick={clearFilters} className="rounded border px-4 py-2">
                        Clear Filters
                    </button>
                </div>

                {/* loading and error messages */}
                {loading && <p>Loading report...</p>}
                {error && <p className="text-red-600">Error: {error}</p>}

                {/* driver report table */}
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="border p-2">Driver No.</th>
                                <th className="border p-2">License No.</th>
                                <th className="border p-2">Full Name</th>
                                <th className="border p-2">Sex</th>
                                <th className="border p-2">Age</th>
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
                                    <td className="border p-2">{getDriverName(driver)}</td>
                                    <td className="border p-2">{driver.sex}</td>
                                    <td className="border p-2">{driver.age}</td>
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
            </section>

            <section className="mb-8 rounded-lg border p-4">
                <h2 className="mb-4 text-xl font-semibold">
                    Vehicles Owned by Driver Report
                </h2>

                {/* driver number input for the vehicle ownership report */}
                <div className="mb-4 flex flex-col gap-2 md:flex-row">
                    <input
                        type="text"
                        value={selectedDriverNo}
                        onChange={(event) => setSelectedDriverNo(event.target.value)}
                        placeholder="Enter driver number (e.g. D000000000001)"
                        className="rounded border p-2 md:w-80"
                    />

                    <button
                        onClick={fetchVehiclesByDriver}
                        className="rounded bg-black px-4 py-2 text-white"
                    >
                        Generate Report
                    </button>
                </div>

                {driverVehiclesError && (
                    <p className="mb-4 text-red-600">Error: {driverVehiclesError}</p>
                )}

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
                            {driverVehicles.map((vehicle) => (
                                <tr key={vehicle.chassisno}>
                                    <td className="border p-2">{vehicle.plateno}</td>
                                    <td className="border p-2">{vehicle.chassisno}</td>
                                    <td className="border p-2">{vehicle.engineno}</td>
                                    <td className="border p-2">{vehicle.vehicletype}</td>
                                    <td className="border p-2">{vehicle.make}</td>
                                    <td className="border p-2">{vehicle.model}</td>
                                    <td className="border p-2">{formatYear(vehicle.myear)}</td>
                                    <td className="border p-2">{vehicle.color}</td>
                                    <td className="border p-2">{getDriverName(vehicle)}</td>
                                    <td className="border p-2">{vehicle.licno}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-8 rounded-lg border p-4">
                <h2 className="mb-4 text-xl font-semibold">
                    Expired Registrations Report
                </h2>

                {/* date input for the expired registrations report */}
                <div className="mb-4 flex flex-col gap-2 md:flex-row">
                    <input
                        type="date"
                        value={asOfDate}
                        onChange={(event) => setAsOfDate(event.target.value)}
                        className="rounded border p-2 md:w-80"
                    />

                    <button
                        onClick={fetchExpiredRegistrations}
                        className="rounded bg-black px-4 py-2 text-white"
                    >
                        Generate Report
                    </button>
                </div>

                {expiredRegistrationsError && (
                    <p className="mb-4 text-red-600">Error: {expiredRegistrationsError}</p>
                )}

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="border p-2">Registration No.</th>
                                <th className="border p-2">Expiration Date</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Plate No.</th>
                                <th className="border p-2">Vehicle</th>
                                <th className="border p-2">Type</th>
                                <th className="border p-2">Year</th>
                                <th className="border p-2">Owner</th>
                                <th className="border p-2">License No.</th>
                            </tr>
                        </thead>

                        <tbody>
                            {expiredRegistrations.map((registration) => (
                                <tr key={registration.registrationno}>
                                    <td className="border p-2">{registration.registrationno}</td>
                                    <td className="border p-2">
                                        {formatDate(registration.expirationdate)}
                                    </td>
                                    <td className="border p-2">{registration.registrationstatus}</td>
                                    <td className="border p-2">{registration.plateno}</td>
                                    <td className="border p-2">
                                        {registration.make} {registration.model}
                                    </td>
                                    <td className="border p-2">{registration.vehicletype}</td>
                                    <td className="border p-2">{formatYear(registration.myear)}</td>
                                    <td className="border p-2">{getDriverName(registration)}</td>
                                    <td className="border p-2">{registration.licno}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-8 rounded-lg border p-4">
                <h2 className="mb-4 text-xl font-semibold">
                    Expired or Suspended Licenses Report
                </h2>

                {/* action for generating the invalid licenses report */}
                <div className="mb-4">
                    <button
                        onClick={fetchInvalidLicenses}
                        className="rounded bg-black px-4 py-2 text-white"
                    >
                        Generate Report
                    </button>
                </div>

                {invalidLicensesError && (
                    <p className="mb-4 text-red-600">Error: {invalidLicensesError}</p>
                )}

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="border p-2">Driver No.</th>
                                <th className="border p-2">License No.</th>
                                <th className="border p-2">Full Name</th>
                                <th className="border p-2">Sex</th>
                                <th className="border p-2">License Type</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Expiration</th>
                                <th className="border p-2">Address</th>
                            </tr>
                        </thead>

                        <tbody>
                            {invalidLicenses.map((driver) => (
                                <tr key={driver.driverno}>
                                    <td className="border p-2">{driver.driverno}</td>
                                    <td className="border p-2">{driver.licno}</td>
                                    <td className="border p-2">{getDriverName(driver)}</td>
                                    <td className="border p-2">{driver.sex}</td>
                                    <td className="border p-2">{driver.lictype}</td>
                                    <td className="border p-2">{driver.licstatus}</td>
                                    <td className="border p-2">
                                        {formatDate(driver.licexpiration)}
                                    </td>
                                    <td className="border p-2">{driver.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-8 rounded-lg border p-4">
                <h2 className="mb-4 text-xl font-semibold">
                    Violations by Driver Report
                </h2>

                {/* filters for the driver violations report */}
                <div className="mb-4 grid gap-3 md:grid-cols-4">
                    <input
                        type="text"
                        name="driverNo"
                        value={driverViolationFilters.driverNo}
                        onChange={handleDriverViolationFilterChange}
                        placeholder="Driver no. (e.g. D000000000001)"
                        className="rounded border p-2"
                    />

                    <input
                        type="date"
                        name="startDate"
                        value={driverViolationFilters.startDate}
                        onChange={handleDriverViolationFilterChange}
                        className="rounded border p-2"
                    />

                    <input
                        type="date"
                        name="endDate"
                        value={driverViolationFilters.endDate}
                        onChange={handleDriverViolationFilterChange}
                        className="rounded border p-2"
                    />

                    <button
                        onClick={fetchViolationsByDriver}
                        className="rounded bg-black px-4 py-2 text-white"
                    >
                        Generate Report
                    </button>
                </div>

                {driverViolationsError && (
                    <p className="mb-4 text-red-600">Error: {driverViolationsError}</p>
                )}

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
                                <th className="border p-2">Vehicle</th>
                                <th className="border p-2">Plate No.</th>
                            </tr>
                        </thead>

                        <tbody>
                            {driverViolations.map((violation) => (
                                <tr key={violation.violationno}>
                                    <td className="border p-2">{violation.violationno}</td>
                                    <td className="border p-2">{violation.violationtype}</td>
                                    <td className="border p-2">
                                        {formatDate(violation.violationdate)}
                                    </td>
                                    <td className="border p-2">{violation.violationloc}</td>
                                    <td className="border p-2">
                                        {Number(violation.fineamount).toLocaleString("en-PH", {
                                            style: "currency",
                                            currency: "PHP",
                                        })}
                                    </td>
                                    <td className="border p-2">{violation.appofficer || "N/A"}</td>
                                    <td className="border p-2">{violation.violationstatus}</td>
                                    <td className="border p-2">
                                        {violation.make} {violation.model}
                                    </td>
                                    <td className="border p-2">{violation.plateno}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-8 rounded-lg border p-4">
                <h2 className="mb-4 text-xl font-semibold">
                    Violations per Type Report
                </h2>

                {/* year input for the violations per type report */}
                <div className="mb-4 flex flex-col gap-2 md:flex-row">
                    <input
                        type="number"
                        value={violationYear}
                        onChange={(event) => setViolationYear(event.target.value)}
                        placeholder="Enter year (e.g. 2024)"
                        min="1900"
                        className="rounded border p-2 md:w-80"
                    />

                    <button
                        onClick={fetchViolationsPerType}
                        className="rounded bg-black px-4 py-2 text-white"
                    >
                        Generate Report
                    </button>
                </div>

                {violationsPerTypeError && (
                    <p className="mb-4 text-red-600">Error: {violationsPerTypeError}</p>
                )}

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="border p-2">Violation Type</th>
                                <th className="border p-2">Total Violations</th>
                            </tr>
                        </thead>

                        <tbody>
                            {violationsPerType.map((violation) => (
                                <tr key={violation.violationtype}>
                                    <td className="border p-2">{violation.violationtype}</td>
                                    <td className="border p-2">{violation.totalviolations}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-8 rounded-lg border p-4">
                <h2 className="mb-4 text-xl font-semibold">
                    Vehicles Involved in Violations by Location Report
                </h2>

                {/* location input for the vehicle violation location report */}
                <div className="mb-4 flex flex-col gap-2 md:flex-row">
                    <input
                        type="text"
                        value={violationLocation}
                        onChange={(event) => setViolationLocation(event.target.value)}
                        placeholder="Enter city or region (e.g. Metro Manila)"
                        className="rounded border p-2 md:w-80"
                    />

                    <button
                        onClick={fetchVehiclesByLocation}
                        className="rounded bg-black px-4 py-2 text-white"
                    >
                        Generate Report
                    </button>
                </div>

                {vehiclesByLocationError && (
                    <p className="mb-4 text-red-600">Error: {vehiclesByLocationError}</p>
                )}

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="border p-2">Violation No.</th>
                                <th className="border p-2">Violation Type</th>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Location</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Plate No.</th>
                                <th className="border p-2">Vehicle</th>
                                <th className="border p-2">Type</th>
                                <th className="border p-2">Year</th>
                                <th className="border p-2">Owner</th>
                                <th className="border p-2">License No.</th>
                            </tr>
                        </thead>

                        <tbody>
                            {vehiclesByLocation.map((record) => (
                                <tr key={record.violationno}>
                                    <td className="border p-2">{record.violationno}</td>
                                    <td className="border p-2">{record.violationtype}</td>
                                    <td className="border p-2">
                                        {formatDate(record.violationdate)}
                                    </td>
                                    <td className="border p-2">{record.violationloc}</td>
                                    <td className="border p-2">{record.violationstatus}</td>
                                    <td className="border p-2">{record.plateno}</td>
                                    <td className="border p-2">
                                        {record.make} {record.model}
                                    </td>
                                    <td className="border p-2">{record.vehicletype}</td>
                                    <td className="border p-2">{formatYear(record.myear)}</td>
                                    <td className="border p-2">{getDriverName(record)}</td>
                                    <td className="border p-2">{record.licno}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

        </main>
    );
}