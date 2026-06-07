import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ShoppingBag, Calendar, Eye, Tag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      // Fetch post by slug
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (postError || !postData) {
        setLoading(false);
        return;
      }

      setPost(postData);

      // Increment view count directly
      const newViews = (postData.views || 0) + 1;
      await supabase
        .from('posts')
        .update({ views: newViews })
        .eq('id', postData.id);

      // Fetch related affiliate products
      const { data: prodData } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('post_id', postData.id);

      if (prodData) {
        setProducts(prodData);
      }
      
      setLoading(false);
    };

    fetchPostData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface transition-colors duration-300">
        <p className="font-display text-2xl text-accent animate-pulse">Loading amazing content...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface transition-colors duration-300">
        <h2 className="font-display text-3xl font-bold text-primary mb-4">Post not found</h2>
        <Link to="/" className="text-accent hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-20 transition-colors duration-300">
      {/* Post Hero */}
      <div className="w-full max-w-4xl mx-auto px-4 pt-10">
        <Link to="/" className="inline-flex items-center text-secondary hover:text-accent transition mb-6 text-sm font-medium">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Link>
        
        <div className="flex items-center space-x-3 mb-6">
          <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider rounded-full">
            {post.category}
          </span>
          <span className="text-sm text-secondary flex items-center">
            <Calendar size={14} className="mr-1" />
            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-sm text-secondary flex items-center">
            <Eye size={14} className="mr-1" /> {post.views + 1} views
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-bold text-primary mb-8 leading-tight">
          {post.title}
        </h1>

        {post.thumbnail_url && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-3xl overflow-hidden mb-12 shadow-xl shadow-sage/30 bg-gradient-to-br from-sage/20 to-blush/20 flex items-center justify-center min-h-[400px] md:min-h-[500px]"
          >
            <img 
              src={post.thumbnail_url} 
              alt={post.title} 
              className="w-full h-full object-contain" 
              onError={(e) => {
                console.warn('Image failed to load:', post.thumbnail_url);
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', post.thumbnail_url);
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Content & Tags */}
      <div className="max-w-3xl mx-auto px-4">
        <div 
          className="prose prose-lg dark:prose-invert prose-headings:font-display prose-headings:text-primary prose-p:text-secondary prose-a:text-accent mb-12 font-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-16 pt-8 border-t border-border">
            {post.tags.map((tag, i) => (
              <span key={i} className="flex items-center px-3 py-1 bg-surface-hover border border-border text-secondary text-sm rounded-full">
                <Tag size={12} className="mr-1" /> {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Affiliate Products Section */}
      {products.length > 0 && (
        <div className="bg-surface-hover py-16 transition-colors duration-300">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-3 mb-10">
              <ShoppingBag className="text-accent" size={28} />
              <h2 className="font-display text-3xl font-bold text-primary text-center">
                Shop The Post
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((prod) => (
                <motion.a 
                  key={prod.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  href={prod.affiliate_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-panel p-4 hover:-translate-y-1 transition-all group hover:border-accent"
                >
                  <div className="h-48 rounded-xl bg-white mb-4 overflow-hidden flex items-center justify-center relative p-2">
                    {prod.image_url ? (
                      <img 
                        src={prod.image_url} 
                        alt={prod.name} 
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          console.warn('Product image failed to load:', prod.image_url);
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <ShoppingBag className="text-secondary w-12 h-12" />
                    )}
                  </div>
                  <h3 className="font-medium text-primary mb-3 text-center line-clamp-2">{prod.name}</h3>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2 bg-accent/10 text-accent text-sm font-bold rounded-lg group-hover:bg-accent group-hover:text-surface transition-all"
                  >
                    Buy Now ↗️
                  </motion.button>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}