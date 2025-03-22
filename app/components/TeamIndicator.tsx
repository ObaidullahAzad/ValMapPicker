import { Team } from "../lib/types";

interface TeamIndicatorProps {
  currentTeam: Team;
  teamAPick: string | null;
  teamBPick: string | null;
  phase: string;
}

export default function TeamIndicator({
  currentTeam,
  teamAPick,
  teamBPick,
  phase,
}: TeamIndicatorProps) {
  const teamAActive = currentTeam === "A";
  const teamBActive = currentTeam === "B";

  const getPhaseText = () => {
    if (phase.includes("ban") && phase.startsWith("ban")) {
      return "First Ban Phase";
    } else if (phase.includes("ban") && phase.startsWith("second")) {
      return "Second Ban Phase";
    } else if (phase.includes("pick")) {
      return "Picking Phase";
    } else if (phase === "complete") {
      return "Map Selected";
    }
    return "";
  };

  const getActionText = () => {
    switch (phase) {
      case "banPhaseA":
        return "Team A Bans";
      case "banPhaseB":
        return "Team B Bans";
      case "pickPhaseA":
        return "Team A Picks";
      case "pickPhaseB":
        return "Team B Picks";
      case "secondBanPhaseA":
        return "Team A Bans (2nd)";
      case "secondBanPhaseB":
        return "Team B Bans (2nd)";
      case "finalPickPhaseA":
        return "Team A Final Pick";
      case "finalPickPhaseB":
        return "Team B Final Pick";
      case "complete":
        return "Complete";
      default:
        return "";
    }
  };

  return (
    <div className="flex justify-between items-center mb-8 mt-4">
      <div
        className={`w-48 h-32 rounded-lg flex items-center shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] justify-center transition-all ${
          teamAActive ? "bg-[#ff4654] ring-4 ring-blue-300" : "bg-[#fe2b3d]"
        }`}
      >
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold">Team A</h2>
          {teamAPick && (
            <div className="mt-2 bg-white bg-opacity-20 py-1 px-2 rounded-md">
              <p className="text-white">Pick: {teamAPick}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mx-2 text-center">
        <div className="text-lg font-bold mb-2">{getPhaseText()}</div>
        <div className="bg-gray-800 text-white py-2 px-4 rounded-md">
          {getActionText()}
        </div>
      </div>

      <div
        className={`w-48 h-32 rounded-lg flex items-center shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] justify-center transition-all ${
          teamBActive ? "bg-green-300 ring-4 ring-green-800" : "bg-green-400"
        }`}
      >
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold">Team B</h2>
          {teamBPick && (
            <div className="mt-2 bg-white bg-opacity-20 py-1 px-2 rounded-md">
              <p className="text-white">Pick: {teamBPick}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
