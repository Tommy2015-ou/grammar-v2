import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Circle } from 'lucide-react';

interface Bubble {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

export const SeaBubbles: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 20,
      size: 2 + Math.random() * 8,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#000814]">
      {/* Deep Sea Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#001d3d] via-[#000814] to-black" />
      
      {/* Light Rays / Caustics Effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#00b4d8_0%,transparent_70%)] animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      <AnimatePresence>
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            initial={{ y: '110vh', opacity: 0 }}
            animate={{ 
              y: '-10vh', 
              opacity: [0, 0.3, 0.3, 0],
              x: [0, Math.sin(bubble.id) * 30, 0]
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              delay: bubble.delay,
              ease: "linear"
            }}
            style={{
              left: `${bubble.x}%`,
              position: 'absolute',
            }}
          >
            <div 
              style={{ width: bubble.size, height: bubble.size }}
              className="rounded-full border border-cyan-500/20 bg-white/5 blur-[0.5px]" 
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Background Text - Very Subtle */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none">
        <h1 className="text-7xl md:text-[12rem] font-black text-cyan-50 rotate-[-10deg] whitespace-nowrap tracking-tighter">
          汤小米陪你提升语法
        </h1>
      </div>
    </div>
  );
};
