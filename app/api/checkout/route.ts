import { NextResponse } from "next/server";
import axios from "axios";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    // Obtiene el JSON del request
    const { cart } = await req.json();

    // Estructura los productos para Mercado Pago
    const items = cart.map((item: any) => ({
      title: item.name,
      description: item.brand,
      quantity: item.quantity,
      currency_id: "ARS",
      unit_price: item.price,
    }));

    console.log("Items:", items);

    // Configura la preferencia de pago
    const preference = {
      items,
      back_urls: {
        success: `${siteUrl}/?status=approved?payment_id={payment_id}`,
        failure: `${siteUrl}/?status=failure?payment_id={payment_id}`,
        pending: `${siteUrl}/?status=pending?payment_id={payment_id}`,
      },
      auto_return: "approved",
    };

    // Solicitud a Mercado Pago
    const response = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      preference,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer TEST-7543953640008760-071220-1f082d2944adf937e2bf4635730bfe8a-1216931427`, // Reemplaza con tu Access Token
        },
      }
    );

    // Devuelve la URL de pago
    return NextResponse.json(
      { url: response.data.init_point },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en Mercado Pago:", error);
    return NextResponse.json(
      { message: "Error en Mercado Pago", error },
      { status: 500 }
    );
  }
}
