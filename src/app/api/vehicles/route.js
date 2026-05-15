import pool from "@/lib/db";

// handles retrieving vehicle records with owner details
export async function GET() {
  let conn;

  try {
    conn = await pool.getConnection();

    const rows = await conn.query(`
      SELECT
        v.chassisno,
        v.engineno,
        v.plateno,
        v.color,
        v.myear,
        v.vehicletype,
        v.model,
        v.make,
        v.driverno,
        d.licno,
        d.fname,
        d.mname,
        d.lname
      FROM VEHICLE v
      JOIN DRIVER d ON v.driverno = d.driverno
      ORDER BY v.plateno
    `);

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch vehicles.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}