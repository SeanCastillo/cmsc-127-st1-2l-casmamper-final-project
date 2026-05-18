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
      FROM driver
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


// handles adding a new driver record
export async function POST(request) {
  let conn;

  try {
    conn = await pool.getConnection();

    const body = await request.json();

    const {
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
      licexpiration,
    } = body;

    await conn.query(
      `INSERT INTO driver (driverno, licno, fname, mname, lname, sex, birthdate, address, lictype, licstatus, licexpiration)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [driverno, licno, fname, mname, lname, sex, birthdate, address, lictype, licstatus, licexpiration]
    );

    return Response.json({ success: true, message: "Driver added successfully." });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to add driver.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}

// handles updating an existing driver record
export async function PUT(request) {
  let conn;

  try {
    conn = await pool.getConnection();

    const body = await request.json();

    const {
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
      licexpiration,
    } = body;

    await conn.query(
      `UPDATE driver SET licno=?, fname=?, mname=?, lname=?, sex=?, birthdate=?, address=?, lictype=?, licstatus=?, licexpiration=?
       WHERE driverno=?`,
      [licno, fname, mname, lname, sex, birthdate, address, lictype, licstatus, licexpiration, driverno]
    );

    return Response.json({ success: true, message: "Driver updated successfully." });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to update driver.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}

// handles deleting a driver record
export async function DELETE(request) {
  let conn;

  try {
    conn = await pool.getConnection();

    const body = await request.json();
    const { driverno } = body;

    await conn.query(`DELETE FROM driver WHERE driverno=?`, [driverno]);

    return Response.json({ success: true, message: "Driver deleted successfully." });
  } catch (error) {
    const isForeignKey = error.message.includes("foreign key constraint");
    return Response.json(
      {
        success: false,
        message: isForeignKey
          ? "Cannot delete this driver because they have linked vehicles, registrations, or violations."
          : "Failed to delete driver.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}