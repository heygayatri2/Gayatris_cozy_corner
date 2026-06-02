import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowRight, ArrowLeft, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Category({ category }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryEmojis = {
    skincare: '🌸',
    fashion: '👗',
    lifestyle: '☕'
  };

  const categoryTitles = {
    skincare: 'Skincare',
    fashion: 'Fashion',
    lifestyle: 'Lifestyle'
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [category]);

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header Section */}
      <motion.section 
        className="bg-gradient-to-br from-softBrown via-sage/20 to-blush/10 py-20 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Animated background elements */}
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 30, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-10 left-10 w-48 h-48 bg-cream/20 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link to="/" className="inline-flex items-center text-white/70 hover:text-white transition mb-6 text-sm font-medium">
            <ArrowLeft size={16} className="mr-2" /> Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl"
            >
              {categoryEmojis[category] || '✨'}
            </motion.div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              {categoryTitles[category] || category}
            </h1>
          </div>
          <p className="text-lg text-white/80 max-w-2xl">
            Explore our collection of {categoryTitles[category]?.toLowerCase()} posts, tips, and inspiration.
          </p>
        </div>
      </motion.section>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        {loading ? (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex justify-center"
          >
            <p className="text-softBrown text-lg font-medium">Loading beautiful content...</p>
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🌿</div>
            <p className="text-dark/60 italic text-lg">No posts in this category yet. Check back soon!</p>
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
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col backdrop-blur-sm">
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-sage/20 to-blush/20 flex items-center justify-center min-h-56">
                    {post.thumbnail_url ? (
                      <motion.img 
                        src={post.thumbnail_url} 
                        alt={post.title} 
                        className="w-full h-full object-contain"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blush to-sage" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex-1 flex flex-col">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex justify-between items-center mb-4"
                    >
                      <span className="px-3 py-1 bg-gradient-to-r from-sage/30 to-blush/30 text-dark/70 text-xs font-semibold rounded-full capitalize">
                        {post.category}
                      </span>
                      <motion.span 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-xs text-dark/50 flex items-center"
                      >
                        <Eye size={14} className="mr-1" /> {post.views}
                      </motion.span>
                    </motion.div>

                    <h3 className="font-display text-xl font-bold mb-3 text-dark group-hover:text-softBrown transition-colors">
                      {post.title}
                    </h3>

                    <div 
                      className="text-sm text-dark/70 mb-4 line-clamp-3 flex-1 prose"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <motion.div
                      whileHover={{ x: 5 }}
                    >
                      <Link 
                        to={`/post/${post.slug}`} 
                        className="text-softBrown font-semibold text-sm hover:text-dark transition-colors mt-auto inline-flex items-center"
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
    </div>
  );
}
