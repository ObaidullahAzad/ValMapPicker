interface ControlPanelProps {
  onReset: () => void;
  showInstructions: boolean;
  toggleInstructions: () => void;
  showImageEditor: boolean;
  toggleImageEditor: () => void;
}

export default function ControlPanel({
  onReset,
  showInstructions,
  toggleInstructions,
}: // showImageEditor,
// toggleImageEditor,
ControlPanelProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <button
          onClick={onReset}
          className="bg-slate-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-4xl shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]"
        >
          Reset
        </button>
        <button
          onClick={toggleInstructions}
          className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-4xl shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]"
        >
          {showInstructions ? "Hide Instructions" : "Show Instructions"}
        </button>
        {/* <button
          onClick={toggleImageEditor}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          {showImageEditor ? "Hide Image Editor" : "Customize Images"}
        </button> */}
      </div>

      {showInstructions && (
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-4 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-2">How It Works:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Team A bans one map from the pool (First Ban Phase)</li>
            <li>
              Team B bans one map from the remaining maps (First Ban Phase)
            </li>
            <li>Team A selects one map from the remaining maps</li>
            <li>Team B selects one map from the remaining maps</li>
            <li>If both teams choose the same map, that map is selected</li>
            <li>
              If different maps are chosen, Team A bans another map (Second Ban
              Phase)
            </li>
            <li>Team B then bans another map (Second Ban Phase)</li>
            <li>The remaining map is automatically selected</li>
          </ol>
        </div>
      )}
    </div>
  );
}
