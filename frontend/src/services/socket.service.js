
export const joinCall = (socket) => {
  const params = new URLSearchParams(window.location.search);
  const code = (params.get("code") || "").trim().toUpperCase();
  const roomKey = code ? `meeting:${code}` : `${window.location.pathname}${window.location.search}`;
  socket.emit("join-call", roomKey);
};


export const sendSignal = (socket, toId, signal) => {
  socket.emit("signal", toId, JSON.stringify(signal));
};


export const sendChatMessage = (socket, message, username) => {
  if (!message.trim()) return;
  socket.emit("chat-message", { message, username });
};

export const registerSocketEvents = (socket, handlers) => {
  const { onSignal, onUserJoined, onUserLeft, onChatMessage } = handlers;

  socket.on("signal", onSignal);
  socket.on("user-joined", onUserJoined);
  socket.on("user-left", onUserLeft);
  socket.on("user-disconnected", onUserLeft);
  socket.on("chat-message", onChatMessage);

  return () => {
    socket.off("signal", onSignal);
    socket.off("user-joined", onUserJoined);
    socket.off("user-left", onUserLeft);
    socket.off("user-disconnected", onUserLeft);
    socket.off("chat-message", onChatMessage);
  };
};
