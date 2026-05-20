import pool from "@/lib/db";

//handles retrieving vehicle registration records with driver and vehicle details
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

// handles adding a new registration record
export async function POST(request) {
  let conn;

  try {
    conn = await pool.getConnection();
    const body = await request.json();

    const {
      registrationno,
      registrationdate,
      expirationdate,
      registrationstatus,
      chassisno,
    } = body;

    //validators
    if (!registrationno || String(registrationno).trim().length === 0) {
      return Response.json({ success: false, message: "Registration Number is required." }, { status: 400 });
    }
    if (String(registrationno).trim().length > 8) {
      return Response.json({ success: false, message: "Registration Number must be at most 8 characters." }, { status: 400 });
    }
    if (!registrationdate || isNaN(Date.parse(registrationdate))) {
      return Response.json({ success: false, message: "Registration Date must be a valid date." }, { status: 400 });
    }
    if (!expirationdate || isNaN(Date.parse(expirationdate))) {
      return Response.json({ success: false, message: "Expiration Date must be a valid date." }, { status: 400 });
    }
    
    //if expiration happens after registration
    if (new Date(expirationdate) <= new Date(registrationdate)) {
      return Response.json({ success: false, message: "Expiration Date must be after the Registration Date." }, { status: 400 });
    }

    if (!chassisno || String(chassisno).trim().length === 0) {
      return Response.json({ success: false, message: "Chassis Number is required." }, { status: 400 });
    }

    const validStatuses = ["active", "expired", "pending"];
    const statusToSave = registrationstatus ? registrationstatus.toLowerCase().trim() : "active";
    if (registrationstatus && !validStatuses.includes(statusToSave)) {
      return Response.json({ success: false, message: "Invalid status option. Use active, expired, or pending." }, { status: 400 });
    }

    //check if chassis exists
    const [vehicleRows] = await conn.query(
      "SELECT chassisno FROM VEHICLE WHERE chassisno = ?",
      [String(chassisno).trim()]
    );
    if (!vehicleRows || vehicleRows.length === 0) {
      return Response.json(
        { success: false, message: `Vehicle Chassis Number '${chassisno}' does not exist.` },
        { status: 400 }
      );
    }

    //check for duplicate primary key
    const [regRows] = await conn.query(
      "SELECT registrationno FROM VEHICLE_REGISTRATION WHERE registrationno = ?",
      [String(registrationno).trim()]
    );
    if (regRows && regRows.length > 0) {
      return Response.json(
        { success: false, message: `Registration Number '${registrationno}' already exists.` },
        { status: 400 }
      );
    }

    await conn.query(
      `INSERT INTO VEHICLE_REGISTRATION (registrationno, registrationdate, expirationdate, registrationstatus, chassisno)
       VALUES (?, ?, ?, ?, ?)`,
      [
        String(registrationno).trim(),
        registrationdate,
        expirationdate,
        statusToSave,
        String(chassisno).trim(),
      ]
    );

    return Response.json({ success: true, message: "Registration added successfully." });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to add registration.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}

//handles editing an existing registration record
export async function PUT(request) {
  let conn;

  try {
    conn = await pool.getConnection();
    const body = await request.json();

    const {
      registrationno,
      registrationdate,
      expirationdate,
      registrationstatus,
      chassisno,
    } = body;

    if (!registrationdate || isNaN(Date.parse(registrationdate))) {
      return Response.json({ success: false, message: "Registration Date must be a valid date." }, { status: 400 });
    }
    if (!expirationdate || isNaN(Date.parse(expirationdate))) {
      return Response.json({ success: false, message: "Expiration Date must be a valid date." }, { status: 400 });
    }
    
    if (new Date(expirationdate) <= new Date(registrationdate)) {
      return Response.json({ success: false, message: "Expiration Date must be after the Registration Date." }, { status: 400 });
    }

    if (!chassisno || String(chassisno).trim().length === 0) {
      return Response.json({ success: false, message: "Chassis Number is required." }, { status: 400 });
    }

    const validStatuses = ["active", "expired", "pending"];
    const statusToSave = registrationstatus ? registrationstatus.toLowerCase().trim() : "active";
    if (registrationstatus && !validStatuses.includes(statusToSave)) {
      return Response.json({ success: false, message: "Invalid status option." }, { status: 400 });
    }

    const [vehicleRows] = await conn.query(
      "SELECT chassisno FROM VEHICLE WHERE chassisno = ?",
      [String(chassisno).trim()]
    );
    if (!vehicleRows || vehicleRows.length === 0) {
      return Response.json(
        { success: false, message: `Vehicle Chassis Number '${chassisno}' does not exist.` },
        { status: 400 }
      );
    }

    await conn.query(
      `UPDATE VEHICLE_REGISTRATION 
       SET registrationdate=?, expirationdate=?, registrationstatus=?, chassisno=?
       WHERE registrationno=?`,
      [
        registrationdate,
        expirationdate,
        statusToSave,
        String(chassisno).trim(),
        String(registrationno).trim(),
      ]
    );

    return Response.json({ success: true, message: "Registration updated successfully." });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to update registration.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}

//handles deleting a registration record
export async function DELETE(request) {
  let conn;

  try {
    conn = await pool.getConnection();
    const body = await request.json();
    const { registrationno } = body;

    await conn.query(`DELETE FROM VEHICLE_REGISTRATION WHERE registrationno=?`, [registrationno]);

    return Response.json({ success: true, message: "Registration deleted successfully." });
  } catch (error) {
    const isForeignKey = error.message.includes("foreign key constraint");
    return Response.json(
      { 
        success: false, 
        message: isForeignKey 
          ? "Cannot delete this registration because of a foreign key dependency." 
          : "Failed to delete registration.", 
        error: error.message 
      },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}