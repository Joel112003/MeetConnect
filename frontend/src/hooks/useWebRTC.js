import { useRef, useState, useCallback } from "react";
import { ICE_SERVERS } from "../config/webrtc.config";
import {
  sendSignal,
  joinCall,
  registerSocketEvents,
} from "../services/socket.service";
import { createFallbackStream } from "../utils/mediaUtils";

const useWebRTC = ({
  socket,
  localStreamRef,
  onParticipantJoined,
  onParticipantLeft,
}) => {
  const connectionsRef = useRef({});
  const remoteStreamsRef = useRef({});

  const [remoteVideos, setRemoteVideos] = useState([]);
  const remoteVideosRef = useRef([]);

  const getLocalStream = useCallback(() => {
    if (localStreamRef.current) return localStreamRef.current;
    return createFallbackStream();
  }, [localStreamRef]);

  const upsertRemoteVideo = useCallback((peerId, stream) => {
    setRemoteVideos((prev) => {
      const idx = prev.findIndex((v) => v.socketId === peerId);
      if (idx !== -1) {
        const updated = prev.map((v) =>
          v.socketId === peerId ? { ...v, stream } : v,
        );
        remoteVideosRef.current = updated;
        return updated;
      }

      const updated = [...prev, { socketId: peerId, stream }];
      remoteVideosRef.current = updated;
      return updated;
    });
  }, []);

  const addLocalTracksToPeer = useCallback(
    (pc) => {
      const localStream = getLocalStream();
      const existingTrackIds = new Set(
        pc.getSenders()
          .filter((s) => s.track)
          .map((s) => s.track.id),
      );

      localStream.getTracks().forEach((track) => {
        if (!existingTrackIds.has(track.id)) {
          pc.addTrack(track, localStream);
        }
      });
    },
    [getLocalStream],
  );

  const createPeerConnection = useCallback((peerId) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal(socket, peerId, { ice: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      let remoteStream = remoteStreamsRef.current[peerId];
      if (!remoteStream) {
        remoteStream = new MediaStream();
        remoteStreamsRef.current[peerId] = remoteStream;
      }

      event.streams?.[0]?.getTracks().forEach((track) => {
        const exists = remoteStream
          .getTracks()
          .some((existingTrack) => existingTrack.id === track.id);
        if (!exists) {
          remoteStream.addTrack(track);
        }
      });

      if (event.track && !event.streams?.[0]) {
        const exists = remoteStream
          .getTracks()
          .some((existingTrack) => existingTrack.id === event.track.id);
        if (!exists) {
          remoteStream.addTrack(event.track);
        }
      }

      upsertRemoteVideo(peerId, remoteStream);
    };

    pc.onaddStream = (event) => {
      upsertRemoteVideo(peerId, event.stream);
    };
    pc.onconnectionstatechange = () => {
      console.log(`[WebRTC] Peer ${peerId} state: ${pc.connectionState}`);
      if (pc.connectionState === "failed") {
        console.warn(
          `[WebRTC] Connection to ${peerId} failed. Consider ICE restart.`,
        );
      }
    };
    return pc;
  }, [socket, upsertRemoteVideo]);

  const handleUserJoined = useCallback(
  (id, clients) => {
    const myId = socket.id;

    if (id !== myId) {
      onParticipantJoined?.(id);
    }

    clients.forEach((peerId) => {
      if (peerId === myId) return;
      if (connectionsRef.current[peerId]) return;

      const pc = createPeerConnection(peerId);
      connectionsRef.current[peerId] = pc;
      addLocalTracksToPeer(pc);
    });

    if (id === myId) {
      Object.entries(connectionsRef.current).forEach(([peerId, pc]) => {
        if (peerId === myId) return;

        pc.createOffer()
          .then((offer) => pc.setLocalDescription(offer))
          .then(() => {
            sendSignal(socket, peerId, {
              sdp: connectionsRef.current[peerId].localDescription,
            });
          })
          .catch((err) => console.error("[WebRTC] Offer error:", err));
      });
    }
  },
  [socket, createPeerConnection, addLocalTracksToPeer, onParticipantJoined],
);

  const handleUserLeft = useCallback((peerId) => {
  onParticipantLeft?.(peerId);
  if (connectionsRef.current[peerId]) {
    connectionsRef.current[peerId].close();
    delete connectionsRef.current[peerId];
  }
  delete remoteStreamsRef.current[peerId];
  setRemoteVideos((prev) => {
    const updated = prev.filter((v) => v.socketId !== peerId);
    remoteVideosRef.current = updated;
    return updated;
  });
}, [onParticipantLeft]);

  const handleSignal = useCallback(
  async (fromId, rawMessage) => {
    if (fromId === socket.id) return;

    const signal =
      typeof rawMessage === "string" ? JSON.parse(rawMessage) : rawMessage;

    let pc = connectionsRef.current[fromId];
    if (!pc) {
      pc = createPeerConnection(fromId);
      connectionsRef.current[fromId] = pc;
      addLocalTracksToPeer(pc);
    }

    try {
      if (signal.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

        if (signal.sdp.type === "offer") {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          sendSignal(socket, fromId, { sdp: pc.localDescription });
        }
      }

      if (signal.ice) {
        await pc.addIceCandidate(new RTCIceCandidate(signal.ice));
      }
    } catch (err) {
      console.error("[WebRTC] Signal handling error:", err);
    }
  },
  [socket, createPeerConnection, addLocalTracksToPeer],
);

  const joinRoom = useCallback(
  (onChatMessage) => {
    const cleanup = registerSocketEvents(socket, {
      onSignal: handleSignal,
      onUserJoined: handleUserJoined,
      onUserLeft: handleUserLeft,
      onChatMessage,
    });
    joinCall(socket);
    return cleanup;
  },
  [socket, handleSignal, handleUserJoined, handleUserLeft],
);

  const replaceStream = useCallback((newStream) => {
  const newAudioTrack = newStream.getAudioTracks()[0];
  const newVideoTrack = newStream.getVideoTracks()[0];

  Object.values(connectionsRef.current).forEach((pc) => {
    pc.getSenders().forEach((sender) => {
      if (sender.track?.kind === "audio" && newAudioTrack) {
        sender.replaceTrack(newAudioTrack).catch(console.error);
      }
      if (sender.track?.kind === "video" && newVideoTrack) {
        sender.replaceTrack(newVideoTrack).catch(console.error);
      }
    });
  });
}, []);

  const cleanupConnections = useCallback(() => {
  Object.values(connectionsRef.current).forEach((pc) => pc.close());
  connectionsRef.current = {};
  remoteStreamsRef.current = {};
    setRemoteVideos([]);
    remoteVideosRef.current = [];
}, []);

  return {
    remoteVideos,
    joinRoom,
    replaceStream,
    cleanupConnections,
  };
};

export default useWebRTC;

