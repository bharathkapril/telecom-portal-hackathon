import pool from "@/lib/db";
import { SubscriptionStatus } from "@/constants/subscription";
import logger from "@/utils/logger";

export async function updateUserPlan(
  userId: string,
  newPlanId: string,
  planName: string,
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Deactivate current active subscriptions
    await client.query(
      "UPDATE subscriptions SET status = $1 WHERE user_id = $2 AND status = $3",
      [SubscriptionStatus.INACTIVE, userId, SubscriptionStatus.ACTIVE],
    );

    // 2. Insert the new active subscription
    await client.query(
      "INSERT INTO subscriptions (user_id, plan_id, status) VALUES ($1, $2, $3)",
      [userId, newPlanId, SubscriptionStatus.ACTIVE],
    );

    // 3. Log the audit action
    const actionMessage = `Upgraded/Downgraded to ${planName}`;
    await client.query(
      "INSERT INTO audit_logs (user_id, action_taken) VALUES ($1, $2)",
      [userId, actionMessage],
    );

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    // Throw error up to the controller to handle the HTTP response
    throw error;
  } finally {
    client.release();
  }
}
