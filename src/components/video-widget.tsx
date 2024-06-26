"use client";

import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";

interface IVideoWidgetProps {
  title: string;
  thumbnail: string;
}

export const VideoWidget = ({ thumbnail, title }: IVideoWidgetProps) => {
  return (
    <div className="w-full rounded-lg">
      <AspectRatio
        suppressHydrationWarning
        ratio={16 / 9}
        className="relative rounded-lg"
      >
        <Image
          src={thumbnail}
          alt={title}
          className="rounded-lg object-cover"
          fill
        />

        <div
          className="absolute bottom-0 w-full rounded-b-md bg-background/50
        px-4 py-3 backdrop-blur-xl"
        >
          <p className="text-xs md:text-base">{title}</p>
        </div>
      </AspectRatio>
    </div>
  );
};
