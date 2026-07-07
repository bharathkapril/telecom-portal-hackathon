import { NextResponse } from "next/server";
import pool from "@/lib/db";

// READ (GET)
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM plans ORDER BY price ASC");
    client.release();
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch plans" },
      { status: 500 },
    );
  }
}

// CREATE (POST)
export async function POST(request: Request) {
  try {
    const { name, price, dataLimit } = await request.json();
    const client = await pool.connect();
    await client.query(
      "INSERT INTO plans (plan_name, price, data_limit_gb) VALUES ($1, $2, $3)",
      [name, price, dataLimit],
    );
    client.release();
    return NextResponse.json({ success: true, message: "Plan created!" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create plan" },
      { status: 500 },
    );
  }
}

// UPDATE (PUT)
export async function PUT(request: Request) {
  try {
    const { id, name, price, dataLimit } = await request.json();
    const client = await pool.connect();
    await client.query(
      "UPDATE plans SET plan_name = $1, price = $2, data_limit_gb = $3 WHERE id = $4",
      [name, price, dataLimit, id],
    );
    client.release();
    return NextResponse.json({ success: true, message: "Plan updated!" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update plan" },
      { status: 500 },
    );
  }
}

// DELETE
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const client = await pool.connect();
    await client.query("DELETE FROM plans WHERE id = $1", [id]);
    client.release();
    return NextResponse.json({ success: true, message: "Plan deleted!" });
  } catch (error: any) {
    // If a plan is tied to an active subscription, the database will block deletion.
    if (error.code === "23503") {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete a plan that customers are currently using.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to delete plan" },
      { status: 500 },
    );
  }
}
