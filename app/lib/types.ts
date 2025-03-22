export interface ValMap {
  id: string;
  name: string;
  imageUrl: string;
  status: "available" | "banned" | "selected";
}

export type Team = "A" | "B";

export interface GameState {
  currentTeam: Team;
  phase:
    | "banPhaseA" // First ban phase - Team A
    | "banPhaseB" // First ban phase - Team B
    | "pickPhaseA" // First pick phase - Team A
    | "pickPhaseB" // First pick phase - Team B
    | "secondBanPhaseA" // Second ban phase - Team A
    | "secondBanPhaseB" // Second ban phase - Team B
    | "finalPickPhaseA" // If needed after initial picks are different
    | "finalPickPhaseB" // If needed after initial picks are different
    | "complete"; // Selection complete
  maps: ValMap[];
  bannedMaps: string[];
  teamAPick: string | null;
  teamBPick: string | null;
  selectedMap: string | null;
}
