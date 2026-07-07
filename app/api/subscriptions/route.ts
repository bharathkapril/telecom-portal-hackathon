import { NextResponse } from "next/server";
import { z } from "zod";
import { updateUserPlan } from "@/services/subscriptionService";
import logger from "@/utils/logger"; // Assume you have a Winston or Pino logger set up
// import getAuth from "@/lib/auth"; // Your actual auth provider (e.g., NextAuth, Clerk, Supabase)

// --- 1. Input Validation Schema ---
const planChangeSchema = z.object({
  requestedUserId: z.string().uuid("Invalid User ID format"),
  newPlanId: z.string().uuid("Invalid Plan ID format"),
  planName: z
    .string()
    .min(1, "Plan name cannot be empty")
    .max(100, "Plan name too long"),
});

// --- Mock Auth (Replace with your actual auth logic) ---
async function getAuth(req: Request) {
  // Simulating an authenticated user session WITH YOUR REAL UUID
  return { userId: "05a4de82-5567-49f0-aca2-984f027c8041" };
}

// --- 2. API Route Handler ---
export async function POST(request: Request) {
  try {
    // 1. Parse and Validate Input
    const body = await request.json();
    const validatedData = planChangeSchema.parse(body);
    const { requestedUserId, newPlanId, planName } = validatedData;

    // 2. Authorization (CRITICAL Security Fix)
    const auth = await getAuth(request);

    if (!auth || !auth.userId) {
      logger.warn("Unauthorized API access attempt", { path: request.url });
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (requestedUserId !== auth.userId) {
      logger.warn("Forbidden plan update attempt: user mismatch", {
        requestedUserId,
        authUserId: auth.userId,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Cannot update another user's plan",
        },
        { status: 403 },
      );
    }

    // 3. Execute Business Logic (using the verified auth ID, not the body ID)
    const actualUserIdForDb = auth.userId;
    await updateUserPlan(actualUserIdForDb, newPlanId, planName);

    // 4. Return Success
    return NextResponse.json({
      success: true,
      message: "Plan updated successfully",
    });
  } catch (error: any) {
    // 5. Differentiated Error Handling
    if (error instanceof z.ZodError) {
      logger.info("Input validation failed for plan change", {
        details: error.flatten().fieldErrors,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Validation Failed",
          details: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Catch-all for database or unexpected server errors
    logger.error("Unhandled server error during plan change", {
      error: error.message,
      stack: error.stack,
      path: request.url,
    });

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred. Please try again later.",
      },
      { status: 500 },
    );
  }
}
