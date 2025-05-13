
export const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/70">

    <div className="relative w-20 h-20 overflow-hidden">
      <div
        className="absolute inset-0 bg-wave bg-repeat-x bg-bottom animate-wave"
        style={{
          WebkitMaskImage: "url('/camera_2.png')",
          maskImage: "url('/camera_2.png')",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </div>
  </div>
  );
};
