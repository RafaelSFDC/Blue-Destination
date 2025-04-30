import { NextRequest, NextResponse } from "next/server";
import { handleStripeWebhook } from "@/actions/payment";

export async function POST(req: NextRequest) {
  try {
    // Obter o corpo da requisição como texto
    const payload = await req.text();
    
    // Obter o cabeçalho de assinatura do Stripe
    const signature = req.headers.get("stripe-signature") || "";
    
    // Processar o webhook
    await handleStripeWebhook(payload, signature);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 400 }
    );
  }
}
