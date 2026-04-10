import React, { useEffect, useRef } from "react";
import { AppIcon } from "../assets/icons/AppIcons";

const LocalVideo = ({ localStream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <div className="group fixed bottom-24 right-5 z-[120] w-[200px] overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/60 transition hover:scale-[1.02] hover:ring-2 hover:ring-blue-500/60">
      <video ref={videoRef} autoPlay muted playsInline className="block aspect-[4/3] w-full scale-x-[-1] object-cover" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-xs font-medium text-white/90">
        <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.9)]" />
        <span>You</span>
      </div>
      {!localStream ? (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-white/25">
          <AppIcon name="camera" size={26} />
        </div>
      ) : null}
    </div>
  );
};

export default LocalVideo;
