import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../contexts/AuthContext";
import { useLocation } from 'react-router-dom';


const Authentication = () => {
  const { handleRegister, handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [authState, setAuthState] = useState(
    location.state?.activeTab || "login" // Use the state from navigation or default to login
  );

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    if (authState === "login") {
      if (!formData.username.trim()) {
        toast.error("Username is required");
        return false;
      }
      if (!formData.password) {
        toast.error("Password is required");
        return false;
      }
    } else if (authState === "register") {
      if (!formData.name.trim()) {
        toast.error("Full name is required");
        return false;
      }
      if (!formData.username.trim()) {
        toast.error("Username is required");
        return false;
      }
      if (!formData.email.trim()) {
        toast.error("Email is required");
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error("Email is invalid");
        return false;
      }
      if (!formData.password) {
        toast.error("Password is required");
        return false;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }
    } else if (authState === "forgot") {
      if (!formData.email.trim()) {
        toast.error("Email is required");
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error("Email is invalid");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (authState === "login") {
        // Get the redirect path from location state if it exists
        const from = location.state?.from?.pathname || null;
        await handleLogin(formData.username, formData.password, from);
        toast.success(`Welcome back, ${formData.username}!`);
      } else if (authState === "register") {
        await handleRegister(
          formData.name,
          formData.username,
          formData.password,
          formData.email
        );
        toast.success("Account created successfully!");
        setTimeout(() => {
          setAuthState("login");
          setFormData({
            username: "",
            email: "",
            password: "",
            name: "",
          });
        }, 2000);
      } else if (authState === "forgot") {
        // Handle forgot password logic here
        toast.success("Password reset link sent! Please check your email.");
        setTimeout(() => {
          setAuthState("login");
          setFormData({
            username: "",
            email: "",
            password: "",
            name: "",
          });
        }, 2000);
      }
    } catch (error) {
      // Specific error handling
      switch (error.message) {
        case "Username already exists":
          toast.error("Username is already taken");
          break;
        case "Email already exists":
          toast.error("Email is already registered");
          break;
        case "Invalid credentials":
          toast.error("Incorrect username or password");
          break;
        default:
          toast.error(error.message || "An error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const transition = {
    type: "spring",
    damping: 20,
    stiffness: 300,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: Math.random() * 100,
              x: Math.random() * 100,
              opacity: 0.1 + Math.random() * 0.2,
              scale: 0.5 + Math.random(),
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 40],
              x: [0, (Math.random() - 0.5) * 40],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-indigo-200"
            style={{
              width: `${20 + Math.random() * 50}px`,
              height: `${20 + Math.random() * 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        {/* Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          whileHover={{ y: -5 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
            <motion.div
              key={`header-${authState}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center"
            >
              {authState !== "login" && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAuthState("login")}
                  className="mr-4"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </motion.button>
              )}
              <h1 className="text-2xl font-bold">
                {authState === "login" && "Welcome Back"}
                {authState === "register" && "Create Account"}
                {authState === "forgot" && "Reset Password"}
              </h1>
            </motion.div>
            <motion.p
              key={`subheader-${authState}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-2 opacity-90"
            >
              {authState === "login" && "Sign in to continue to your account"}
              {authState === "register" && "Join us today to get started"}
              {authState === "forgot" &&
                "Enter your email to reset your password"}
            </motion.p>
          </div>

          {/* Form */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.form
                key={authState}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                transition={transition}
                onSubmit={handleSubmit}
              >
                {authState === "login" && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Username
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="username"
                        />
                      </motion.div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 mb-2">
                        Password
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                          ) : (
                            <FiEye className="text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </motion.div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setAuthState("forgot")}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        Forgot password?
                      </motion.button>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 4px 14px -2px rgba(79, 70, 229, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-lg font-medium shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Processing..." : "Sign In"}
                    </motion.button>

                    <div className="mt-6 text-center">
                      <span className="text-gray-600">
                        Don't have an account?{" "}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setAuthState("register")}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Sign up
                      </motion.button>
                    </div>
                  </>
                )}

                {authState === "register" && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Full Name
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </motion.div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Username
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="johndoe"
                        />
                      </motion.div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Email</label>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </motion.div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 mb-2">
                        Password
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                          ) : (
                            <FiEye className="text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </motion.div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 4px 14px -2px rgba(79, 70, 229, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-lg font-medium shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Creating Account..." : "Create Account"}
                    </motion.button>

                    <div className="mt-6 text-center">
                      <span className="text-gray-600">
                        Already have an account?{" "}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setAuthState("login")}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Sign in
                      </motion.button>
                    </div>
                  </>
                )}

                {authState === "forgot" && (
                  <>
                    <div className="mb-6">
                      <label className="block text-gray-700 mb-2">Email</label>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </motion.div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 4px 14px -2px rgba(79, 70, 229, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-lg font-medium shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Reset Password"}
                    </motion.button>

                    <div className="mt-6 text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setAuthState("login")}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Back to sign in
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.form>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-gray-600 text-sm"
        >
          © {new Date().getFullYear()} MeetConnect. All rights reserved.
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Authentication;
