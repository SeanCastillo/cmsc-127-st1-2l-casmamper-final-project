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
      FROM vehicle v
      JOIN driver d ON v.driverno = d.driverno
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


// handles adding a new vehicle record
export async function POST(request) {
  let conn;

  try {
    conn = await pool.getConnection();

    const body = await request.json();

    const {
      chassisno,
      engineno,
      plateno,
      color,
      myear,
      vehicletype,
      model,
      make,
      driverno,
    } = body;

    await conn.query(
      `INSERT INTO vehicle (chassisno, engineno, plateno, color, myear, vehicletype, model, make, driverno)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [chassisno, engineno, plateno, color, myear, vehicletype, model, make, driverno]
    );

    return Response.json({ success: true, message: "Vehicle added successfully." });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to add vehicle.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}


// handles updating an existing vehicle record
export async function PUT(request) {
  let conn;

  try {
    conn = await pool.getConnection();

    const body = await request.json();

    const {
      chassisno,
      engineno,
      plateno,
      color,
      myear,
      vehicletype,
      model,
      make,
      driverno,
    } = body;

    await conn.query(
      `UPDATE vehicle SET engineno=?, plateno=?, color=?, myear=?, vehicletype=?, model=?, make=?, driverno=?
       WHERE chassisno=?`,
      [engineno, plateno, color, myear, vehicletype, model, make, driverno, chassisno]
    );

    return Response.json({ success: true, message: "Vehicle updated successfully." });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to update vehicle.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}


// handles deleting a vehicle record
export async function DELETE(request) {
  let conn;

  try {
    conn = await pool.getConnection();

    const body = await request.json();
    const { chassisno } = body;

    await conn.query(`DELETE FROM vehicle WHERE chassisno=?`, [chassisno]);

    return Response.json({ success: true, message: "Vehicle deleted successfully." });
  } catch (error) {
    const isForeignKey = error.message.includes("foreign key constraint");
    return Response.json(
      {
        success: false,
        message: isForeignKey
          ? "Cannot delete this vehicle because it has linked registrations or violations."
          : "Failed to delete vehicle.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}