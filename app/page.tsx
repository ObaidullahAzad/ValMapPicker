import MapPicker from "./components/MapPicker";

export default function Home() {
  return (
    <div className="relative min-h-screen text-white">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/Valovid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50" />

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen">
        <MapPicker />
      </div>
    </div>
  );
}
