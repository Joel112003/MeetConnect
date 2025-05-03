import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";


// Icons
const VideocamIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const VideocamOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      clipRule="evenodd"
    />
  </svg>
);

const MicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
    />
  </svg>
);

const MicOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      clipRule="evenodd"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
    />
  </svg>
);

const ScreenShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const StopScreenShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
    />
  </svg>
);

const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const CallEndIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";
let connections = {};

const peerConfigConnections = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    // Add TURN server if available
    // { 
    //   urls: 'turn:your-turn-server.com:3478',
    //   username: 'username',
    //   credential: 'credential'
    // }
  ],
  // These options help improve video quality
  iceTransportPolicy: "all",
  iceCandidatePoolSize: 10,
  bundlePolicy: "max-bundle",
  rtcpMuxPolicy: "require",
  sdpSemantics: "unified-plan",
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideDown = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 15, stiffness: 100 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.1,
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.9 },
  inactive: {
    scale: 1,
    boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.0)",
    transition: { duration: 0.2 },
  },
};

const VideoMeet = () => {
  // Refs
  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoref = useRef();
  const chatContainerRef = useRef();
  const navigate = useNavigate();

  // State
  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [screenAvailable, setScreenAvailable] = useState(false);
  const [video, setVideo] = useState(false);
  const [audio, setAudio] = useState(false);
  const [screen, setScreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState(0);
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");
  const [videos, setVideos] = useState([]);
  const [participants, setParticipants] = useState(1);
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [connectionQuality, setConnectionQuality] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [mainViewMode, setMainViewMode] = useState("grid"); // 'grid' or 'spotlight'
  const [showControls, setShowControls] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "info",
  });

  // Effects
  useEffect(() => {
    const getPermissions = async () => {
      try {
        // Only request permissions if the user has explicitly enabled them
        if (video) {
          const videoPermission = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setVideoAvailable(!!videoPermission);
        }

        if (audio) {
          const audioPermission = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          setAudioAvailable(!!audioPermission);
        }

        setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

        // Only get media if explicitly enabled
        if (video || audio) {
          const userMediaStream = await navigator.mediaDevices.getUserMedia({
            video: video && videoAvailable,
            audio: audio && audioAvailable,
          });

          if (userMediaStream) {
            window.localStream = userMediaStream;
            if (localVideoref.current) {
              localVideoref.current.srcObject = userMediaStream;
            }
          }
        }
      } catch (error) {
        console.error("Error getting permissions:", error);
        displayNotification("Could not access camera or microphone", "error");
      }
    };
    getPermissions();

    // Auto-hide controls after a period of inactivity
    let timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!askForUsername && !showChat) {
          setShowControls(false);
        }
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [video, audio]);

  useEffect(() => {
    if (screen !== undefined) {
      handleScreenShare();
    }
  }, [screen]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Simulate connection quality changes
    const interval = setInterval(() => {
      setConnectionQuality((prev) => {
        const newQuality = { ...prev };
        Object.keys(connections).forEach((id) => {
          newQuality[id] = Math.floor(Math.random() * 100); // Random quality for demo
        });
        return newQuality;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Call duration timer
  useEffect(() => {
    let timer;
    if (!askForUsername) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [askForUsername]);

  // Display notification
  const displayNotification = (message, type = "info") => {
    setNotification({ message, type });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Media functions
  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      // Higher quality video constraints
      const videoConstraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
          facingMode: "user",
        },
        audio,
      };

      navigator.mediaDevices
        .getUserMedia(videoConstraints)
        .then(getUserMediaSuccess)
        .catch((err) => {
          console.error(err);
          displayNotification("Failed to access media devices", "error");
        });
    } else {
      stopLocalStream();
    }
  };

  const getUserMediaSuccess = (stream) => {
    // Skip if screen sharing is active
    if (window.screenStream) {
      return;
    }

    // Clean up previous stream
    const cleanupStream = () => {
      try {
        window.localStream?.getTracks().forEach((track) => track.stop());
      } catch (e) {
        console.error("Stream cleanup error:", e);
      }
    };

    try {
      cleanupStream();
      window.localStream = stream;
      localVideoref.current.srcObject = stream;
      displayNotification("Media devices activated", "success");

      // Update all peer connections
      Object.keys(connections).forEach((id) => {
        if (id === socketIdRef.current) return;

        try {
          // Remove existing tracks first
          const senders = connections[id].getSenders();
          senders.forEach((sender) => connections[id].removeTrack(sender));

          // Add new stream and optimize
          connections[id].addStream(stream);
          setBandwidthConstraints(connections[id]);

          // Re-negotiate connection
          connections[id]
            .createOffer()
            .then((offer) => connections[id].setLocalDescription(offer))
            .then(() => {
              socketRef.current.emit(
                "signal",
                id,
                JSON.stringify({ sdp: connections[id].localDescription })
              );
            })
            .catch((err) => console.error("Offer error:", err));
        } catch (e) {
          console.error("Connection update error:", e);
        }
      });

      // Handle track ending
      stream.getVideoTracks().forEach((track) => {
        track.onended = () => {
          setVideo(false);
          stopLocalStream();
        };
      });

      stream.getAudioTracks().forEach((track) => {
        track.onended = () => {
          setAudio(false);
          if (!stream.getVideoTracks().some((t) => t.enabled)) {
            stopLocalStream();
          }
        };
      });
    } catch (e) {
      console.error("Media setup error:", e);
      cleanupStream();
      displayNotification("Media activation failed", "error");
    }
  };

  const handleScreenShare = async () => {
    if (screen) {
      try {
        if (window.screenStream) {
          window.screenStream.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: "monitor",
            logicalSurface: true,
            cursor: "always",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 },
            facingMode: "user",
          },
          audio: true,
        });

        // Handle when screen share is stopped manually
        stream.getVideoTracks()[0].onended = () => {
          setScreen(false);
          if (window.screenStream) {
            window.screenStream.getTracks().forEach((track) => track.stop());
            window.screenStream = null;
          }
        };

        window.screenStream = stream;

        getDislayMediaSuccess(stream);
      } catch (err) {
        setScreen(false);
        console.error("Screen share error:", err);
      }
    } else {
      // Stop screen share
      if (window.screenStream) {
        window.screenStream.getTracks().forEach((track) => track.stop());
        window.screenStream = null;
        // displayNotification("Screen sharing stopped", "info");
      }
      // Re-enable camera/mic if needed
      if (video || audio) {
        getUserMedia();
      }
    }
  };

  const getDislayMediaSuccess = (stream) => {
    try {
      window.localStream?.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.error(e);
    }

    // Add check for stream type
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      const settings = videoTrack.getSettings();
      // Log settings to help debug
      console.log("Screen capture settings:", settings);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;
    displayNotification("Screen sharing started", "success");

    // Update all peer connections with the new stream
    Object.keys(connections).forEach((id) => {
      if (id === socketIdRef.current) return;

      try {
        // Remove old stream tracks first
        const sender = connections[id].getSenders();
        sender.forEach((s) => connections[id].removeTrack(s));

        // Add new screen share stream
        connections[id].addStream(stream);
        // Add this line after adding stream
        setBandwidthConstraints(connections[id]);
        // Re-negotiate connection
        connections[id]
          .createOffer()
          .then((description) => {
            connections[id]
              .setLocalDescription(description)
              .then(() => {
                socketRef.current.emit(
                  "signal",
                  id,
                  JSON.stringify({ sdp: connections[id].localDescription })
                );
              })
              .catch(console.error);
          })
          .catch(console.error);
      } catch (e) {
        console.error("Error updating connection with screen share:", e);
      }
    });

    // Handle when screen share is stopped by browser UI
    stream.getTracks().forEach((track) => {
      track.onended = () => {
        setScreen(false);
        if (window.screenStream) {
          window.screenStream.getTracks().forEach((t) => t.stop());
          window.screenStream = null;
        }

        if (video || audio) {
          getUserMedia();
        } else {
          const blackSilence = new MediaStream([
            createBlackVideoTrack(),
            createSilentAudioTrack(),
          ]);
          window.localStream = blackSilence;
          localVideoref.current.srcObject = blackSilence;
        }
        displayNotification("Screen sharing ended", "info");
      };
    });
  };

  // Add this function near your other utility functions
  const setBandwidthConstraints = (connection) => {
    if (connection && connection.getSenders) {
      const senders = connection.getSenders();
      senders.forEach((sender) => {
        if (sender.track && sender.track.kind === "video") {
          const parameters = sender.getParameters();
          if (!parameters.encodings) {
            parameters.encodings = [{}];
          }
          // Lower the bitrate to ensure better compatibility
          parameters.encodings[0].maxBitrate = 1000000; // 1 Mbps instead of 2.5 Mbps
          parameters.encodings[0].maxFramerate = 24;
          sender
            .setParameters(parameters)
            .catch((err) => console.error("Error setting bandwidth:", err));
        }
      });
    }
  };

  const stopLocalStream = () => {
    try {
      localVideoref.current?.srcObject
        ?.getTracks()
        ?.forEach((track) => track.stop());
    } catch (e) {
      console.error(e);
    }
  };

  // Socket and WebRTC functions
  const connectToSocketServer = () => {
    socketRef.current = io.connect(serverUrl, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);
    socketRef.current.on("participants", (count) => setParticipants(count));

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);
      socketRef.current.on("user-left", handleUserLeft);
      socketRef.current.on("user-joined", handleUserJoined);
      socketRef.current.on("active-speaker", setActiveSpeaker);

      displayNotification("Connected to meeting", "success");
    });

    socketRef.current.on("connect_error", () => {
      displayNotification("Connection error. Trying to reconnect...", "error");
    });
  };

  const gotMessageFromServer = (fromId, message) => {
    const signal = JSON.parse(message);

    if (fromId !== socketIdRef.current && connections[fromId]) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch(console.error);
                })
                .catch(console.error);
            }
          })
          .catch(console.error);
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch(console.error);
      }
    }
  };

  const handleUserLeft = (id) => {
    if (connections[id]) {
      try {
        connections[id].close();
      } catch (e) {
        console.error("Error closing connection:", e);
      }
      delete connections[id];
    }

    setVideos((prevVideos) => {
      const newVideos = prevVideos.filter((video) => video.socketId !== id);
      return newVideos;
    });

    setConnectionQuality((prev) => {
      const newQuality = { ...prev };
      delete newQuality[id];
      return newQuality;
    });

    displayNotification("A participant left the meeting", "info");
  };

  const handleUserJoined = (id, clients) => {
    // Show notification with username if available
    displayNotification(`New participant (${id.slice(0, 5)}) joined the meeting`, "success");

    clients.forEach((socketListId) => {
      if (socketListId === socketIdRef.current || connections[socketListId]) {
        return;
      }

      // Create new peer connection
      connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
      // setBandwidthConstraints(connections[socketListId]);

      // Handle ICE candidates
      connections[socketListId].onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit(
            "signal",
            socketListId,
            JSON.stringify({ ice: event.candidate })
          );
        }
      };

      // Handle incoming stream
      connections[socketListId].onaddstream = (event) => {
        // Ensure stream exists and has tracks
        if (!event.stream) {
          console.warn('Received empty stream for:', socketListId);
          return;
        }
        
        // Log stream information for debugging
        console.log('Received remote stream for:', socketListId, 'Tracks:', event.stream.getTracks().length);
        console.log('Video tracks:', event.stream.getVideoTracks().length, 'Audio tracks:', event.stream.getAudioTracks().length);
        
        // Check if video tracks exist and are enabled
        const videoTracks = event.stream.getVideoTracks();
        if (videoTracks.length === 0) {
          console.warn('No video tracks in remote stream for:', socketListId);
        } else {
          console.log('Video track enabled:', videoTracks[0].enabled, 'for user:', socketListId);
        }

        setVideos((prevVideos) => {
          // Check if video already exists
          const existingVideo = prevVideos.find(
            (v) => v.socketId === socketListId
          );
          
          if (existingVideo) {
            // Update existing video with new stream
            return prevVideos.map((v) =>
              v.socketId === socketListId ? { ...v, stream: event.stream } : v
            );
          }

          // Add new video
          const newVideo = {
            socketId: socketListId,
            stream: event.stream,
            autoplay: true,
            playsinline: true,
          };

          // Force a re-render of the grid
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, 100);

          return [...prevVideos, newVideo];
        });

        // Update participant count and re-render grid
        setParticipants((prev) => prev + 1);
      };

      // Add local stream to new connection if available
      if (window.localStream) {
        try {
          connections[socketListId].addStream(window.localStream);
        } catch (err) {
          console.error('Error adding local stream:', err);
          displayNotification("Error connecting with new participant", "error");
        }
      }
    });

    // Create offers for new connections
    if (id === socketIdRef.current) {
      Object.keys(connections).forEach((id2) => {
        if (id2 === socketIdRef.current) return;

        try {
          connections[id2]
            .createOffer()
            .then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((err) => {
                  console.error('Error setting local description:', err);
                  displayNotification("Connection error with new participant", "error");
                });
            })
            .catch((err) => {
              console.error('Error creating offer:', err);
              displayNotification("Failed to establish connection with new participant", "error");
            });
        } catch (err) {
          console.error('Error in connection setup:', err);
          displayNotification("Connection setup failed", "error");
        }
      });
    }
  };

  // Utility functions
  const createSilentAudioTrack = () => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  const createBlackVideoTrack = ({ width = 640, height = 480 } = {}) => {
    const canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    const stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  // Chat functions
  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prev) => [...prev, { sender, data, timestamp: new Date() }]);
    if (socketIdSender !== socketIdRef.current && !showChat) {
      setNewMessages((prev) => prev + 1);
      displayNotification(`New message from ${sender}`, "info");
    }
  };

  const sendMessage = () => {
    if (message.trim() && socketRef.current) {
      socketRef.current.emit("chat-message", message.trim(), username);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // UI functions
  const connect = () => {
    if (username.trim()) {
      setIsJoining(true);
      setTimeout(() => {
        setAskForUsername(false);
        connectToSocketServer();

        // Only get media if user explicitly enabled it in the lobby
        if (video || audio) {
          getMedia();
        } else {
          // Start with black screen if both are disabled
          const blackSilence = new MediaStream([
            createBlackVideoTrack(),
            createSilentAudioTrack(),
          ]);
          window.localStream = blackSilence;
          localVideoref.current.srcObject = blackSilence;
        }

        setIsJoining(false);
      }, 1500);
    }
  };

  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
  };

  const toggleVideo = () => {
    setVideo(!video);
    if (video) {
      displayNotification("Camera turned off", "info");
    } else {
      displayNotification("Camera turned on", "success");
    }
  };

  const toggleAudio = () => {
    setAudio(!audio);
    if (audio) {
      displayNotification("Microphone muted", "info");
    } else {
      displayNotification("Microphone unmuted", "success");
    }
  };

  const toggleScreenShare = () => {
    setScreen(!screen);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    if (!showChat) setNewMessages(0);
  };

  const endCall = () => {
    displayNotification("Leaving meeting...", "warning");
    setTimeout(() => {
      stopLocalStream();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      navigate("/home");;
    }, 1000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
        displayNotification("Could not enter fullscreen mode", "error");
      });
      setIsFullscreen(true);
      displayNotification("Entered fullscreen mode", "info");
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
        displayNotification("Exited fullscreen mode", "info");
      }
    }
  };

  const getGridClass = () => {
    const count = videos.length + 1; // +1 for local video
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2 grid-rows-2";
    if (count <= 6) return "grid-cols-3 grid-rows-2";
    if (count <= 9) return "grid-cols-3 grid-rows-3";
    return "grid-cols-4 grid-rows-3";
  };

  const formatTime = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>
      </motion.div>

      {askForUsername ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-full space-y-6 p-4 z-10"
        >
          <motion.div
            variants={slideDown}
            initial="hidden"
            animate="visible"
            className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md backdrop-filter backdrop-blur-lg bg-opacity-90 border border-gray-700"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
              className="text-3xl font-bold text-white mb-6 text-center"
            >
              Join the Meeting
            </motion.h2>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6 relative"
            >
              <motion.div
                className="absolute inset-0 bg-blue-500 rounded-lg opacity-10 filter blur-md"
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(59, 130, 246, 0)",
                    "0 0 15px rgba(59, 130, 246, 0.8)",
                    "0 0 0 rgba(59, 130, 246, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <video
                ref={localVideoref}
                autoPlay
                muted
                className="w-full h-48 bg-black rounded-lg mb-4 object-cover"
              />
            </motion.div>

            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <label className="block text-gray-300 mb-2 font-medium">
                Your Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && connect()}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </motion.div>

            {/* In the lobby component */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex justify-center space-x-3 mb-6"
            >
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => {
                  setVideo(!video);
                  if (!video) {
                    displayNotification(
                      "Camera will be on when joining",
                      "info"
                    );
                  }
                }}
                className={`p-3 rounded-full flex items-center justify-center ${
                  video
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-700 hover:bg-gray-600"
                } transition duration-200`}
              >
                {video ? <VideocamIcon /> : <VideocamOffIcon />}
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => {
                  setAudio(!audio);
                  if (!audio) {
                    displayNotification(
                      "Microphone will be on when joining",
                      "info"
                    );
                  }
                }}
                className={`p-3 rounded-full flex items-center justify-center ${
                  audio
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-700 hover:bg-gray-600"
                } transition duration-200`}
              >
                {audio ? <MicIcon /> : <MicOffIcon />}
              </motion.button>
            </motion.div>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={connect}
              disabled={!username.trim() || isJoining}
              className={`${
                !username.trim() || isJoining
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              } w-full py-3 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 flex items-center justify-center`}
            >
              {isJoining ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Joining...
                </span>
              ) : (
                "Join Meeting"
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      ) : (
        <div className="flex h-screen">
          {/* Main Video Area */}
          <div
            className={`flex-1 relative ${
              showChat ? "pr-100" : ""
            } transition-all duration-300`}
          >
            {/* Connection Info */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`absolute top-0 left-0 m-4 z-10 bg-gray-800 bg-opacity-80 p-2 rounded-lg backdrop-filter backdrop-blur-sm ${
                showControls ? "opacity-100" : "opacity-0"
              } transition-opacity duration-300`}
            >
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                  <span>
                    {participants}{" "}
                    {participants === 1 ? "Participant" : "Participants"}
                  </span>
                </div>
                <span>|</span>
                <div>{formatDuration(callDuration)}</div>
              </div>
            </motion.div>

            {/* Videos Container */}
            <AnimatePresence>
              {mainViewMode === "grid" ? (
                <motion.div
                  className={`grid ${getGridClass()} gap-4 p-4 h-full`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Local Video */}
                  <motion.div
                    className={`relative ${
                      activeSpeaker === socketIdRef.current
                        ? "ring-4 ring-blue-500"
                        : ""
                    } rounded-xl overflow-hidden bg-gray-900`}
                    whileHover={{ scale: 1.02 }}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <video
                      ref={localVideoref}
                      autoPlay
                      muted
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute bottom-0 left-0 p-3 bg-gradient-to-t from-black to-transparent w-full">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-white font-medium">
                            {username} (You)
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Remote Videos */}
                  {videos.map((video) => (
                    <motion.div
                      key={video.socketId}
                      className={`relative ${
                        activeSpeaker === video.socketId
                          ? "ring-4 ring-blue-500"
                          : ""
                      } rounded-xl overflow-hidden bg-gray-900`}
                      whileHover={{ scale: 1.02 }}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <video
                        autoPlay
                        playsInline
                        ref={(ref) => {
                          if (ref && video.stream) {
                            // Log when attaching stream to video element
                            console.log(`Attaching stream to video element for ${video.socketId}`);
                            console.log(`Stream has ${video.stream.getTracks().length} tracks`);
                            
                            // Check if video is already playing
                            if (ref.srcObject !== video.stream) {
                              ref.srcObject = video.stream;
                              
                              // Force play the video
                              ref.play().catch(err => {
                                console.error(`Error playing video for ${video.socketId}:`, err);
                                // Try again after a short delay
                                setTimeout(() => {
                                  ref.play().catch(e => console.error('Second play attempt failed:', e));
                                }, 1000);
                              });
                            }
                          }
                        }}
                        className="w-full h-full object-cover rounded-xl"
                        onLoadedMetadata={(e) => {
                          console.log(`Video loaded for ${video.socketId}, dimensions: ${e.target.videoWidth}x${e.target.videoHeight}`);
                        }}
                      />
                      <div className="absolute bottom-0 left-0 p-3 bg-gradient-to-t from-black to-transparent w-full">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-white font-medium">
                              Participant {video.socketId.slice(0, 5)}
                            </span>
                          </div>
                          {connectionQuality[video.socketId] && (
                            <div className="text-xs text-gray-300">
                              {connectionQuality[video.socketId]}% quality
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : // Spotlight view would go here
              null}
            </AnimatePresence>
            
            {/* Controls */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-6 z-10"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  <div className="bg-gray-800 rounded-full shadow-xl p-2 flex items-center space-x-2">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      initial="inactive"
                      animate={video ? "inactive" : "hover"}
                      onClick={toggleVideo}
                      className={`p-3 rounded-full flex items-center justify-center ${
                        video
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-red-600 hover:bg-red-700"
                      } transition duration-200`}
                    >
                      {video ? <VideocamIcon /> : <VideocamOffIcon />}
                    </motion.button>

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      initial="inactive"
                      animate={audio ? "inactive" : "hover"}
                      onClick={toggleAudio}
                      className={`p-3 rounded-full flex items-center justify-center ${
                        audio
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-red-600 hover:bg-red-700"
                      } transition duration-200`}
                    >
                      {audio ? <MicIcon /> : <MicOffIcon />}
                    </motion.button>

                    {screenAvailable && (
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        initial="inactive"
                        animate={screen ? "hover" : "inactive"}
                        onClick={toggleScreenShare}
                        className={`p-3 rounded-full flex items-center justify-center ${
                          screen
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        } transition duration-200`}
                      >
                        {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                      </motion.button>
                    )}

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      initial="inactive"
                      animate={showChat ? "hover" : "inactive"}
                      onClick={toggleChat}
                      className={`p-3 rounded-full flex items-center justify-center ${
                        showChat
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      } transition duration-200 relative`}
                    >
                      <ChatIcon />
                      {newMessages > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {newMessages}
                        </span>
                      )}
                    </motion.button>

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      initial="inactive"
                      onClick={toggleFullscreen}
                      className="p-3 rounded-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                        />
                      </svg>
                    </motion.button>

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      initial="inactive"
                      onClick={endCall}
                      className="p-3 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 transition duration-200"
                    >
                      <CallEndIcon />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat Panel */}
          <AnimatePresence>
            {showChat && (
              <motion.div
                className="w-100 absolute right-0 top-0 bottom-0 bg-gray-800 border-l border-gray-700 flex flex-col z-20"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
              >
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">
                    Meeting Chat
                  </h2>
                  <button
                    onClick={toggleChat}
                    className="p-1 rounded-full hover:bg-gray-700 transition duration-200"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg max-w-[90%] ${
                        msg.sender === username
                          ? "ml-auto bg-blue-600 text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {msg.sender !== username && (
                        <div className="font-medium text-blue-300 mb-1">
                          {msg.sender}
                        </div>
                      )}
                      <div>{msg.data}</div>
                      <div className="text-xs opacity-70 mt-1 text-right">
                        {formatTime(msg.timestamp)}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-700">
                  <div className="relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 bg-gray-700 rounded-full text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                    />
                    <button
                      onClick={sendMessage}
                      className="absolute right-1 top-1 p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 5l7 7-7 7M5 12h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification */}
          <AnimatePresence>
            {showNotification && (
              <motion.div
                className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
                  notification.type === "success"
                    ? "bg-green-600"
                    : notification.type === "error"
                    ? "bg-red-600"
                    : notification.type === "warning"
                    ? "bg-yellow-600"
                    : "bg-blue-600"
                }`}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <div className="flex items-center text-white">
                  {notification.type === "success" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {notification.type === "error" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  {notification.type === "warning" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  )}
                  {notification.type === "info" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  <span>{notification.message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default VideoMeet;
