import React, { useEffect, useRef } from "react";
import { AppIcon } from "../assets/icons/AppIcons";

const VideoTile = ({ socketId, stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <article className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-lg shadow-black/40 transition hover:ring-2 hover:ring-blue-500/60">
      <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/85 to-transparent" />
      <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5">
        <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.9)]" />
        <span className="text-xs font-medium tracking-[0.08em] text-white/90">{socketId.slice(0, 8).toUpperCase()}</span>
      </div>
    </article>
  );
};

const LocalStage = ({ localStream }) => {
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <div className="flex h-full w-full p-3">
      <article className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-lg shadow-black/40">
        <video ref={localVideoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/85 to-transparent" />
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5">
          <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.9)]" />
          <span className="text-xs font-medium tracking-[0.08em] text-white/90">YOU</span>
        </div>
      </article>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex h-full flex-col items-center justify-center px-8 text-center">
    <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-white/30">
      <AppIcon name="users" size={28} />
    </div>
    <p className="text-base font-semibold text-white/65">Waiting for others</p>
    <p className="mt-1 max-w-[240px] text-sm text-white/40">Share the meeting link to invite participants</p>
  </div>
);

const VideoGrid = ({ remoteVideos, localStream }) => {
  if (remoteVideos.length === 0) {
    return localStream ? <LocalStage localStream={localStream} /> : <EmptyState />;
  }

  const columns = remoteVideos.length === 1 ? "grid-cols-1" : remoteVideos.length <= 4 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className={`grid flex-1 content-center gap-2 overflow-y-auto p-3 ${columns}`}>
      {remoteVideos.map((video) => (
        <VideoTile key={video.socketId} socketId={video.socketId} stream={video.stream} />
      ))}
    </div>
  );
};

export default VideoGrid;
