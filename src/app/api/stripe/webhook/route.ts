import { NextResponse } from "next/server";
import { getStripe, CREDITS_PER_PLAN } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const customerId = session.customer as string;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan || "starter";

        if (userId) {
          const credits = CREDITS_PER_PLAN[plan as keyof typeof CREDITS_PER_PLAN] ?? 100;
          await db
            .update(users)
            .set({
              stripeCustomerId: customerId,
              plan: plan as any,
              creditsRemaining: credits,
            })
            .where(eq(users.id, userId));
          console.log(`✅ User ${userId} upgraded to ${plan} (${credits} credits)`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0]?.price.id;

        const plan =
          priceId === process.env.STRIPE_PRICE_PRO
            ? "pro"
            : priceId === process.env.STRIPE_PRICE_BUSINESS
              ? "business"
              : "starter";

        const credits = CREDITS_PER_PLAN[plan];

        await db
          .update(users)
          .set({
            plan: plan as any,
            creditsRemaining: credits,
            monthlyCreditsUsed: 0,
          })
          .where(eq(users.stripeCustomerId, customerId));
        console.log(`📦 Subscription updated: ${customerId} → ${plan}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        await db
          .update(users)
          .set({
            plan: "free",
            creditsRemaining: 10,
          })
          .where(eq(users.stripeCustomerId, customerId));
        console.log(`❌ Subscription cancelled: ${customerId}`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
