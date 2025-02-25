"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function SearchParamsHandler() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get("status");
    const paymentId = searchParams.get("payment_id");

    if (status) {
      let message = "";
      console.log("status", status);
      if (status === "approved") {
        message = `✅ ¡Pago exitoso!\nID de pago: ${paymentId}`;
      } else if (status === "pending") {
        message =
          "⏳ Tu pago está en proceso, te notificaremos cuando se confirme.";
      } else if (status === "failure") {
        message = "❌ El pago fue rechazado. Inténtalo nuevamente.";
      }

      toast.success(message, {
        duration: 12000,
        icon: status === "approved" ? "💳" : "⚠️",
        style: {
          border: `1px solid ${status === "approved" ? "green" : "red"}`,
          padding: "16px",
          color: "#333",
          backgroundColor: "#fff",
        },
      });

      // Eliminamos los parámetros de la URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("status");
      params.delete("payment_id");

      const newUrl = `${pathname}${
        params.toString() ? "?" + params.toString() : ""
      }`;

      router.replace(newUrl);
    }
  }, [searchParams, pathname, router]);

  return null; // No renderiza nada
}
