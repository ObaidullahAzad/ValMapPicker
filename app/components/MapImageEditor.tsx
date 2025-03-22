"use client";

import { useState } from "react";
import { ValMap } from "../lib/types";
import { initialMaps } from "../lib/data/maps";

interface MapImageEditorProps {
  maps: ValMap[];
  updateMapImage: (mapId: string, newImageUrl: string) => void;
}

export default function MapImageEditor({
  maps,
  updateMapImage,
}: MapImageEditorProps) {
  const [editingMapId, setEditingMapId] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [showSampleURLs, setShowSampleURLs] = useState(false);

  // Sample Valorant map image URLs that should work immediately
  const sampleURLs = {
    ascent:
      "https://static.wikia.nocookie.net/valorant/images/0/04/Loading_Screen_Ascent.png",
    bind: "https://static.wikia.nocookie.net/valorant/images/0/07/Loading_Screen_Bind.png",
    haven:
      "https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png",
    split:
      "https://static.wikia.nocookie.net/valorant/images/d/d6/Loading_Screen_Split.png",
    icebox:
      "https://static.wikia.nocookie.net/valorant/images/0/04/Loading_Screen_Icebox.png",
    breeze:
      "https://static.wikia.nocookie.net/valorant/images/1/17/Loading_Screen_Breeze.png",
    fracture:
      "https://static.wikia.nocookie.net/valorant/images/f/fc/Loading_Screen_Fracture.png",
  };

  const handleEdit = (map: ValMap) => {
    setEditingMapId(map.id);
    setNewImageUrl(map.imageUrl);
  };

  const handleSave = () => {
    if (editingMapId && newImageUrl.trim()) {
      updateMapImage(editingMapId, newImageUrl.trim());
      setEditingMapId(null);
      setNewImageUrl("");
    }
  };

  const handleCancel = () => {
    setEditingMapId(null);
    setNewImageUrl("");
  };

  const handleResetToDefault = (mapId: string) => {
    const defaultMap = initialMaps.find((m) => m.id === mapId);
    if (defaultMap) {
      updateMapImage(mapId, defaultMap.imageUrl);
    }
  };

  const handleResetAll = () => {
    initialMaps.forEach((defaultMap) => {
      updateMapImage(defaultMap.id, defaultMap.imageUrl);
    });
  };

  const handleUseSampleURL = (mapId: string) => {
    if (sampleURLs[mapId as keyof typeof sampleURLs]) {
      updateMapImage(mapId, sampleURLs[mapId as keyof typeof sampleURLs]);
    }
  };

  const toggleSampleURLs = () => {
    setShowSampleURLs(!showSampleURLs);
  };

  const handleUseSampleForAll = () => {
    Object.entries(sampleURLs).forEach(([mapId, url]) => {
      updateMapImage(mapId, url);
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold mb-1 text-white">Edit Map Images</h2>
          <p className="text-gray-300 mb-4 text-sm">
            Specify the path to your custom map images here. You can use any
            image type and path.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleSampleURLs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            {showSampleURLs ? "Hide Samples" : "Show Sample URLs"}
          </button>
          <button
            onClick={handleUseSampleForAll}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Use Sample URLs
          </button>
          <button
            onClick={handleResetAll}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm"
          >
            Reset All to Default
          </button>
        </div>
      </div>

      {showSampleURLs && (
        <div className="mb-4 p-3 bg-gray-700 rounded-md">
          <p className="text-white text-sm mb-2 font-medium">
            Sample URLs (click to use all):
          </p>
          <div className="text-xs text-gray-300">
            <p>
              These are working Valorant map images from the Valorant Wiki that
              you can use right away.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-3 mb-4">
        {maps.map((map) => (
          <div
            key={map.id}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 rounded bg-gray-700"
          >
            <div className="font-medium text-white min-w-28">{map.name}</div>

            {editingMapId === map.id ? (
              <>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-2 py-1 rounded text-black w-full"
                  placeholder="Enter image path (e.g., /images/custom/map.png)"
                />
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 text-gray-300 text-sm truncate max-w-full">
                  {map.imageUrl}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(map)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  {sampleURLs[map.id as keyof typeof sampleURLs] && (
                    <button
                      onClick={() => handleUseSampleURL(map.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Use Sample
                    </button>
                  )}
                  <button
                    onClick={() => handleResetToDefault(map.id)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Reset
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-400">
        <p>💡 Tips:</p>
        <ul className="list-disc ml-5 mt-1">
          <li>
            Use absolute URLs for external images
            (https://example.com/image.jpg)
          </li>
          <li>Use relative paths for local images (/images/maps/custom.png)</li>
          <li>Supported formats: JPG, PNG, GIF, WebP, SVG, etc.</li>
          <li className="text-green-400">
            Click "Use Sample URLs" to immediately use working Valorant map
            images
          </li>
        </ul>
      </div>
    </div>
  );
}
