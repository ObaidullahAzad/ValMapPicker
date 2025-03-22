import { ValMap } from "../lib/types";
import MapCard from "./MapCard";

interface MapGridProps {
  maps: ValMap[];
  onMapClick: (mapId: string) => void;
  disabledMapIds?: string[];
  isSelectionDisabled?: boolean;
  teamAPick?: string | null;
  teamBPick?: string | null;
  currentTeam: "A" | "B";
}

export default function MapGrid({
  maps,
  onMapClick,
  disabledMapIds = [],
  isSelectionDisabled = false,
  teamAPick = null,
  teamBPick = null,
  currentTeam,
}: MapGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {maps.map((map) => {
        const isTeamAPick = teamAPick === map.name;
        const isTeamBPick = teamBPick === map.name;

        return (
          <MapCard
            key={map.id}
            map={map}
            onClick={() => onMapClick(map.id)}
            disabled={
              isSelectionDisabled ||
              disabledMapIds.includes(map.id) ||
              map.status === "banned"
            }
            isSelected={isTeamAPick || isTeamBPick}
            selectionType={
              isTeamAPick ? "teamA" : isTeamBPick ? "teamB" : undefined
            }
          />
        );
      })}
    </div>
  );
}
