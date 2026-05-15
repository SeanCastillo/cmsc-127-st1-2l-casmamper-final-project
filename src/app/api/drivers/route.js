import pool from "@/lib/db";

// handles retrieving driver records
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
      FROM DRIVER
      ORDER BY driverno
    `);

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch drivers.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}