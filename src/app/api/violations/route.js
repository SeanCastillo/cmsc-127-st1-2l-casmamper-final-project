import pool from "@/lib/db";

// handles retrieving traffic violation records with driver and vehicle details
export async function GET() {
  let conn;

  try {
    conn = await pool.getConnection();

    const rows = await conn.query(`
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
      FROM TRAFFIC_VIOLATION tv
      JOIN DRIVER d ON tv.driverno = d.driverno
      JOIN VEHICLE v ON tv.chassisno = v.chassisno
      ORDER BY tv.violationdate DESC
    `);

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch violations.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}

//handles adding a new violation record
export async function POST(request) {
  let conn;

  try {
    conn = await pool.getConnection();
    const body = await request.json();

    const {
      violationno,
      violationtype,
      violationdate,
      violationloc,
      fineamount,
      appofficer,
      violationstatus,
      driverno,
      chassisno,
    } = body;

    //proper data validators
    if (!violationno || String(violationno).trim() === "") {
      return Response.json({ success: false, message: "Violation Number must be valid text." }, { status: 400 });
    }
    
    if (!violationtype || String(violationtype).trim() === "" || !isNaN(violationtype)) {
      return Response.json({ success: false, message: "Violation Type must be valid text." }, { status: 400 });
    }
    if (!violationdate || isNaN(Date.parse(violationdate))) {
      return Response.json({ success: false, message: "Violation Date must be a valid date format (YYYY-MM-DD)." }, { status: 400 });
    }

    const parsedFine = parseFloat(fineamount);
    if (fineamount === undefined || fineamount === "" || isNaN(parsedFine) || parsedFine < 0) {
      return Response.json({ success: false, message: "Fine Amount must be a valid positive number." }, { status: 400 });
    }

    if (appofficer && (!isNaN(appofficer) || String(appofficer).trim() === "")) {
      return Response.json({ success: false, message: "Approving Officer must be text." }, { status: 400 });
    }
    if (violationloc && String(violationloc).trim() === "") {
      return Response.json({ success: false, message: "Violation Location must be text." }, { status: 400 });
    }
    if (!driverno || String(driverno).trim() === "") {
      return Response.json({ success: false, message: "Driver Number cannot be blank." }, { status: 400 });
    }
    if (!chassisno || String(chassisno).trim() === "") {
      return Response.json({ success: false, message: "Vehicle Chassis Number cannot be blank." }, { status: 400 });
    }

    //validate Status against your predefined options
    const validStatuses = ["pending", "paid", "unpaid", "dismissed"];
    const statusToSave = violationstatus ? violationstatus.toLowerCase().trim() : "pending";
    if (violationstatus && !validStatuses.includes(statusToSave)) {
      return Response.json({ success: false, message: "Invalid status option provided." }, { status: 400 });
    }

    //first check if driver actually exists
    const [driverRows] = await conn.query(
      "SELECT driverno FROM DRIVER WHERE driverno = ?", 
      [String(driverno).trim()]
    );
    if (!driverRows || driverRows.length === 0) {
      return Response.json(
        { success: false, message: `Driver Number '${driverno}' does not exist.` },
        { status: 400 } 
      );
    }

    //then vehicle
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

    //then avoid duplicate primary keys
    const [violationRows] = await conn.query(
      "SELECT violationno FROM traffic_violation WHERE violationno = ?", 
      [String(violationno).trim()]
    );
    if (violationRows && violationRows.length > 0) {
      return Response.json(
        { success: false, message: `Violation Number '${violationno}' already exists.` },
        { status: 400 }
      );
    }

    //then insert
    await conn.query(
      `INSERT INTO traffic_violation (violationno, violationtype, violationdate, violationloc, fineamount, appofficer, violationstatus, driverno, chassisno)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(violationno).trim(),
        String(violationtype).trim(),
        violationdate,
        violationloc ? String(violationloc).trim() : null,
        parsedFine,
        appofficer ? String(appofficer).trim() : null,
        statusToSave,
        String(driverno).trim(),
        String(chassisno).trim(),
      ]
    );

    return Response.json({ success: true, message: "Violation added successfully." });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to add violation.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}

//handles editing an existing violation record
export async function PUT(request) {
  let conn;

  try {
    conn = await pool.getConnection();
    const body = await request.json();

    const {
      violationno,
      violationtype,
      violationdate,
      violationloc,
      fineamount,
      appofficer,
      violationstatus,
      driverno,
      chassisno,
    } = body;

    if (!violationtype || String(violationtype).trim() === "" || !isNaN(violationtype)) {
      return Response.json({ success: false, message: "Violation Type must be valid text." }, { status: 400 });
    }
    if (!violationdate || isNaN(Date.parse(violationdate))) {
      return Response.json({ success: false, message: "Violation Date must be valid." }, { status: 400 });
    }

    const parsedFine = parseFloat(fineamount);
    if (fineamount === undefined || fineamount === "" || isNaN(parsedFine) || parsedFine < 0) {
      return Response.json({ success: false, message: "Fine Amount must be a positive number." }, { status: 400 });
    }
    if (!driverno || String(driverno).trim() === "") {
      return Response.json({ success: false, message: "Driver Number cannot be blank." }, { status: 400 });
    }
    if (!chassisno || String(chassisno).trim() === "") {
      return Response.json({ success: false, message: "Vehicle Chassis Number cannot be blank." }, { status: 400 });
    }

    const [driverRows] = await conn.query("SELECT driverno FROM DRIVER WHERE driverno = ?", [String(driverno).trim()]);
    if (!driverRows || driverRows.length === 0) {
      return Response.json({ success: false, message: `Driver Number '${driverno}' does not exist.` }, { status: 400 });
    }

    const [vehicleRows] = await conn.query("SELECT chassisno FROM VEHICLE WHERE chassisno = ?", [String(chassisno).trim()]);
    if (!vehicleRows || vehicleRows.length === 0) {
      return Response.json({ success: false, message: `Vehicle Chassis '${chassisno}' does not exist.` }, { status: 400 });
    }

    const validStatuses = ["pending", "paid", "unpaid", "dismissed"];
    const statusToSave = violationstatus ? violationstatus.toLowerCase().trim() : "pending";
    if (violationstatus && !validStatuses.includes(statusToSave)) {
      return Response.json({ success: false, message: "Invalid status option provided." }, { status: 400 });
    }

    await conn.query(
      `UPDATE traffic_violation 
       SET violationtype=?, violationdate=?, violationloc=?, fineamount=?, appofficer=?, violationstatus=?, driverno=?, chassisno=?
       WHERE violationno=?`,
      [
        String(violationtype).trim(),
        violationdate,
        violationloc ? String(violationloc).trim() : null,
        parsedFine,
        appofficer ? String(appofficer).trim() : null,
        statusToSave,
        String(driverno).trim(),
        String(chassisno).trim(),
        String(violationno).trim(),
      ]
    );

    return Response.json({ success: true, message: "Violation updated successfully." });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to update violation.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}

//handles deleting a violation record
export async function DELETE(request) {
  let conn;

  try {
    conn = await pool.getConnection();
    const body = await request.json();
    const { violationno } = body;

    await conn.query(`DELETE FROM traffic_violation WHERE violationno=?`, [violationno]);

    return Response.json({ success: true, message: "Violation deleted successfully." });
  } catch (error) {
    const isForeignKey = error.message.includes("foreign key constraint");
    return Response.json(
      {
        success: false,
        message: isForeignKey
          ? "Cannot delete this violation because of a foreign key dependency."
          : "Failed to delete violation.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}