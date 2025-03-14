import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ArrowLeft } from "lucide-react";

type WatchDetailsProps = {
  watch: {
    id: number;
    name: string;
    brand: string;
    price: number;
    images: string[];
    features: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
};

export function WatchDetails({
  watch,
  isOpen,
  onClose,
  onAddToCart,
}: WatchDetailsProps) {
  const handleCopyUrl = () => {
    // You can adjust the URL construction as needed.
    const baseUrl = window.location.href.split("?")[0]; // get base url without query
    const urlWithId = `${baseUrl}?id=${watch.id}`;
    navigator.clipboard
      .writeText(urlWithId)
      .then(() => {
        console.log("URL copied to clipboard:", urlWithId);
      })
      .catch((error) => {
        console.error("Failed to copy URL: ", error);
      });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm md:max-w-2xl w-[90%] sm:w-auto max-h-[90vh] overflow-y-auto rounded-sm">
        <DialogHeader>
          <DialogTitle>{watch.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 md:h-80">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              loop={true}
              className="h-full"
            >
              {watch.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="relative h-full w-full">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${watch.name} - Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div>
            <p className="text-lg font-semibold">{watch.brand}</p>
            <p className="text-2xl font-bold">
              ARS ${watch.price.toLocaleString("es-AR")}
            </p>
            <div className="mt-2 flex flex-col">
              <h4 className="font-semibold mb-1">Características:</h4>
              <div className="max-h-32 overflow-y-auto pr-2">
                <ul className="list-disc list-inside">
                  {watch.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-6">
              <Button className="w-full mt-6" onClick={onAddToCart}>
                Agregar al Carrito
              </Button>
              <div className="flex gap-2">
                <Button className="w-1/3" onClick={onClose}>
                  <ArrowLeft size={16} />
                  Atrás
                </Button>
                <Button className="w-2/3" onClick={handleCopyUrl}>
                  Copiar Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
