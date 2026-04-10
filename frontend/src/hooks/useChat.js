import { useState, useCallback } from "react";
import { sendChatMessage } from "../services/socket.service";

const useChat = ({ socket, username, mySocketId }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const addMessage = useCallback(
    (data, sender, socketIdSender) => {
      setMessages((prev) => [...prev, { sender, data, timestamp: Date.now() }]);

      if (socketIdSender !== mySocketId) {
        setUnreadCount((prev) => prev + 1);
      }
    },
    [mySocketId],
  );

  const sendMessage = useCallback(() => {
    if (!messageInput.trim()) return;
    sendChatMessage(socket, messageInput, username);
    setMessageInput("");
  }, [socket, messageInput, username]);

 
  const clearUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return {
    messages,
    messageInput,
    setMessageInput,
    unreadCount,
    addMessage, 
    sendMessage,
    clearUnread,
  };
};

export default useChat;
