import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ posts: 0, views: 0, links: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch post stats
      const { data: posts } = await supabase.from('posts').select('id, views, title, created_at').order('created_at', { ascending: false });
      // Fetch link stats
      const { count: linkCount } = await supabase.from('affiliate_products').select('id', { count: 'exact' });

      if (posts) {
        const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
        setStats({ posts: posts.length, views: totalViews, links: linkCount || 0 });
        setRecentPosts(posts.slice(0, 5)); // First 5 posts as recent
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const deletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await supabase.from('posts').delete().eq('id', id);
      setRecentPosts(recentPosts.filter(p => p.id !== id));
      setStats(prev => ({ ...prev, posts: prev.posts - 1 }));
    }
  };

  return (
    <div className="flex h-screen bg-cream">
      {/* Sidebar Layout */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6">
          <h2 className="font-display text-2xl font-bold text-dark">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/admin/dashboard" className="block px-4 py-2 bg-blush/30 text-softBrown rounded-lg font-medium shadow-sm transition">Dashboard</Link>
          <Link to="/admin/add-post" className="block px-4 py-2 hover:bg-sage/20 text-dark/70 rounded-lg transition">Add Post</Link>
          <Link to="/admin/links" className="block px-4 py-2 hover:bg-sage/20 text-dark/70 rounded-lg transition">Manage Links</Link>
        </nav>
        <div className="p-4 border-t border-sage/30">
          <button onClick={handleLogout} className="w-full py-2 hover:bg-red-50 text-red-500 rounded-lg transition font-medium">Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="font-display text-3xl font-bold text-dark mb-8">Overview</h1>
        
        {loading ? (
          <p className="text-softBrown animate-pulse">Loading dashboard data...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage/20 hover:border-softBrown/50 transition">
                <h3 className="text-dark/60 text-sm font-medium mb-2">Total Posts</h3>
                <p className="text-4xl font-display font-bold text-softBrown">{stats.posts}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage/20 hover:border-softBrown/50 transition">
                <h3 className="text-dark/60 text-sm font-medium mb-2">Total Views</h3>
                <p className="text-4xl font-display font-bold text-softBrown">{stats.views}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage/20 hover:border-softBrown/50 transition">
                <h3 className="text-dark/60 text-sm font-medium mb-2">Active Affiliate Links</h3>
                <p className="text-4xl font-display font-bold text-softBrown">{stats.links}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-sage/20 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl font-bold text-dark">Recent Posts</h2>
                <Link to="/admin/add-post" className="bg-softBrown text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition">
                  + New Post
                </Link>
              </div>
              
              {recentPosts.length === 0 ? (
                <div className="text-center py-12 bg-sage/10 rounded-xl text-dark/50 italic">
                  No posts found. Start writing your first post!
                </div>
              ) : (
                <div className="divide-y divide-sage/20">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="py-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-dark">{post.title}</h4>
                        <p className="text-sm text-dark/50 text-xs mt-1">
                          {new Date(post.created_at).toLocaleDateString()} • {post.views || 0} views
                        </p>
                      </div>
                      <button onClick={() => deletePost(post.id)} className="text-red-400 hover:text-red-600 text-sm px-3 py-1 bg-red-50 rounded transition">
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}