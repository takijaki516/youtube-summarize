"use client";

import Image from "next/image";

import { AspectRatio } from "./ui/aspect-ratio";

export const Embed = ({ thumbnail }: { thumbnail: string }) => {
  return (
    <div className="w-full">
      <AspectRatio ratio={16 / 9}>
        <Image
          src={thumbnail}
          alt="thumbnail"
          fill
          className="rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  );
};
