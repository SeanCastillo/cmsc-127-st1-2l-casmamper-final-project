import pool from "@/lib/db";

// handles report for driver violations within a selected date range
export async function GET(request) {
  let conn;

  try {
    const { searchParams } = new URL(request.url);
    const driverNo = searchParams.get("driverNo");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!driverNo || !startDate || !endDate) {
      return Response.json(
        {
          success: false,
          message: "Driver number, start date, and end date are required.",
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
      FROM traffic_violation tv
      JOIN driver d ON tv.driverno = d.driverno
      JOIN vehicle v ON tv.chassisno = v.chassisno
      WHERE tv.driverno = ?
        AND tv.violationdate BETWEEN ? AND ?
      ORDER BY tv.violationdate DESC
      `,
      [driverNo, startDate, endDate]
    );

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to generate violations by driver report.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}