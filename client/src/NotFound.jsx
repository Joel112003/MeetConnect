import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NotFound = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Handle mouse movement for interactive elements
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  // Generate animated shapes
  const AnimatedShape = ({ delay, size, duration, positionClass }) => (
    <motion.div
      className={`absolute ${positionClass} rounded-full bg-gray-200`}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.7, 0],
        scale: [0, 1, 0],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );

  // Animated button component
  const AnimatedButton = ({ children, onClick }) => (
    <motion.button
      onClick={onClick}
      className="relative px-8 py-3 bg-white border-2 border-black text-black font-bold text-lg overflow-hidden group"
      whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <motion.div
        className="absolute inset-0 bg-gray-100"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      
      {/* Animated underline */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );

  return (
    <div 
      className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* Subtle pattern overlay */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, 
            rgba(0, 0, 0, 0.1) 0%, 
            rgba(0, 0, 0, 0.05) 35%, 
            transparent 70%)`
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
      />

      {/* Animated background shapes */}
      {[...Array(12)].map((_, i) => (
        <AnimatedShape 
          key={i}
          delay={i * 0.5}
          size={10 + Math.random() * 30}
          duration={5 + Math.random() * 5}
          positionClass={`
            top-[${Math.random() * 100}%] 
            left-[${Math.random() * 100}%]
          `}
        />
      ))}

      {/* Grid pattern */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px', '0px 0px']
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* 404 heading with animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <motion.h1 
            className="text-9xl font-black text-black relative"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 1, 0, -1, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          >
            404
            
            {/* Shadow layer */}
            <motion.span
              className="absolute inset-0 text-gray-200 -z-10"
              style={{ transform: 'translateY(4px) translateX(4px)' }}
              animate={{
                y: [4, 6, 4],
                x: [4, 6, 4]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              404
            </motion.span>
          </motion.h1>
        </motion.div>
        
        {/* Description text with staggered animation */}
        <motion.div
          className="space-y-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.h2 
            className="text-4xl font-bold text-black mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Page Not Found
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-700 max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
        </motion.div>

        {/* Button with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <AnimatedButton onClick={() => window.location.href = '/'}>
            Return Home
          </AnimatedButton>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-20 right-20 w-20 h-1 bg-black rounded-full"
          animate={{
            rotate: [0, 90, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        <motion.div
          className="absolute bottom-20 left-20 w-20 h-1 bg-black rounded-full"
          animate={{
            rotate: [0, -90, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
        
        {/* Animated circles */}
        <motion.div
          className="absolute top-40 left-1/4 w-4 h-4 rounded-full bg-black opacity-20"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        <motion.div
          className="absolute bottom-40 right-1/4 w-6 h-6 rounded-full bg-black opacity-20"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
        />
      </div>
    </div>
  );
};

export default NotFound;