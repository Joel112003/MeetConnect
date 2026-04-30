import { useRef, useState, useCallback, useEffect } from "react";
import { createFallbackStream } from "../utils/mediaUtils";

export const useMediaStream = () => {
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);

  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [screenAvailable] = useState(
    () => !!navigator.mediaDevices?.getDisplayMedia,
  );

  // stop all tracks
  const stopCurrentStream = useCallback(() => {
    const stream = localStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        stream.removeTrack(track);
      });
    }
    localStreamRef.current = null;
  }, []);

  // apply stream
  const applyStream = useCallback(
    (stream) => {

      if (localStreamRef.current && localStreamRef.current !== stream) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      localStreamRef.current = stream;
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    },
    [],
  );

  // initialize media
  const initMedia = useCallback(async () => {

    if (localStreamRef.current) {
      const tracks = localStreamRef.current.getTracks();
      const hasLiveTracks = tracks.some((t) => t.readyState === "live");
      if (hasLiveTracks) return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      applyStream(stream);
      setVideoEnabled(true);
      setAudioEnabled(true);
    } catch (err) {
      console.warn(
        "[Media] Permission denied or device unavailable:",
        err.message,
      );
      applyStream(createFallbackStream());
      setVideoEnabled(false);
      setAudioEnabled(false);
    }
  }, [applyStream]);

  const toggleVideo = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const videoTracks = stream.getVideoTracks();
    if (videoTracks.length === 0) {
      setVideoEnabled(false);
      return;
    }

    const nextEnabled = !videoTracks[0].enabled;
    videoTracks.forEach((track) => {
      track.enabled = nextEnabled;
    });
    setVideoEnabled(nextEnabled);
  }, []);

  const toggleAudio = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      setAudioEnabled(false);
      return;
    }

    const nextEnabled = !audioTracks[0].enabled;
    audioTracks.forEach((track) => {
      track.enabled = nextEnabled;
    });
    setAudioEnabled(nextEnabled);
  }, []);

  const switchToCamera = useCallback(
    async (onStreamChange) => {
      stopCurrentStream();
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        applyStream(cameraStream);
        onStreamChange?.(cameraStream);
      } catch (err) {
        console.warn("[Media] Failed to switch back to camera:", err.message);
        applyStream(createFallbackStream());
      }
      setScreenSharing(false);
    },
    [stopCurrentStream, applyStream],
  );

  const toggleScreen = useCallback(
    async (onStreamChange) => {
      if (screenSharing) {
        await switchToCamera(onStreamChange);
      } else {
        try {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });
          stopCurrentStream();
          applyStream(screenStream);
          onStreamChange?.(screenStream);
          setScreenSharing(true);

          screenStream.getVideoTracks()[0].onended = () => {
            switchToCamera(onStreamChange);
          };
        } catch (err) {
          console.warn("[Media] Failed to start screen share:", err.message);
        }
      }
    },
    [screenSharing, stopCurrentStream, applyStream, switchToCamera],
  );

  // cleanup
  useEffect(() => {
    return () => {
      const stream = localStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      localStreamRef.current = null;
    };
  }, []);

  return {
    localVideoRef,
    localStreamRef,
    localStream,
    videoEnabled,
    audioEnabled,
    screenSharing,
    screenAvailable,
    initMedia,
    stopCurrentStream,
    toggleVideo,
    toggleAudio,
    toggleScreen,
  };
};
