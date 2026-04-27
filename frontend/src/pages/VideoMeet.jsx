import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { useMediaStream } from "../hooks/useMediaStream";
import useWebRTC from "../hooks/useWebRTC";
import useChat from "../hooks/useChat";
import { getMeetingCodeFromURL } from "../utils/meetingUtils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import Lobby from "../components/Lobby";
import VideoGrid from "../components/VideoGrid";
import LocalVideo from "../components/LocalVideo";
import Controls from "../components/Controls";
import ChatPanel from "../components/ChatPanel";
import EmojiOverlay from "../components/EmojiOverlay";
import EmojiBar from "../components/EmojiBar";

const resolveDisplayName = (user) => {
  const name =
    user?.username ||
    user?.userName ||
    user?.name ||
    user?.fullName ||
    user?.displayName ||
    user?.display_name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0];
  return name?.trim() || "Guest";
};

const VideoMeet = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user, addMeetingToHistory } = useAuth();

  const [inLobby, setInLobby] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [statusToast, setStatusToast] = useState("");
  const socketCleanupRef = useRef(null);
  const [meetingCode] = useState(() => getMeetingCodeFromURL());

  const username = resolveDisplayName(user);

  const {
    localStreamRef,
    localStream,
    videoEnabled,
    audioEnabled,
    screenSharing,
    screenAvailable,
    initMedia,
    toggleVideo,
    toggleAudio,
    toggleScreen,
  } = useMediaStream();

  const { remoteVideos, joinRoom, replaceStream, cleanupConnections } =
    useWebRTC({
      socket,
      localStreamRef,
      onParticipantJoined: (_, participantName) =>
        setStatusToast(`${participantName || "Participant"} entered the meeting`),
      onParticipantLeft: (_, participantName) =>
        setStatusToast(`${participantName || "Participant"} left the meeting`),
    });

  const {
    messages,
    messageInput,
    setMessageInput,
    unreadCount,
    addMessage,
    sendMessage,
    clearUnread,
  } = useChat({ socket, username, mySocketId: socket?.id });

 
  const handleJoin = useCallback(async () => {
    const displayName = username.trim() || "Guest";
    if (!displayName || !socket) return;

    await initMedia();

    if (meetingCode) {
      try {
        await addMeetingToHistory(meetingCode);
      } catch (err) {
        console.error("Failed to store meeting in history:", err);
      }
    }

    socketCleanupRef.current?.();
    socketCleanupRef.current = joinRoom(addMessage, displayName);
    setInLobby(false);
    setStatusToast("Entered room successfully");
  }, [
    username,
    socket,
    initMedia,
    meetingCode,
    addMeetingToHistory,
    joinRoom,
    addMessage,
  ]);

  const handleToggleScreen = useCallback(
    () => toggleScreen(replaceStream),
    [toggleScreen, replaceStream],
  );

  const handleToggleChat = useCallback(() => {
    setChatOpen((prev) => {
      if (!prev) clearUnread();
      return !prev;
    });
  }, [clearUnread]);

  const handleToggleEmoji = useCallback(() => {
    setEmojiOpen((prev) => !prev);
  }, []);

  const handleEndCall = useCallback(() => {
    socketCleanupRef.current?.();
    socketCleanupRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    cleanupConnections();
    if (socket) {
      socket.disconnect();
    }
    setStatusToast("Left room successfully");
    setTimeout(() => navigate("/dashboard", { replace: true }), 350);
  }, [localStreamRef, cleanupConnections, socket, navigate]);

  useEffect(() => {
    if (statusToast) {
      const timeoutId = setTimeout(() => setStatusToast(""), 1800);
      return () => clearTimeout(timeoutId);
    }
  }, [statusToast]);

  useEffect(() => {
    if (inLobby) {
      initMedia();
    }
  }, [inLobby, initMedia]);

  useEffect(() => {
    const stream = localStreamRef.current;
    return () => {
      socketCleanupRef.current?.();
      stream?.getTracks().forEach((t) => t.stop());
      cleanupConnections();
    };
  }, [cleanupConnections, localStreamRef]);

  if (inLobby) {
    return (
      <Lobby
        username={username}
        onJoin={handleJoin}
        localStream={localStream}
        meetingCode={meetingCode}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-zinc-950">
      <div
        className={`flex flex-1 pb-24 transition-all duration-300 ${chatOpen ? "pr-[320px]" : "pr-0"}`}
      >
        <VideoGrid remoteVideos={remoteVideos} localStream={localStream} />
      </div>
      {remoteVideos.length > 0 && <LocalVideo localStream={localStream} />}
      {statusToast && (
        <div className="fixed left-1/2 top-4 z-[300] -translate-x-1/2 rounded-lg border border-white/20 bg-zinc-900/95 px-4 py-2.5 text-sm font-semibold text-white shadow-xl shadow-black/50">
          {statusToast}
        </div>
      )}
      <Controls
        videoEnabled={videoEnabled}
        audioEnabled={audioEnabled}
        screenSharing={screenSharing}
        screenAvailable={screenAvailable}
        chatOpen={chatOpen}
        emojiOpen={emojiOpen}
        unreadCount={unreadCount}
        onToggleVideo={toggleVideo}
        onToggleAudio={toggleAudio}
        onToggleScreen={handleToggleScreen}
        onToggleChat={handleToggleChat}
        onToggleEmoji={handleToggleEmoji}
        onEndCall={handleEndCall}
      />
      {chatOpen && (
        <ChatPanel
          messages={messages}
          messageInput={messageInput}
          onMessageChange={setMessageInput}
          onSend={sendMessage}
          onClose={() => setChatOpen(false)}
        />
      )}
      <EmojiOverlay />
      {emojiOpen && (
        <div className="fixed bottom-24 left-1/2 z-[210] -translate-x-1/2 rounded-2xl border border-white/10 bg-zinc-900/95 px-3 py-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
          <EmojiBar senderName={username} />
        </div>
      )}
    </div>
  );
};

export default VideoMeet;
