import pool from "@/lib/db";

// handles retrieving vehicle registration records with vehicle and owner details
export async function GET() {
  let conn;

  try {
    conn = await pool.getConnection();

    const rows = await conn.query(`
      SELECT
        r.registrationno,
        r.registrationdate,
        r.expirationdate,
        r.registrationstatus,
        r.chassisno,
        v.plateno,
        v.make,
        v.model,
        v.vehicletype,
        v.driverno,
        d.fname,
        d.mname,
        d.lname
      FROM VEHICLE_REGISTRATION r
      JOIN VEHICLE v ON r.chassisno = v.chassisno
      JOIN DRIVER d ON v.driverno = d.driverno
      ORDER BY r.expirationdate
    `);

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch registrations.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}