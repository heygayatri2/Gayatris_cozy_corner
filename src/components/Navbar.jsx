import { Link, NavLink } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const BrandLogo = () => (
  <Link to="/" className="relative group flex items-center gap-3">
    <img src="/logo.png" alt="Gayatri's Cozy Corner Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover bg-white shadow-sm" />
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative"
    >
      {/* Glow Background */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blush via-softBrown to-sage rounded-lg opacity-0 group-hover:opacity-50 blur-xl transition duration-500" />
      
      {/* Main Text with Gradient */}
      <div className="relative bg-gradient-to-r from-[#c5817c] via-[#8b7355] to-[#a8a890] bg-clip-text text-transparent font-display text-lg sm:text-xl md:text-2xl font-bold tracking-wider">
        {/* Animated sparkles */}
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-1 -right-2 text-sm md:text-lg"
        >
          ✨
        </motion.span>
        Gayatri's Cozy Corner
      </div>
    </motion.div>
  </Link>
);

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
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
    { name: 'Shop', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const linkVariants = {
    initial: { y: 0 },
    hover: { y: -3, transition: { duration: 0.2 } },
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <BrandLogo />
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-8">
              {links.map(link => (
                <motion.div key={link.name} variants={linkVariants} initial="initial" whileHover="hover">
                  <NavLink
                    to={link.path}
                    className={({isActive}) => `text-sm font-medium transition-colors relative ${
                      isActive 
                        ? 'text-accent font-semibold' 
                        : 'text-primary hover:text-accent'
                    } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-accent after:to-accent-hover hover:after:w-full after:transition-all after:duration-300`}
                  >
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}
            </div>

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}