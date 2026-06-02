import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      // We fetch products and join the posts table to get the category
      const { data, error } = await supabase
        .from('affiliate_products')
        .select(`
          *,
          posts ( category )
        `);
      
      if (data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const categories = ['All', 'skincare', 'fashion', 'lifestyle'];

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.posts?.category === filter);

  return (
    <div className="min-h-screen bg-cream py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-dark text-center mb-10">
          Shop My Favorites
        </h1>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-medium capitalize transition-all duration-300 ${
                filter === cat 
                  ? 'bg-softBrown text-white shadow-md' 
                  : 'bg-white text-dark/70 hover:bg-sage/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <p className="text-center text-softBrown animate-pulse">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-dark/50 italic">No products found for this category yet.</p>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts.map((prod) => (
                <motion.a
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={prod.id}
                  href={prod.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl p-5 shadow-sm border border-sage/20 hover:shadow-xl hover:-translate-y-2 transition-all group flex flex-col h-full"
                >
                  <div className="rounded-xl bg-sage/10 mb-4 overflow-hidden flex items-center justify-center relative min-h-48">
                    {prod.image_url ? (
                      <img src={prod.image_url} alt={prod.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <ShoppingBag className="text-sage/50 w-12 h-12" />
                    )}
                  </div>
                  <h3 className="font-medium text-dark mb-4 text-center line-clamp-2">{prod.name}</h3>
                  <div className="mt-auto">
                    <button className="w-full py-2.5 bg-blush/50 text-softBrown text-sm font-bold rounded-lg group-hover:bg-softBrown group-hover:text-white transition-colors flex items-center justify-center">
                      Buy Now <ArrowRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}