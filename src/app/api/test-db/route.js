// import the database connection pool
import pool from "@/lib/db";

// GET request handler for testing database connection
export async function GET() {
  let conn;

  try {
    // get a connection from the pool
    conn = await pool.getConnection();

    // test query (can be replaced with real queries later)
    const rows = await conn.query("SELECT * FROM DRIVER LIMIT 5");

    // return success response with data
    return Response.json({
      success: true,
      message: "Database connection works!",
      data: rows,
    });

  } catch (error) {
    // return error if connection/query fails
    return Response.json(
      {
        success: false,
        message: "Database connection failed.",
        error: error.message,
      },
      { status: 500 }
    );

  } finally {
    // always release connection back to pool
    if (conn) conn.release();
  }
}