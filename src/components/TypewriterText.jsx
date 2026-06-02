import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TypewriterText() {
  const fullText = "Welcome to Gayatri's Cozy Corner";
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 80); // Speed of typing

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative inline-block">
      <h1 className="font-display text-5xl md:text-7xl font-bold text-dark tracking-tight mb-6">
        <span className="bg-gradient-to-r from-[#c5817c] via-[#8b7355] to-[#a8a890] bg-clip-text text-transparent">
          {displayedText}
        </span>
        {!isComplete && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block ml-1 w-1 h-12 md:h-20 bg-softBrown"
          />
        )}
      </h1>
    </div>
  );
}
