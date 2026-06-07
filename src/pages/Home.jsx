import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ArrowRight, ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import TypewriterText from '../components/TypewriterText';

export default function Home() {
  const containerRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
        
      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Hero Section */}
      <motion.section 
        style={{ y, opacity }}
        className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-surface via-accent/10 to-surface-hover pb-20 transition-colors duration-300"
      >
        {/* Animated background elements */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 left-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"
        />
        
        {/* Floating decorative elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 text-6xl opacity-20"
        >
          🌸
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 text-5xl opacity-20"
        >
          ✨
        </motion.div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
          <TypewriterText />

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-lg md:text-xl text-secondary mb-12 font-medium"
          >
            Your sanctuary for skincare, fashion & aesthetic lifestyle 🌿
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.a 
              href="#featured" 
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(197, 129, 124, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-primary text-surface rounded-full font-bold text-base flex items-center transition-all shadow-lg cursor-pointer border-2 border-transparent relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">✨ Explore Posts <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} /></span>
              <span className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ zIndex: 0 }} />
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(168, 168, 144, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/products" className="group px-8 py-4 bg-accent text-surface rounded-full font-bold text-base flex items-center transition-all shadow-lg border-2 border-transparent relative overflow-hidden">
                <span className="relative z-10 flex items-center">🛍️ Shop Favorites <ShoppingBag className="ml-2 group-hover:scale-110 transition-transform duration-300" size={20} /></span>
                <span className="absolute inset-0 bg-accent-hover opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ zIndex: 0 }} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator - positioned properly to not overlap */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer"
            onClick={() => document.getElementById('featured').scrollIntoView({ behavior: 'smooth' })}
          >
            <svg className="w-8 h-8 text-dark/40 hover:text-softBrown transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Posts Section */}
      <section id="featured" className="py-20 bg-surface transition-colors duration-300 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl font-bold text-center mb-16 text-primary"
          >
            <span className="relative inline-block">
              Latest Posts
              <motion.span 
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full"
              />
            </span>
          </motion.h2>
          
          {loading ? (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex justify-center"
            >
              <p className="text-softBrown text-lg font-medium">Loading amazing content...</p>
            </motion.div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-dark/60 italic py-10"
            >
              No posts yet. Check back later! 🌸
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, idx) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <div className="glass-panel overflow-hidden h-full flex flex-col group-hover:-translate-y-2 transition-transform duration-300">
                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-surface-hover flex items-center justify-center min-h-56">
                      {post.thumbnail_url ? (
                        <motion.img 
                          src={post.thumbnail_url} 
                          alt={post.title} 
                          className="w-full h-full object-cover aspect-video"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5" />
                      )}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content Container */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Category Badge */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex justify-between items-center mb-4"
                      >
                        <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full capitalize">
                          {post.category}
                        </span>
                        <motion.span 
                          className="text-xs text-secondary flex items-center"
                        >
                          <Eye size={14} className="mr-1" /> {post.views}
                        </motion.span>
                      </motion.div>

                      {/* Title */}
                      <h3 className="font-display text-xl font-bold mb-3 text-primary group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <div 
                        className="text-sm text-secondary mb-4 line-clamp-3 flex-1 prose dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />

                      {/* Read More Link */}
                      <motion.div
                        whileHover={{ x: 5 }}
                      >
                        <Link 
                          to={`/post/${post.slug}`} 
                          className="text-accent font-semibold text-sm hover:text-accent-hover transition-colors mt-auto inline-flex items-center"
                        >
                          Read More <ArrowRight size={14} className="ml-1" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-surface to-surface-hover transition-colors duration-300 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-4xl font-bold text-center mb-16 text-primary"
          >
            Explore Categories
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { to: "/skincare", emoji: "🌸", title: "Skincare", desc: "Glow from within with our routines." },
              { to: "/fashion", emoji: "👗", title: "Fashion", desc: "Style guides and seasonal trends." },
              { to: "/lifestyle", emoji: "☕", title: "Lifestyle", desc: "Aesthetic vibes and daily inspiration." }
            ].map((cat, idx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link 
                  to={cat.to} 
                  className="group rounded-3xl p-8 text-center glass-panel h-full flex flex-col items-center justify-center hover:-translate-y-2 transition-transform duration-300"
                >
                  {/* Emoji Animation */}
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-5xl mb-4"
                  >
                    {cat.emoji}
                  </motion.div>

                  {/* Title */}
                  <h3 className="font-display text-2xl font-bold mb-3 text-primary group-hover:text-accent transition-colors">
                    {cat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-secondary text-sm">
                    {cat.desc}
                  </p>

                  {/* Arrow indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 5 }}
                    className="mt-4 text-accent"
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}