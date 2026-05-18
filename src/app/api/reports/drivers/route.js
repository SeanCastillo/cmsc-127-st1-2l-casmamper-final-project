import pool from "@/lib/db";

// handles driver report filtering by license type, status, age range, and sex
export async function GET(request) {
    let conn;

    try {
        const { searchParams } = new URL(request.url);

        const licenseType = searchParams.get("licenseType");
        const licenseStatus = searchParams.get("licenseStatus");
        const sex = searchParams.get("sex");
        const minAge = searchParams.get("minAge");
        const maxAge = searchParams.get("maxAge");

        const conditions = [];
        const values = [];

        if (licenseType) {
            conditions.push("lictype = ?");
            values.push(licenseType);
        }

        if (licenseStatus) {
            conditions.push("licstatus = ?");
            values.push(licenseStatus);
        }

        if (sex) {
            conditions.push("sex = ?");
            values.push(sex);
        }

        if (minAge) {
            conditions.push("TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) >= ?");
            values.push(Number(minAge));
        }

        if (maxAge) {
            conditions.push("TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) <= ?");
            values.push(Number(maxAge));
        }

        const whereClause =
            conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        conn = await pool.getConnection();

        const rows = await conn.query(
            `
      SELECT
        driverno,
        licno,
        fname,
        mname,
        lname,
        sex,
        birthdate,
        TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age,
        address,
        lictype,
        licstatus,
        licexpiration
      FROM driver
      ${whereClause}
      ORDER BY lname, fname
      `,
            values
        );

        // convert bigint values so they can be returned as json
        const serializedRows = rows.map((row) => ({
            ...row,
            age: Number(row.age),
        }));

        return Response.json({
            success: true,
            data: serializedRows,
        });
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Failed to generate driver report.",
                error: error.message,
            },
            { status: 500 }
        );
    } finally {
        if (conn) conn.release();
    }
}