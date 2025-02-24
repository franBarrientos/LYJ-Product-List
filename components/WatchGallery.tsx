import Image from "next/image";

type WatchGalleryProps = {
  images: string[];
  name: string;
  onImageClick: () => void;
};

export function WatchGallery({
  images,
  name,
  onImageClick,
}: WatchGalleryProps) {
  return (
    <div className="relative h-64 cursor-pointer" onClick={onImageClick}>
      <Image
        src={images[0] || "/placeholder.svg"}
        alt={name}
        fill
        className="object-contain"
      />
    </div>
  );
}
