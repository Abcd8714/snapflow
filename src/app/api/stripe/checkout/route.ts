import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await request.json();
  const priceMap: Record<string, string> = {
    starter: process.env.STRIPE_PRICE_STARTER || "",
    pro: process.env.STRIPE_PRICE_PRO || "",
    business: process.env.STRIPE_PRICE_BUSINESS || "",
  };

  const priceId = priceMap[plan];
  if (!priceId) {
    return NextResponse.json({ error: `Invalid plan: ${plan}` }, { status: 400 });
  }

  const stripe = getStripe();
  const user = session.user as any;

  // Create or get customer
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: plan === "business" ? "subscription" : "subscription",
    success_url: `${request.headers.get("origin") || process.env.BETTER_AUTH_URL}/dashboard?checkout=success`,
    cancel_url: `${request.headers.get("origin") || process.env.BETTER_AUTH_URL}/generate?checkout=cancelled`,
    metadata: {
      userId: user.id,
      plan: plan,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
