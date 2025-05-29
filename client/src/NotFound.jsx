import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotFound = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  const FloatingPortal = ({ delay, scale, rotation }) => (
    <motion.div
      className="absolute w-32 h-32 border-2 border-purple-400/30 rounded-full"
      style={{
        background: 'conic-gradient(from 0deg, transparent, rgba(147, 51, 234, 0.1), transparent)',
        backdropFilter: 'blur(10px)'
      }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{ 
        opacity: [0, 1, 0], 
        scale: [0, scale, 0], 
        rotate: rotation,
        x: [0, Math.random() * 200 - 100],
        y: [0, Math.random() * 200 - 100]
      }}
      transition={{ 
        duration: 8, 
        delay, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 animate-spin" />
    </motion.div>
  );

  const GlitchButton = ({ children, onClick }) => (
    <motion.button
      onClick={onClick}
      className="relative px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold text-lg overflow-hidden group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      {/* Glitch layers */}
      <motion.div
        className="absolute inset-0 text-red-400 opacity-0 group-hover:opacity-100 flex items-center justify-center"
        style={{ transform: 'translateX(2px)' }}
        animate={isHovering ? { 
          x: [0, 2, -1, 3, 0],
          opacity: [0, 0.7, 0.3, 0.8, 0]
        } : {}}
        transition={{ duration: 0.2, repeat: isHovering ? Infinity : 0 }}
      >
        {children}
      </motion.div>
      
      <motion.div
        className="absolute inset-0 text-blue-400 opacity-0 group-hover:opacity-100 flex items-center justify-center"
        style={{ transform: 'translateX(-2px)' }}
        animate={isHovering ? { 
          x: [0, -2, 1, -3, 0],
          opacity: [0, 0.5, 0.8, 0.4, 0]
        } : {}}
        transition={{ duration: 0.15, repeat: isHovering ? Infinity : 0 }}
      >
        {children}
      </motion.div>
      
      <span className="relative z-10">{children}</span>
      
      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent h-1"
        animate={isHovering ? { y: ['-100%', '100%'] } : {}}
        transition={{ duration: 1.5, repeat: isHovering ? Infinity : 0, ease: "linear" }}
      />
    </motion.button>
  );

  return (
    <div 
      className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, 
            rgba(59, 130, 246, 0.15) 0%, 
            rgba(147, 51, 234, 0.1) 35%, 
            rgba(236, 72, 153, 0.05) 70%, 
            transparent 100%)`
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />

      {/* Floating geometric portals */}
      {[...Array(6)].map((_, i) => (
        <FloatingPortal 
          key={i}
          delay={i * 1.2}
          scale={0.5 + Math.random() * 0.8}
          rotation={360 + i * 45}
        />
      ))}

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 opacity-60"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(particle.id) * 50, 0],
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Distortion grid */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `perspective(1000px) rotateX(45deg) translateZ(-100px)`
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px', '0px 0px']
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />

      {/* Neural network lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" style={{ zIndex: 1 }}>
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={i}
            x1={`${10 + i * 12}%`}
            y1="0%"
            x2={`${20 + i * 10}%`}
            y2="100%"
            stroke="url(#gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0], 
              opacity: [0, 0.6, 0] 
            }}
            transition={{ 
              duration: 3, 
              delay: i * 0.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        ))}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Glitch container for 404 */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.h1 
            className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 relative"
            style={{
              backgroundSize: '200% 200%'
            }}
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            404
            
            {/* Glitch overlay layers */}
            <motion.span
              className="absolute inset-0 text-red-400"
              style={{ 
                clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
                transform: 'translateX(3px)'
              }}
              animate={{
                transform: ['translateX(3px)', 'translateX(-2px)', 'translateX(3px)'],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              404
            </motion.span>
            
            <motion.span
              className="absolute inset-0 text-blue-400"
              style={{ 
                clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
                transform: 'translateX(-3px)'
              }}
              animate={{
                transform: ['translateX(-3px)', 'translateX(2px)', 'translateX(-3px)'],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: 2,
                delay: 0.1
              }}
            >
              404
            </motion.span>
          </motion.h1>
        </motion.div>
        
        <motion.div
          className="space-y-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Lost in the Digital Void
          </h2>
          <p className="text-xl text-gray-300 max-w-lg mx-auto leading-relaxed">
            You've drifted into uncharted digital space. The page you seek exists beyond this dimension.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <GlitchButton onClick={() => window.location.href = '/'}>
            RETURN TO REALITY
          </GlitchButton>
        </motion.div>

        {/* Additional floating elements */}
        <motion.div
          className="absolute -top-10 -right-10 w-6 h-6 bg-cyan-400 rounded-full opacity-60"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.6, 1, 0.6],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute -bottom-8 -left-8 w-4 h-4 bg-purple-400 rounded-full opacity-60"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Screen distortion effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          mixBlendMode: 'overlay'
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </div>
  );
};

export default NotFound;