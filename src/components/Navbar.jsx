import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BrandLogo = () => (
  <Link to="/" className="relative group">
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative"
    >
      {/* Glow Background */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blush via-softBrown to-sage rounded-lg opacity-0 group-hover:opacity-50 blur-xl transition duration-500" />
      
      {/* Main Text with Gradient */}
      <div className="relative bg-gradient-to-r from-[#c5817c] via-[#8b7355] to-[#a8a890] bg-clip-text text-transparent font-display text-2xl font-bold tracking-wider">
        {/* Animated sparkles */}
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-1 -right-2 text-lg"
        >
          ✨
        </motion.span>
        Gayatri's Cozy Corner
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          className="absolute -bottom-1 -left-2 text-lg"
        >
          ✨
        </motion.span>
      </div>
    </motion.div>
  </Link>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Skincare', path: '/skincare' },
    { name: 'Fashion', path: '/fashion' },
    { name: 'Lifestyle', path: '/lifestyle' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const linkVariants = {
    initial: { y: 0 },
    hover: { y: -3, transition: { duration: 0.2 } },
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-cream/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <BrandLogo />
          
          <div className="hidden md:flex space-x-8">
            {links.map(link => (
              <motion.div key={link.name} variants={linkVariants} initial="initial" whileHover="hover">
                <NavLink
                  to={link.path}
                  className={({isActive}) => `text-sm font-medium transition-colors relative ${
                    isActive 
                      ? 'text-softBrown font-semibold' 
                      : 'text-dark hover:text-softBrown'
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blush after:to-softBrown hover:after:w-full after:transition-all after:duration-300`}
                >
                  {link.name}
                </NavLink>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-dark"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="md:hidden bg-cream/95 backdrop-blur-sm border-t border-sage/30 px-4 py-4 space-y-4 overflow-hidden"
          >
            {links.map((link, idx) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <NavLink
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({isActive}) => `block text-base font-medium transition-colors ${
                    isActive 
                      ? 'text-softBrown font-semibold pl-4 border-l-2 border-softBrown' 
                      : 'text-dark hover:text-softBrown hover:pl-2'
                  }`}
                >
                  {link.name}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}