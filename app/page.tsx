"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "./providers";
import { WatchGallery } from "@/components/WatchGallery";
import { WatchDetails } from "@/components/WatchDetails";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const PRECIOS_URL =
  "https://raw.githubusercontent.com/franBarrientos/JSON_PRICES/refs/heads/main/prices.json";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [watches, setWatches] = useState<
    {
      id: number;
      name: string;
      brand: string;
      price: number;
      images: string[];
      features: string[];
    }[]
  >([]);

  useEffect(() => {
    fetch(PRECIOS_URL)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setWatches(data);
      })
      .catch((err) => console.error("Error al cargar precios", err))
      .finally(() => console.log("Precios cargados"));
  }, []);

  const brands = [...new Set(watches.map((watch) => watch.brand))];

  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const { state, dispatch } = useCart();
  const [selectedWatch, setSelectedWatch] = useState<
    (typeof watches)[0] | null
  >(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get("status");
    const paymentId = searchParams.get("payment_id");

    if (status) {
      let message = "";

      if (status === "approved") {
        message = `✅ ¡Pago exitoso!\nID de pago: ${paymentId}`;
      } else if (status === "pending") {
        message =
          "⏳ Tu pago está en proceso, te notificaremos cuando se confirme.";
      } else if (status === "failure") {
        message = "❌ El pago fue rechazado. Inténtalo nuevamente.";
      }

      toast.success(message, {
        duration: 6000, // Muestra la alerta por más tiempo
        icon: status === "approved" ? "💳" : "⚠️",
        style: {
          border: `1px solid ${status === "approved" ? "green" : "red"}`,
          padding: "16px",
          color: "#333",
          backgroundColor: "#fff",
        },
      });

      const params = new URLSearchParams(searchParams.toString());
      params.delete("status");
      params.delete("payment_id");

      const newUrl = `${pathname}${
        params.toString() ? "?" + params.toString() : ""
      }`;

      router.replace(newUrl);
    }
  }, [searchParams, pathname, router]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/checkout", {
        cart: state.items,
      });
      window.location.href = response.data.url; // Redirige a Mercado Pago
      console.log(response);
    } catch (error) {
      console.error("Error al crear la preferencia de pago:", error);
      alert("Hubo un error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  const filteredWatches = watches
    .filter((watch) => selectedBrand === "all" || watch.brand === selectedBrand)
    .sort((a, b) => b.price - a.price);

  const addToCart = (watch: (typeof watches)[0]) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: watch.id,
        name: watch.name,
        price: watch.price,
        brand: watch.brand,
        quantity: 1,
      },
    });
    toast.success(`${watch.name} agregado al carrito`);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster position="bottom-center" />
      <header className="bg-black text-white p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              src="logo-lyj.png"
              alt="LYJ Joyas Logo"
              width={80}
              height={80}
              className="w-auto h-14"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-10 w-10 text-black" />
                {state.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {state.items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Carrito de Compras</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                {state.items.length === 0 ? (
                  <p>Tu carrito está vacío</p>
                ) : (
                  <div className="space-y-4">
                    {state.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            ARS ${item.price.toLocaleString("es-AR")} x{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            dispatch({ type: "REMOVE_ITEM", payload: item.id })
                          }
                        >
                          Eliminar
                        </Button>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <p className="font-bold">
                        Total: ARS ${state.total.toLocaleString("es-AR")}
                      </p>
                    </div>
                    {/* <Button className="w-full">Finalizar Compra</Button> */}
                    <Button
                      className="w-full flex items-center justify-center"
                      onClick={handleCheckout}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />{" "}
                          Procesando...
                        </>
                      ) : (
                        "Finalizar Compra"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Filtrar por Marca</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedBrand === "all" ? "default" : "outline"}
              onClick={() => setSelectedBrand("all")}
            >
              Todas las Marcas
            </Button>
            {brands.map((brand) => (
              <Button
                key={brand}
                variant={selectedBrand === brand ? "default" : "outline"}
                onClick={() => setSelectedBrand(brand)}
              >
                {brand}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWatches.map((watch) => (
            <div
              key={watch.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <WatchGallery
                images={watch.images}
                name={watch.name}
                onImageClick={() => setSelectedWatch(watch)}
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{watch.name}</h3>
                <p className="text-gray-600">{watch.brand}</p>
                <p className="text-xl font-bold mt-2">
                  ARS ${watch.price.toLocaleString("es-AR")}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1" onClick={() => addToCart(watch)}>
                    Agregar al Carrito
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedWatch(watch)}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedWatch && (
        <WatchDetails
          watch={selectedWatch}
          isOpen={!!selectedWatch}
          onClose={() => setSelectedWatch(null)}
          onAddToCart={() => {
            addToCart(selectedWatch);
            setSelectedWatch(null);
          }}
        />
      )}
    </main>
  );
}
