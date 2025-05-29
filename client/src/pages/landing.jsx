import React from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
  FiVideo,
  FiPhone,
  FiShare2,
  FiMic,
  FiUsers,
  FiCalendar,
  FiMessageSquare,
  FiSettings,
  FiArrowRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const FeatureCard = ({ icon, title, description, delay }) => {
  const controls = useAnimation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, type: "spring", damping: 10 }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
      onHoverStart={() => controls.start("hover")}
      onHoverEnd={() => controls.start("rest")}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 relative overflow-hidden"
    >
      <motion.div
        initial={{ scale: 1 }}
        variants={{
          hover: { scale: 1.1 },
          rest: { scale: 1 },
        }}
        animate={controls}
        className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>

      <motion.div
        variants={{
          hover: { opacity: 1, x: 0 },
          rest: { opacity: 0, x: -20 },
        }}
        animate={controls}
        transition={{ duration: 0.3 }}
        className="absolute bottom-4 right-4 text-indigo-600"
      >
        <FiArrowRight />
      </motion.div>

      <motion.div
        variants={{
          hover: { opacity: 0.05, scale: 1 },
          rest: { opacity: 0, scale: 0.8 },
        }}
        animate={controls}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-indigo-100 rounded-xl"
      />
    </motion.div>
  );
};

const Participant = ({ name, isYou, index }) => {
  const controls = useAnimation();
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 2000 + Math.random() * 3000);
      }
    }, 5000 + Math.random() * 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => controls.start("hover")}
      onHoverEnd={() => controls.start("rest")}
      className={`aspect-video rounded-lg flex items-center justify-center relative ${
        isYou
          ? "bg-indigo-100 border-2 border-indigo-300"
          : "bg-white border border-gray-200"
      }`}
    >
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-lg bg-indigo-300"
          />
        )}
      </AnimatePresence>

      <motion.div
        variants={{
          hover: { scale: 1.1 },
          rest: { scale: 1 },
        }}
        animate={controls}
        className={`text-center ${isYou ? "text-indigo-700" : "text-gray-600"}`}
      >
        <div className="text-sm font-medium">{isYou ? "You" : name}</div>
      </motion.div>

      <motion.div
        variants={{
          hover: { opacity: 1, y: 0 },
          rest: { opacity: 0, y: 10 },
        }}
        animate={controls}
        transition={{ duration: 0.3 }}
        className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-green-500 border border-white"
      />
    </motion.div>
  );
};

export default function Landing() {
  const controls = useAnimation();
  const [meetingActive, setMeetingActive] = React.useState(true);
  const [authChecked, setAuthChecked] = React.useState(false); // New state

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setAuthChecked(true); // Mark auth check as complete

    const sequence = async () => {
      await controls.start({
        boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.3)",
        transition: { duration: 0.5 },
      });
      await controls.start({
        boxShadow: "0 4px 14px -2px rgba(79, 70, 229, 0.3)",
        transition: { duration: 0.3 },
      });
    };

    sequence();

    const interval = setInterval(() => {
      setMeetingActive((prev) => !prev);
    }, 8000);

    return () => clearInterval(interval);
  }, [controls]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    // Optional: redirect to home after logout
    window.location.reload();
  };

  // Don't render auth-dependent UI until we've checked auth state
  if (!authChecked) {
    return null; // Or return a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: Math.random() * 100,
              x: Math.random() * 100,
              opacity: 0.2 + Math.random() * 0.3,
              scale: 0.5 + Math.random(),
            }}
            animate={{
              y: [null, (Math.random() - 0.5) * 40, 0],
              x: [null, (Math.random() - 0.5) * 40, 0],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-blue-100"
            style={{
              width: `${10 + Math.random() * 30}px`,
              height: `${10 + Math.random() * 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="flex items-center"
          >
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold mr-2"
            >
              M
            </motion.div>
            <motion.span className="text-xl font-bold text-gray-900">
              MeetConnect
            </motion.span>
          </motion.div>

          <motion.div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <Link to="/auth">Already have an account ?</Link>
                </motion.button>
                <Link
                  to="/auth"
                  state={{ activeTab: "register" }}
                  className="inline-block"
                >
                  <motion.button
                    initial={{
                      boxShadow: "0 4px 14px -2px rgba(79, 70, 229, 0.3)",
                    }}
                    animate={controls}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Get started
                  </motion.button>
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="mb-6"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block w-2 h-2 rounded-full bg-indigo-600 mr-2"
                  />
                  Now with AI meeting summaries
                </motion.span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
                className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
              >
                Meetings made{" "}
                <motion.span
                  className="relative inline-block"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <span className="relative z-10">simple</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                    className="absolute bottom-1 left-0 w-full h-3 bg-indigo-200 opacity-70 -z-0"
                    style={{ originX: 0 }}
                  />
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="text-lg text-gray-600 mb-8 max-w-lg"
              >
                Connect with your team through crystal-clear video, powerful
                collaboration tools, and enterprise-grade security.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <Link to="/home" className="block">
                  <motion.button
                    initial={{ opacity: 0.95 }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "#4f46e5", // indigo-600
                      boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)",
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{
                      scale: 0.98,
                      boxShadow: "0 5px 15px -5px rgba(79, 70, 229, 0.3)",
                      transition: { duration: 0.1 },
                    }}
                    whileFocus={{
                      scale: 1.03,
                      boxShadow: "0 0 0 3px rgba(199, 210, 254, 0.5)", // indigo-200 with opacity
                    }}
                    className={`
    flex items-center justify-center 
    px-6 py-3 
    bg-indigo-600 hover:bg-indigo-700 
    text-white text-sm md:text-base
    rounded-lg font-medium
    shadow-md
    transition-all duration-200
    focus:outline-none focus:ring-4 focus:ring-indigo-300
  `}
                  >
                    <motion.div
                      whileHover={{ rotate: 5, transition: { duration: 0.3 } }}
                      className="mr-2"
                    >
                      <FiVideo className="w-5 h-5" />
                    </motion.div>
                    Start a meeting
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{
                    scale: 1.03,
                    backgroundColor: "#f9fafb",
                  }}
                  whileFocus={{
                    scale: 1.03,
                    boxShadow: "0 0 0 3px rgba(156, 163, 175, 0.5)", // gray-300 with opacity
                  }}
                  initial={{ opacity: 0.95 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium"
                >
                  <FiUsers className="mr-2" />
                  Join a meeting
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 flex items-center"
              >
                <motion.div
                  className="flex -space-x-2 mr-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {[1, 2, 3].map((item) => (
                    <motion.img
                      key={item}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.1 * item + 0.6,
                      }}
                      className="w-10 h-10 rounded-full border-2 border-white"
                      src={`https://randomuser.me/api/portraits/${
                        item % 2 === 0 ? "women" : "men"
                      }/${item + 20}.jpg`}
                      alt="User"
                    />
                  ))}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-sm text-gray-600"
                >
                  Trusted by <span className="font-medium">10,000+</span> teams
                  worldwide
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
              className="mt-16 lg:mt-0"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
                <div className="relative p-1">
                  <div className="bg-white rounded-xl overflow-hidden">
                    {/* Meeting header */}
                    <div className="bg-gray-900 p-3 flex items-center justify-between">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                      <motion.div
                        animate={{
                          opacity: meetingActive ? 1 : 0.5,
                          color: meetingActive ? "#d1d5db" : "#6b7280",
                        }}
                        transition={{ duration: 0.3 }}
                        className="text-xs text-gray-300"
                      >
                        {meetingActive
                          ? "meeting.connect/team-standup"
                          : "Meeting ended"}
                      </motion.div>
                      <div className="w-6"></div>
                    </div>

                    {/* Video grid */}
                    <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50">
                      <Participant name="Sarah" index={0} />
                      <Participant name="Alex" index={1} />
                      <Participant name="Jamie" index={2} />
                      <Participant name="You" isYou index={3} />
                    </div>

                    {/* Improved Controls */}
                    <div className="bg-white p-4 border-t border-gray-200">
                      <div className="flex justify-center space-x-4">
                        <motion.button
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "#f3f4f6",
                          }}
                          whileTap={{ scale: 0.9 }}
                          className="relative group"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                            <FiMic className="w-5 h-5" />
                          </div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap"
                          >
                            Mute
                          </motion.div>
                        </motion.button>

                        <motion.button
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "#f3f4f6",
                          }}
                          whileTap={{ scale: 0.9 }}
                          className="relative group"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                            <FiVideo className="w-5 h-5" />
                          </div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap"
                          >
                            Video
                          </motion.div>
                        </motion.button>

                        <motion.button
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "#f3f4f6",
                          }}
                          whileTap={{ scale: 0.9 }}
                          className="relative group"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                            <FiShare2 className="w-5 h-5" />
                          </div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap"
                          >
                            Share
                          </motion.div>
                        </motion.button>

                        <motion.button
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "#ef4444",
                            color: "white",
                          }}
                          whileTap={{ scale: 0.9 }}
                          className="relative group"
                        >
                          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
                            <FiPhone className="w-5 h-5" />
                          </div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap"
                          >
                            Leave
                          </motion.div>
                        </motion.button>
                      </div>

                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: meetingActive ? "100%" : "30%" }}
                        transition={{ duration: 8, ease: "linear" }}
                        className="mt-3 h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
