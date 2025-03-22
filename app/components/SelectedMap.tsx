"use client";

import Image from "next/image";
import { ValMap } from "../lib/types";
import { useState } from "react";

interface SelectedMapProps {
  map: ValMap | null;
}

export default function SelectedMap({ map }: SelectedMapProps) {
  const [imageError, setImageError] = useState(false);

  if (!map) return null;

  // Check if the URL is external (starts with http or https)
  const isExternalImage = map.imageUrl.startsWith("http");

  // Generate random background color based on map name for placeholder
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const getColor = (str: string) => {
    const hash = hashCode(str);
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 80%, 25%)`;
  };

  const bgColor = getColor(map.name);

  return (
    <div className="mt-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Selected Map</h2>
      <div className="max-w-md mx-auto">
        <div className="bg-slate-500 p-6 rounded-lg shadow-lg">
          <div className="relative w-full h-60 mb-4">
            {imageError ? (
              <div
                className="w-full h-full flex items-center justify-center rounded-md"
                style={{ backgroundColor: bgColor }}
              >
                <div className="text-center px-4 py-4 bg-black bg-opacity-60 rounded">
                  <p className="text-white font-bold text-xl mb-2">
                    {map.name}
                  </p>
                  <p className="text-sm text-gray-300">Map selected</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full rounded-md overflow-hidden">
                {isExternalImage ? (
                  // For external images, use a regular img tag
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={map.imageUrl}
                    alt={map.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  // For internal images, use Next.js Image component with unoptimized
                  <Image
                    src={map.imageUrl}
                    alt={map.name}
                    fill
                    unoptimized
                    className="object-cover rounded-md"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            )}
          </div>
          <h3 className="text-3xl font-bold text-white">{map.name}</h3>
        </div>
      </div>
    </div>
  );
}
