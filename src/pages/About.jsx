import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-surface py-20 overflow-hidden relative transition-colors duration-300">
      {/* Aesthetic Background Blobs */}
      <div className="absolute top-0 right-[-10%] w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>
      <div className="absolute top-40 left-[-10%] w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* Profile Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 flex justify-center"
          >
            <div className="relative">
              {/* Outer decorative ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-accent to-accent-hover rounded-full blur-xl opacity-40 transform scale-105"></div>
              {/* Image Container */}
              <div className="w-72 h-72 md:w-96 md:h-[450px] rounded-[30%] border-4 border-surface-hover shadow-2xl overflow-hidden bg-surface-hover relative z-10">
                {/* 
                  TODO: Save your cute image as "profile.png" inside the "public" folder of your project, 
                  then it will automatically show up here! 
                */}
                <img 
                  src="/profile.png" 
                  alt="Gayatri" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback visually if image is missing
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="flex h-full items-center justify-center text-secondary font-display italic text-center p-6">Save your image as <br/>"profile.png"<br/> in "public" folder</div>';
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 text-5xl animate-bounce">✨</div>
            </div>
          </motion.div>

          {/* Text Content Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 text-center md:text-left"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
              Welcome to my <span className="text-accent italic">aesthetic</span> little world! ✨
            </h1>
            
            <p className="font-body text-lg text-secondary leading-relaxed mb-6">
              I'm <span className="font-bold text-primary">Gayatri</span>, and I share everything that inspires me—fashion, skincare, beauty finds, cozy cafés, nature, and cute lifestyle content.
            </p>
            
            <p className="font-body text-lg text-secondary leading-relaxed mb-10">
              This space is filled with ideas, inspiration, and carefully curated favorites to help make your everyday life a little more beautiful.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="glass-panel p-4 text-center">
                <span className="text-2xl block mb-2">🌸</span>
                <span className="font-medium text-secondary text-sm">Skincare</span>
              </div>
              <div className="glass-panel p-4 text-center">
                <span className="text-2xl block mb-2">👗</span>
                <span className="font-medium text-secondary text-sm">Fashion</span>
              </div>
              <div className="glass-panel p-4 text-center">
                <span className="text-2xl block mb-2">☕</span>
                <span className="font-medium text-secondary text-sm">Lifestyle</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}