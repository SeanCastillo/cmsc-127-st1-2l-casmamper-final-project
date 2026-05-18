import pool from "@/lib/db";

// handles report for viewing all vehicles owned by a given driver
export async function GET(request) {
  let conn;

  try {
    const { searchParams } = new URL(request.url);
    const driverNo = searchParams.get("driverNo");

    if (!driverNo) {
      return Response.json(
        {
          success: false,
          message: "Driver number is required.",
        },
        { status: 400 }
      );
    }

    conn = await pool.getConnection();

    const rows = await conn.query(
      `
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
      FROM vehicle v
      JOIN driver d ON v.driverno = d.driverno
      WHERE v.driverno = ?
      ORDER BY v.plateno
      `,
      [driverNo]
    );

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to generate vehicles by driver report.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}