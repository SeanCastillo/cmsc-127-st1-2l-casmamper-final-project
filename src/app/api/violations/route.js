import pool from "@/lib/db";

// handles retrieving traffic violation records with driver and vehicle details
export async function GET() {
  let conn;

  try {
    conn = await pool.getConnection();

    const rows = await conn.query(`
      SELECT
        tv.violationno,
        tv.violationtype,
        tv.violationdate,
        tv.violationloc,
        tv.fineamount,
        tv.appofficer,
        tv.violationstatus,
        tv.driverno,
        tv.chassisno,
        d.licno,
        d.fname,
        d.mname,
        d.lname,
        v.plateno,
        v.make,
        v.model,
        v.vehicletype
      FROM TRAFFIC_VIOLATION tv
      JOIN DRIVER d ON tv.driverno = d.driverno
      JOIN VEHICLE v ON tv.chassisno = v.chassisno
      ORDER BY tv.violationdate DESC
    `);

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch violations.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}