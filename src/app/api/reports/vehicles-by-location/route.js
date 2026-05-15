import pool from "@/lib/db";

// handles report for vehicles involved in violations within a city or region
export async function GET(request) {
  let conn;

  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");

    if (!location) {
      return Response.json(
        {
          success: false,
          message: "City or region is required.",
        },
        { status: 400 }
      );
    }

    conn = await pool.getConnection();

    const rows = await conn.query(
      `
      SELECT
        tv.violationno,
        tv.violationtype,
        tv.violationdate,
        tv.violationloc,
        tv.violationstatus,
        v.chassisno,
        v.plateno,
        v.make,
        v.model,
        v.vehicletype,
        v.color,
        v.myear,
        d.driverno,
        d.licno,
        d.fname,
        d.mname,
        d.lname
      FROM TRAFFIC_VIOLATION tv
      JOIN VEHICLE v ON tv.chassisno = v.chassisno
      JOIN DRIVER d ON tv.driverno = d.driverno
      WHERE tv.violationloc LIKE ?
      ORDER BY tv.violationdate DESC
      `,
      [`%${location}%`]
    );

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to generate vehicles by location report.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}