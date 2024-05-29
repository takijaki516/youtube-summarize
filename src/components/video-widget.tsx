"use client";

import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";

interface IVideoWidgetProps {
  title: string;
  thumbnail: string;
}

export const VideoWidget = ({ thumbnail, title }: IVideoWidgetProps) => {
  return (
    <div>
      <AspectRatio>
        <Image
          src={thumbnail}
          alt={title}
          className="rounded-lg object-cover"
          fill
        />

        <div>
          <p>{title}</p>
        </div>
      </AspectRatio>
    </div>
  );
};
