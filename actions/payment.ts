"use server";

import { ID } from "appwrite";
import Stripe from "stripe";
import { createSessionClient, COLLECTIONS } from "@/lib/appwrite";
import { getCurrentUser } from "./auth";
import { getBookingById } from "./bookings";

// Inicializar o Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

/**
 * Cria uma sessão de checkout do Stripe
 */
export async function createStripeCheckoutSession(bookingId: string) {
  try {
    const client = await createSessionClient();
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Obter informações da reserva
    const booking = await getBookingById(bookingId);
    if (!booking) {
      throw new Error("Reserva não encontrada");
    }
    
    // Verificar se a reserva já foi paga
    if (booking.paymentStatus === "paid") {
      throw new Error("Esta reserva já foi paga");
    }
    
    // Criar sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Reserva #${booking.$id} - ${booking.packages.name}`,
              description: `${booking.packages.name} para ${booking.travelers} viajante(s)`,
              images: [booking.packages.imageUrl],
            },
            unit_amount: Math.round(booking.totalPrice * 100), // Stripe trabalha com centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings/${booking.$id}?payment_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings/${booking.$id}?payment_cancelled=true`,
      customer_email: user.email,
      client_reference_id: booking.$id,
      metadata: {
        bookingId: booking.$id,
        userId: user.$id,
      },
    });
    
    // Atualizar a reserva com o ID da sessão do Stripe
    await client.databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.BOOKINGS,
      booking.$id,
      {
        stripeSessionId: session.id,
        updatedAt: new Date().toISOString(),
      }
    );
    
    // Criar registro de pagamento
    await client.databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      COLLECTIONS.PAYMENTS,
      ID.unique(),
      {
        booking: booking.$id,
        user: user.$id,
        amount: booking.totalPrice,
        currency: "BRL",
        status: "pending",
        provider: "stripe",
        providerPaymentId: session.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
    
    return { success: true, url: session.url };
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    throw new Error("Erro ao processar pagamento. Tente novamente.");
  }
}

/**
 * Processa o webhook do Stripe para atualizar o status do pagamento
 */
export async function handleStripeWebhook(payload: any, signature: string) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    const client = await createSessionClient();
    
    // Processar eventos do Stripe
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.client_reference_id;
        
        if (!bookingId) {
          throw new Error("ID da reserva não encontrado");
        }
        
        // Atualizar status da reserva
        await client.databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          COLLECTIONS.BOOKINGS,
          bookingId,
          {
            paymentStatus: "paid",
            status: "confirmed",
            updatedAt: new Date().toISOString(),
          }
        );
        
        // Atualizar registro de pagamento
        const payments = await client.databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          COLLECTIONS.PAYMENTS,
          [
            { key: "booking", value: bookingId },
            { key: "providerPaymentId", value: session.id },
          ]
        );
        
        if (payments.documents.length > 0) {
          await client.databases.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            COLLECTIONS.PAYMENTS,
            payments.documents[0].$id,
            {
              status: "paid",
              updatedAt: new Date().toISOString(),
            }
          );
        }
        
        break;
        
      case "checkout.session.expired":
        // Lógica para sessão expirada
        break;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    throw new Error("Erro ao processar webhook do Stripe");
  }
}

/**
 * Verifica o status do pagamento
 */
export async function checkPaymentStatus(bookingId: string) {
  try {
    const client = await createSessionClient();
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Obter informações da reserva
    const booking = await getBookingById(bookingId);
    if (!booking) {
      throw new Error("Reserva não encontrada");
    }
    
    // Verificar se a reserva tem uma sessão do Stripe
    if (!booking.stripeSessionId) {
      return { status: "not_started" };
    }
    
    // Verificar o status da sessão no Stripe
    const session = await stripe.checkout.sessions.retrieve(booking.stripeSessionId);
    
    return { 
      status: session.payment_status,
      url: session.url
    };
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw new Error("Erro ao verificar status do pagamento");
  }
}
