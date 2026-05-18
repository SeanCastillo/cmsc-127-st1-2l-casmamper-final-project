import pool from "@/lib/db";

// handles report for vehicles with expired registrations as of a given date
export async function GET(request) {
  let conn;

  try {
    const { searchParams } = new URL(request.url);
    const asOfDate = searchParams.get("asOfDate");

    if (!asOfDate) {
      return Response.json(
        {
          success: false,
          message: "As of date is required.",
        },
        { status: 400 }
      );
    }

    conn = await pool.getConnection();

    const rows = await conn.query(
      `
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
        v.color,
        v.myear,
        d.driverno,
        d.licno,
        d.fname,
        d.mname,
        d.lname
      FROM vehicle_registration r
      JOIN vehicle v ON r.chassisno = v.chassisno
      JOIN driver d ON v.driverno = d.driverno
      WHERE r.expirationdate < ?
      ORDER BY r.expirationdate
      `,
      [asOfDate]
    );

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to generate expired registrations report.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}