import { motion } from 'framer-motion';

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative mt-20 py-16 pb-24 md:pb-16 overflow-hidden bg-surface-hover transition-colors duration-300"
    >
      {/* Decorative blobs */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Brand Name */}
          <motion.h2
            variants={itemVariants}
            className="font-display text-3xl font-bold mb-4 bg-gradient-to-r from-[#c5817c] via-[#8b7355] to-[#a8a890] bg-clip-text text-transparent"
          >
            Gayatri's Cozy Corner ✨
          </motion.h2>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="text-sm opacity-80 mb-6 text-secondary font-medium"
          >
            Your go-to place for skincare, fashion & lifestyle.
          </motion.p>

          {/* Social/Links Section (optional) */}
          <motion.div variants={itemVariants} className="mb-8 flex justify-center gap-6">
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="text-secondary hover:text-accent transition-colors"
            >
              Instagram
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="text-secondary hover:text-accent transition-colors"
            >
              Pinterest
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="text-secondary hover:text-accent transition-colors"
            >
              Email
            </motion.a>
          </motion.div>

          {/* Copyright */}
          <motion.p
            variants={itemVariants}
            className="text-xs opacity-60 text-secondary"
          >
            &copy; {new Date().getFullYear()} Gayatri's Cozy Corner. Made with ❤️ for your lifestyle.
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
}