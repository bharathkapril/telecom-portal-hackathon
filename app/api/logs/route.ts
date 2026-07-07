import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const client = await pool.connect();

    // Join users table to get readable usernames instead of just UUIDs
    const query = `
      SELECT 
        a.id, 
        u.username AS customer_id, 
        a.action_taken AS action, 
        TO_CHAR(a.created_at, 'YYYY-MM-DD HH12:MI AM') as date
      FROM audit_logs a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `;

    const result = await client.query(query);
    client.release();

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit logs" },
      { status: 500 },
    );
  }
}
