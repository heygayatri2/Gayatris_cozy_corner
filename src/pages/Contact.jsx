import { Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const contactEmail = 'gayatrimodak07@gmail.com';
  const pinterestLink = 'https://pin.it/4AsqWmDsn';

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface via-surface to-accent/10 py-20 relative overflow-hidden transition-colors duration-300">
      {/* Animated background elements */}
      <motion.div
        animate={{ y: [0, -40, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-10 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 40, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 12, repeat: Infinity, delay: 1 }}
        className="absolute bottom-20 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="font-display text-5xl md:text-6xl font-bold text-primary mb-6">
            We'd Love to Hear From You
          </h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Reach out and let's connect! Have questions, collaboration ideas, or just want to chat? 
            <span className="block text-accent font-semibold mt-2">We're always here to listen.</span>
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
          
          {/* Left side - Owner Photo with Enhanced Effects */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-start h-full"
          >
            {/* Photo Frame - Beautiful Rectangular with Enhanced Effects */}
            <div className="w-full max-w-sm">
              {/* Outer decorative frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, type: "spring", stiffness: 100 }}
                className="relative group"
              >
                {/* Enhanced multiple glowing border layers - more vibrant */}
                <motion.div 
                  animate={{ 
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, type: "easeInOut" }}
                  className="absolute -inset-4 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 rounded-2xl blur-3xl opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <motion.div 
                  animate={{ 
                    opacity: [0.5, 0.9, 0.5],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 4.5, repeat: Infinity, delay: 0.3, type: "easeInOut" }}
                  className="absolute -inset-3 bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 rounded-2xl blur-2xl opacity-75"
                />
                <motion.div 
                  animate={{ 
                    opacity: [0.6, 1, 0.6],
                    scale: [0.95, 1.08, 0.95]
                  }}
                  transition={{ duration: 5.5, repeat: Infinity, delay: 0.6, type: "easeInOut" }}
                  className="absolute -inset-2 bg-gradient-to-r from-pink-200 via-rose-100 to-pink-200 rounded-2xl blur-xl opacity-60"
                />
                <motion.div 
                  className="absolute -inset-1.5 bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 rounded-2xl blur-lg opacity-50"
                />
                
                {/* Main frame container with beautiful baby pink */}
                <motion.div 
                  whileHover={{ 
                    boxShadow: "0 30px 60px rgba(236, 72, 153, 0.4), 0 0 60px rgba(251, 113, 133, 0.3)"
                  }}
                  transition={{ duration: 0.4 }}
                  className="relative bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 rounded-2xl overflow-hidden shadow-2xl border-8 border-pink-200 backdrop-blur-sm cursor-pointer"
                >
                  {/* Decorative inner frame border */}
                  <div className="absolute inset-0 rounded-2xl border-4 border-pink-100/50 pointer-events-none" style={{ inset: '8px' }} />
                  
                  {/* Image container with glow effects */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2 }}
                    className="aspect-[3/4] bg-gradient-to-br from-pink-100/60 via-rose-50/40 to-pink-100/60 flex items-center justify-center relative group overflow-hidden"
                  >
                    {/* Animated light sweep effect */}
                    <motion.div 
                      animate={{ 
                        opacity: [0, 0.5, 0],
                        x: [-100, 400]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                    />

                    {/* Pulsing radial glow - baby pink */}
                    <motion.div 
                      animate={{ 
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-radial from-pink-300/40 via-transparent to-transparent rounded-full"
                    />
                    
                    {/* Owner image */}
                    <motion.img 
                      src="/owner-placeholder.png" 
                      alt="Gayatri" 
                      className="w-full h-full object-cover relative z-10"
                      transition={{ duration: 0.4 }}
                    />
                    
                    {/* Soft overlay with baby pink tint */}
                    <motion.div 
                      animate={{ 
                        opacity: [0.05, 0.15, 0.05]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-t from-pink-300/20 via-transparent to-rose-200/10 z-20"
                    />

                    {/* Corner accent lights - soft baby pink */}
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                      className="absolute top-4 right-4 w-16 h-16 bg-pink-300/40 rounded-full blur-2xl"
                    />
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                      className="absolute bottom-4 left-4 w-16 h-16 bg-rose-300/40 rounded-full blur-2xl"
                    />
                  </motion.div>

                  {/* Name below photo */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="p-6 text-center bg-gradient-to-r from-pink-100/70 via-rose-50/70 to-pink-100/70 border-t-2 border-pink-200"
                  >
                    <motion.h3 
                      whileHover={{ scale: 1.05 }}
                      className="font-display text-2xl font-bold text-gray-800"
                    >
                      Gayatri
                    </motion.h3>
                    <motion.p 
                      whileHover={{ scale: 1.05 }}
                      className="text-sm text-pink-600 font-semibold"
                    >
                      & Team
                    </motion.p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Info Text & Contact Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8 h-full"
          >
            {/* Info Text - Above Contact Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 80 }}
              whileHover={{ 
                boxShadow: "0 20px 40px rgba(197, 129, 124, 0.25)",
                y: -5,
                scale: 1.02
              }}
              className="glass-panel p-10 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="text-3xl font-display font-bold text-primary mb-6 text-center transition-colors group-hover:text-accent"
              >
                Welcome to Our 
                <span className="block text-accent">Cozy Corner</span>
              </motion.h3>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-secondary leading-relaxed text-lg mb-6 font-body text-center"
              >
                We welcome your inquiries and are always here to assist you. Whether you have questions about our services, need support, or want to discuss your requirements, feel free to get in touch with us. Our team will respond promptly and ensure you receive the best possible assistance.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                className="text-center text-base text-accent font-display font-semibold italic transition-all"
              >
                ~ Gayatri and team
              </motion.div>
            </motion.div>

            {/* Contact Us Button */}
            <motion.a
              href={`mailto:${contactEmail}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95, y: 0 }}
              className="group relative overflow-hidden"
            >
              <motion.div 
                animate={{ 
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -inset-1 bg-gradient-to-r from-accent to-accent-hover rounded-2xl blur-lg opacity-75 group-hover:opacity-100"
              />
              
              <motion.div 
                className="relative px-8 py-6 glass-panel flex items-center justify-center gap-4 hover:shadow-2xl transition-all duration-300"
                whileHover={{ boxShadow: "0 25px 50px rgba(197, 129, 124, 0.35)" }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Mail size={32} className="text-accent" />
                </motion.div>
                <div className="text-left">
                  <h3 className="font-display text-2xl font-bold text-primary group-hover:text-accent transition-colors">Contact Us</h3>
                  <p className="text-sm text-secondary">{contactEmail}</p>
                </div>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-accent"
                >
                  <ArrowRight size={24} className="text-accent opacity-70 group-hover:opacity-100 transition-all" />
                </motion.div>
              </motion.div>
            </motion.a>

            {/* Pinterest Button */}
            <motion.a
              href={pinterestLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95, y: 0 }}
              className="group relative overflow-hidden"
            >
              <motion.div 
                animate={{ 
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3.2, repeat: Infinity, delay: 0.5 }}
                className="absolute -inset-1 bg-gradient-to-r from-sage to-blush rounded-2xl blur-lg opacity-75 group-hover:opacity-100"
              />
              
              <motion.div 
                className="relative px-8 py-6 bg-white rounded-2xl flex items-center justify-center gap-4 hover:shadow-2xl transition-all duration-300"
                whileHover={{ boxShadow: "0 25px 50px rgba(230, 0, 35, 0.25)" }}
              >
                {/* Pinterest Logo */}
                <motion.svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="text-[#E60023]"
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <circle cx="12" cy="12" r="10" fill="white" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M8 12c0 2.2 1.8 4 4 4s4-1.8 4-4-1.8-4-4-4-4 1.8-4 4z" fill="currentColor" />
                  <path d="M12 6v2m0 8v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </motion.svg>
                
                <div className="text-left">
                  <h3 className="font-display text-2xl font-bold text-dark group-hover:text-[#E60023] transition-colors">Follow on Pinterest</h3>
                  <p className="text-sm text-dark/60">Discover our latest inspirations</p>
                </div>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="text-[#E60023]"
                >
                  <ArrowRight size={24} className="text-[#E60023] opacity-70 group-hover:opacity-100 transition-all" />
                </motion.div>
              </motion.div>
            </motion.a>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -8,
                  boxShadow: "0 20px 40px rgba(197, 129, 124, 0.25)"
                }}
                whileTap={{ scale: 0.95 }}
                className="glass-panel p-6 text-center hover:shadow-lg transition-all cursor-pointer"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="text-4xl mb-3"
                >
                  💌
                </motion.div>
                <p className="text-sm font-semibold text-primary">Quick Response</p>
                <p className="text-xs text-secondary mt-1">We reply promptly</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -8,
                  boxShadow: "0 20px 40px rgba(197, 129, 124, 0.25)"
                }}
                whileTap={{ scale: 0.95 }}
                className="glass-panel p-6 text-center hover:shadow-lg transition-all cursor-pointer"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                  className="text-4xl mb-3"
                >
                  🤝
                </motion.div>
                <p className="text-sm font-semibold text-primary">Always Here</p>
                <p className="text-xs text-secondary mt-1">To assist you</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Decorative Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center py-12 border-t border-border"
        >
          <div className="inline-block">
            <p className="text-secondary text-lg mb-4">
              <span className="text-3xl">✨</span> Thank you for being part of our journey
            </p>
            <div className="flex justify-center gap-6 mt-6">
              <motion.span
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl"
              >
                🌸
              </motion.span>
              <motion.span
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                className="text-3xl"
              >
                ☕
              </motion.span>
              <motion.span
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                className="text-3xl"
              >
                👗
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}