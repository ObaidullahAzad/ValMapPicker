"use client";

import Image from "next/image";
import { ValMap } from "../lib/types";
import { useState } from "react";

interface MapCardProps {
  map: ValMap;
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean;
  selectionType?: "teamA" | "teamB";
}

export default function MapCard({
  map,
  onClick,
  disabled = false,
  isSelected = false,
  selectionType,
}: MapCardProps) {
  const [imageError, setImageError] = useState(false);

  const cardClass = `
    relative rounded-lg overflow-hidden border-3 hover:shadow-[0_20px_50px_rgba(255,70,84,0.7)] transition-all
    ${map.status === "banned" ? "border-red-500 opacity-50" : ""}
    ${
      map.status === "selected"
        ? "border-green-500 ring-2 ring-green-400"
        : "border-gray-700"
    }
    ${
      isSelected && (selectionType === "teamA" || selectionType === "teamB")
        ? "border-blue-500 ring-4 ring-blue-400 shadow-lg shadow-blue-500/50"
        : ""
    }
    ${
      disabled
        ? "cursor-not-allowed opacity-60"
        : "cursor-pointer hover:border-blue-400"
    }
    ${onClick && !disabled ? "hover:scale-105" : ""}
  `;

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
    <div className={cardClass} onClick={disabled ? undefined : onClick}>
      <div className="relative w-full h-40  ">
        {imageError ? (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            <div className="text-center px-2 py-3 bg-black bg-opacity-60 rounded">
              <p className="text-white font-medium mb-1">{map.name}</p>
              <p className="text-xs text-gray-300">Image not found</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full ">
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
              // For internal images, use Next.js Image component with unoptimized for better compatibility
              <Image
                src={map.imageUrl}
                alt={map.name}
                fill
                unoptimized
                className="object-cover"
                onError={() => setImageError(true)}
              />
            )}
          </div>
        )}
      </div>

      {/* Status indicators */}
      <div className="absolute inset-0">
        {map.status === "banned" && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-red-500 p-1 px-4 rounded-full text-white font-bold text-lg transform rotate-12">
              BANNED
            </div>
            <div className="absolute inset-0 border-4 border-red-500 opacity-70"></div>
          </div>
        )}

        {map.status === "selected" && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-green-500 p-1 px-4 rounded-full text-white font-bold text-lg">
              SELECTED
            </div>
            <div className="absolute inset-0 border-4 border-green-500 opacity-70"></div>
          </div>
        )}

        {isSelected && selectionType === "teamA" && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-blue-500 p-1 px-4 rounded-full text-white font-bold">
              TEAM A PICK
            </div>
            <div className="absolute inset-0 border-4 border-blue-500 opacity-70 pulse-blue"></div>
          </div>
        )}

        {isSelected && selectionType === "teamB" && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-blue-500 p-1 px-4 rounded-full text-white font-bold">
              TEAM B PICK
            </div>
            <div className="absolute inset-0 border-4 border-blue-500 opacity-70 pulse-blue"></div>
          </div>
        )}
      </div>
    </div>
  );
}
