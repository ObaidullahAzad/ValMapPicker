"use client";

import { useState, useEffect } from "react";
import { GameState, ValMap } from "../lib/types";
import { initialMaps } from "../lib/data/maps";
import MapGrid from "./MapGrid";
import TeamIndicator from "./TeamIndicator";
import SelectedMap from "./SelectedMap";
import ControlPanel from "./ControlPanel";
import MapImageEditor from "./MapImageEditor";

const SAVED_MAP_IMAGES_KEY = "valorant-map-picker-custom-images";

export default function MapPicker() {
  const [gameState, setGameState] = useState<GameState>({
    currentTeam: "A",
    phase: "banPhaseA",
    maps: initialMaps,
    bannedMaps: [],
    teamAPick: null,
    teamBPick: null,
    selectedMap: null,
  });

  const [showInstructions, setShowInstructions] = useState(true);
  const [showImageEditor, setShowImageEditor] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedImagePaths = localStorage.getItem(SAVED_MAP_IMAGES_KEY);
        if (savedImagePaths) {
          const imagePaths = JSON.parse(savedImagePaths);

          setGameState((prevState) => ({
            ...prevState,
            maps: prevState.maps.map((map) => {
              const savedPath = imagePaths[map.id];
              return savedPath ? { ...map, imageUrl: savedPath } : map;
            }),
          }));
        }
      } catch (error) {
        console.error("Error loading saved image paths:", error);
      }
    }
  }, []);

  const resetGame = () => {
    setGameState({
      currentTeam: "A",
      phase: "banPhaseA",
      maps: initialMaps.map((map) => ({ ...map, status: "available" })),
      bannedMaps: [],
      teamAPick: null,
      teamBPick: null,
      selectedMap: null,
    });
  };

  // Handle map selection
  const handleMapClick = (mapId: string) => {
    const { phase } = gameState;

    // First ban phase
    if (phase === "banPhaseA" || phase === "banPhaseB") {
      handleBanMap(mapId);
    }
    // First pick phase
    else if (phase === "pickPhaseA") {
      handleTeamAPick(mapId);
    } else if (phase === "pickPhaseB") {
      handleTeamBPick(mapId);
    }
    // Second ban phase (after initial picks)
    else if (phase === "secondBanPhaseA" || phase === "secondBanPhaseB") {
      handleSecondBanMap(mapId);
    }
    // Final pick phase (if needed after different initial picks)
    else if (phase === "finalPickPhaseA") {
      handleFinalTeamAPick(mapId);
    } else if (phase === "finalPickPhaseB") {
      handleFinalTeamBPick(mapId);
    }
  };

  // Ban a map (first ban phase)
  const handleBanMap = (mapId: string) => {
    setGameState((prevState) => {
      const updatedMaps: ValMap[] = prevState.maps.map((map) =>
        map.id === mapId ? { ...map, status: "banned" as const } : map
      );

      const updatedBannedMaps = [...prevState.bannedMaps, mapId];

      // Move to next phase
      let nextPhase = prevState.phase;
      let nextTeam = prevState.currentTeam;

      if (prevState.phase === "banPhaseA") {
        nextPhase = "banPhaseB";
        nextTeam = "B";
      } else if (prevState.phase === "banPhaseB") {
        nextPhase = "pickPhaseA";
        nextTeam = "A";
      }

      return {
        ...prevState,
        maps: updatedMaps,
        bannedMaps: updatedBannedMaps,
        phase: nextPhase,
        currentTeam: nextTeam,
      };
    });
  };

  // Second ban phase (after initial picks)
  const handleSecondBanMap = (mapId: string) => {
    setGameState((prevState) => {
      const updatedMaps: ValMap[] = prevState.maps.map((map) =>
        map.id === mapId ? { ...map, status: "banned" as const } : map
      );

      const updatedBannedMaps = [...prevState.bannedMaps, mapId];

      // Move to next phase
      let nextPhase = prevState.phase;
      let nextTeam = prevState.currentTeam;

      if (prevState.phase === "secondBanPhaseA") {
        nextPhase = "secondBanPhaseB";
        nextTeam = "B";
      } else if (prevState.phase === "secondBanPhaseB") {
        // After both teams have banned in the second phase,
        // check how many maps are left
        // Exclude maps picked by Team A and Team B from available maps
        const remainingMaps = updatedMaps.filter(
          (map) =>
            map.status === "available" &&
            map.name !== prevState.teamAPick &&
            map.name !== prevState.teamBPick
        );

        console.log("Remaining maps after Team B second ban:", remainingMaps);
        console.log("Team A pick:", prevState.teamAPick);
        console.log("Team B pick:", prevState.teamBPick);

        // If only one map is left, select it automatically
        if (remainingMaps.length === 1) {
          const lastMap = remainingMaps[0];
          const finalMaps = updatedMaps.map((map) =>
            map.id === lastMap.id
              ? { ...map, status: "selected" as const }
              : map
          );

          console.log("Auto-selecting the last remaining map:", lastMap.name);

          return {
            ...prevState,
            maps: finalMaps,
            bannedMaps: updatedBannedMaps,
            selectedMap: lastMap.name,
            phase: "complete",
            currentTeam: "A", // Reset to A for next game
          };
        } else if (remainingMaps.length === 0) {
          console.error("Error: No maps remaining after second ban phase");
          // If somehow we have no maps left, just complete the phase
          return {
            ...prevState,
            maps: updatedMaps,
            bannedMaps: updatedBannedMaps,
            phase: "complete",
            currentTeam: "A", // Reset to A for next game
          };
        } else {
          console.log(
            "Multiple maps still available after second ban phase:",
            remainingMaps
          );
        }
      }

      return {
        ...prevState,
        maps: updatedMaps,
        bannedMaps: updatedBannedMaps,
        phase: nextPhase,
        currentTeam: nextTeam,
      };
    });
  };

  // First pick for Team A
  const handleTeamAPick = (mapId: string) => {
    const selectedMap =
      gameState.maps.find((map) => map.id === mapId)?.name || "";

    setGameState((prevState) => ({
      ...prevState,
      teamAPick: selectedMap,
      phase: "pickPhaseB",
      currentTeam: "B",
    }));
  };

  // First pick for Team B
  const handleTeamBPick = (mapId: string) => {
    const selectedMap =
      gameState.maps.find((map) => map.id === mapId)?.name || "";

    setGameState((prevState) => {
      // If both teams picked the same map, select it as the final map
      if (selectedMap === prevState.teamAPick) {
        const updatedMaps: ValMap[] = prevState.maps.map((map) =>
          map.name === selectedMap
            ? { ...map, status: "selected" as const }
            : map
        );

        return {
          ...prevState,
          teamBPick: selectedMap,
          maps: updatedMaps,
          selectedMap,
          phase: "complete",
        };
      }

      // If they picked different maps, move to second ban phase
      return {
        ...prevState,
        teamBPick: selectedMap,
        phase: "secondBanPhaseA",
        currentTeam: "A",
      };
    });
  };

  // Final pick for Team A (if needed after second ban phase)
  const handleFinalTeamAPick = (mapId: string) => {
    const selectedMap =
      gameState.maps.find((map) => map.id === mapId)?.name || "";

    setGameState((prevState) => ({
      ...prevState,
      teamAPick: selectedMap,
      phase: "finalPickPhaseB",
      currentTeam: "B",
    }));
  };

  // Final pick for Team B (if needed after second ban phase)
  const handleFinalTeamBPick = (mapId: string) => {
    const selectedMap =
      gameState.maps.find((map) => map.id === mapId)?.name || "";

    setGameState((prevState) => {
      // If both teams picked the same map in the final phase, select it
      if (selectedMap === prevState.teamAPick) {
        const updatedMaps: ValMap[] = prevState.maps.map((map) =>
          map.name === selectedMap
            ? { ...map, status: "selected" as const }
            : map
        );

        return {
          ...prevState,
          teamBPick: selectedMap,
          maps: updatedMaps,
          selectedMap,
          phase: "complete",
        };
      }

      // If still different, select the last available map
      const availableMaps = prevState.maps.filter(
        (map) =>
          map.status === "available" &&
          map.name !== prevState.teamAPick &&
          map.name !== selectedMap
      );

      if (availableMaps.length === 1) {
        const lastMap = availableMaps[0];
        const updatedMaps: ValMap[] = prevState.maps.map((map) =>
          map.id === lastMap.id ? { ...map, status: "selected" as const } : map
        );

        return {
          ...prevState,
          teamBPick: selectedMap,
          maps: updatedMaps,
          selectedMap: lastMap.name,
          phase: "complete",
        };
      }

      // Shouldn't get here, but just in case
      return {
        ...prevState,
        teamBPick: selectedMap,
        phase: "complete",
      };
    });
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  const toggleImageEditor = () => {
    setShowImageEditor(!showImageEditor);
  };

  const updateMapImage = (mapId: string, newImageUrl: string) => {
    setGameState((prevState) => {
      const updatedMaps = prevState.maps.map((map) =>
        map.id === mapId ? { ...map, imageUrl: newImageUrl } : map
      );

      // Save to localStorage
      if (typeof window !== "undefined") {
        try {
          const savedImagePaths = localStorage.getItem(SAVED_MAP_IMAGES_KEY);
          const imagePaths = savedImagePaths ? JSON.parse(savedImagePaths) : {};
          imagePaths[mapId] = newImageUrl;
          localStorage.setItem(
            SAVED_MAP_IMAGES_KEY,
            JSON.stringify(imagePaths)
          );
        } catch (error) {
          console.error("Error saving image path:", error);
        }
      }

      return {
        ...prevState,
        maps: updatedMaps,
      };
    });
  };

  const getSelectedMap = (): ValMap | null => {
    if (!gameState.selectedMap) return null;
    return (
      gameState.maps.find((map) => map.name === gameState.selectedMap) || null
    );
  };

  const isDisabled = gameState.phase === "complete";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-center mb-4">
        Valorant Map Picker
      </h1>

      <ControlPanel
        onReset={resetGame}
        showInstructions={showInstructions}
        toggleInstructions={toggleInstructions}
        showImageEditor={showImageEditor}
        toggleImageEditor={toggleImageEditor}
      />

      {showImageEditor && (
        <MapImageEditor maps={gameState.maps} updateMapImage={updateMapImage} />
      )}

      <TeamIndicator
        currentTeam={gameState.currentTeam}
        teamAPick={gameState.teamAPick}
        teamBPick={gameState.teamBPick}
        phase={gameState.phase}
      />

      {gameState.phase === "complete" ? (
        <SelectedMap map={getSelectedMap()} />
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {gameState.phase.includes("ban") &&
              gameState.phase.startsWith("ban") &&
              "Ban a Map (First Ban Phase)"}
            {gameState.phase.includes("ban") &&
              gameState.phase.startsWith("second") &&
              "Ban a Map (Second Ban Phase)"}
            {gameState.phase.includes("pick") && "Select a Map"}
          </h2>
          <MapGrid
            maps={gameState.maps}
            onMapClick={handleMapClick}
            disabledMapIds={gameState.bannedMaps}
            isSelectionDisabled={isDisabled}
            teamAPick={gameState.teamAPick}
            teamBPick={gameState.teamBPick}
            currentTeam={gameState.currentTeam}
          />
        </div>
      )}
    </div>
  );
}
