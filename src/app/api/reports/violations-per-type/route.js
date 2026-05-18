import pool from "@/lib/db";

// handles report for counting violations per type in a selected year
export async function GET(request) {
  let conn;

  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");

    if (!year) {
      return Response.json(
        {
          success: false,
          message: "Year is required.",
        },
        { status: 400 }
      );
    }

    conn = await pool.getConnection();

    const rows = await conn.query(
      `
      SELECT
        violationtype,
        COUNT(*) AS totalviolations
      FROM traffic_violation
      WHERE YEAR(violationdate) = ?
      GROUP BY violationtype
      ORDER BY totalviolations DESC, violationtype
      `,
      [year]
    );

    // convert bigint count values so they can be returned as json
    const serializedRows = rows.map((row) => ({
      ...row,
      totalviolations: Number(row.totalviolations),
    }));

    return Response.json({
      success: true,
      data: serializedRows,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to generate violations per type report.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}