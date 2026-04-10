import React, {
  createContext,
  useEffect,
  useState,
  useRef,
} from "react";
import io from "socket.io-client";
import { SERVER_URL, SOCKET_OPTIONS } from "../config/webrtc.config";

const SocketContext = createContext(null);

export { SocketContext };

export const SocketProvider = ({ children }) => {
  const socketRef = useRef();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io(SERVER_URL, SOCKET_OPTIONS);
    setSocket(socketRef.current);

    socketRef.current.on("connect", () => {
      console.log("Connected to signaling server", socketRef.current.id);

      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from signaling server", socketRef.current.id);
      setIsConnected(false);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        setSocket(null);
        console.log("[Socket] disconnected on cleanup");
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
