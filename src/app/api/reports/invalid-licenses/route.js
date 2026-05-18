import pool from "@/lib/db";

// handles report for drivers with expired or suspended licenses
export async function GET() {
  let conn;

  try {
    conn = await pool.getConnection();

    const rows = await conn.query(`
      SELECT
        driverno,
        licno,
        fname,
        mname,
        lname,
        sex,
        birthdate,
        address,
        lictype,
        licstatus,
        licexpiration
      FROM driver
      WHERE licstatus IN ('expired', 'suspended')
         OR licexpiration < CURDATE()
      ORDER BY licstatus, licexpiration
    `);

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to generate invalid licenses report.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}