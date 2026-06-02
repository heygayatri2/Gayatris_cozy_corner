import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Menu, X, Edit, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ posts: 0, views: 0, links: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: posts } = await supabase.from('posts').select('id, views, title, created_at, slug').order('created_at', { ascending: false });
      const { count: linkCount } = await supabase.from('affiliate_products').select('id', { count: 'exact' });

      if (posts) {
        const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
        setStats({ posts: posts.length, views: totalViews, links: linkCount || 0 });
        setRecentPosts(posts.slice(0, 10));
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
    if (window.confirm("Are you sure? This will delete the post permanently.")) {
      await supabase.from('posts').delete().eq('id', id);
      setRecentPosts(recentPosts.filter(p => p.id !== id));
      setStats(prev => ({ ...prev, posts: prev.posts - 1 }));
    }
  };

  const menuItems = [
    { label: 'Dashboard', to: '/admin/dashboard', active: true },
    { label: 'Add Post', to: '/admin/add-post', active: false },
    { label: 'Manage Links', to: '/admin/links', active: false }
  ];

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      {/* Sidebar - Mobile responsive */}
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl md:shadow-lg flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-sage/20 flex justify-between items-center">
          <h2 className="font-display text-2xl font-bold text-dark">Admin</h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-dark/60 hover:text-dark">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                item.active 
                  ? 'bg-gradient-to-r from-softBrown/20 to-blush/20 text-softBrown shadow-sm border-l-4 border-softBrown' 
                  : 'text-dark/70 hover:bg-sage/20 hover:text-dark/90'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sage/20 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-gradient-to-r from-red-50 to-red-100 text-red-600 font-semibold rounded-lg hover:from-red-100 hover:to-red-200 transition-all hover:shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-40 md:hidden" />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-sage/20 px-4 md:px-10 py-4 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-dark/60 hover:text-dark transition"
          >
            <Menu size={28} />
          </button>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-dark">Dashboard</h1>
          <div className="w-8" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-10">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin">
                  <div className="w-12 h-12 border-4 border-softBrown/20 border-t-softBrown rounded-full" />
                </div>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                  <div className="bg-gradient-to-br from-white to-sage/10 p-6 rounded-2xl border border-sage/30 shadow-sm hover:shadow-md transition-all">
                    <h3 className="text-dark/70 text-sm font-semibold uppercase tracking-wide mb-3">Total Posts</h3>
                    <p className="text-4xl md:text-5xl font-display font-bold text-softBrown">{stats.posts}</p>
                    <p className="text-xs text-dark/50 mt-2">published</p>
                  </div>
                  <div className="bg-gradient-to-br from-white to-blush/10 p-6 rounded-2xl border border-blush/30 shadow-sm hover:shadow-md transition-all">
                    <h3 className="text-dark/70 text-sm font-semibold uppercase tracking-wide mb-3">Total Views</h3>
                    <p className="text-4xl md:text-5xl font-display font-bold text-blush">{stats.views.toLocaleString()}</p>
                    <p className="text-xs text-dark/50 mt-2">all time</p>
                  </div>
                  <div className="bg-gradient-to-br from-white to-sage/10 p-6 rounded-2xl border border-sage/40 shadow-sm hover:shadow-md transition-all">
                    <h3 className="text-dark/70 text-sm font-semibold uppercase tracking-wide mb-3">Affiliate Links</h3>
                    <p className="text-4xl md:text-5xl font-display font-bold text-sage">{stats.links}</p>
                    <p className="text-xs text-dark/50 mt-2">active</p>
                  </div>
                </div>

                {/* Posts Table */}
                <div className="bg-white rounded-2xl border border-sage/20 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-sage/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="font-display text-xl font-bold text-dark">Recent Posts</h2>
                    <Link
                      to="/admin/add-post"
                      className="w-full md:w-auto bg-gradient-to-r from-softBrown to-blush text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
                    >
                      + New Post
                    </Link>
                  </div>

                  {recentPosts.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-dark/50 text-lg">No posts yet. Start writing! ✨</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-sage/20 bg-sage/5">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark/80">Title</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark/80 hidden sm:table-cell">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-dark/80 hidden md:table-cell">Views</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-dark/80">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentPosts.map((post) => (
                            <tr key={post.id} className="border-b border-sage/10 hover:bg-sage/5 transition-colors">
                              <td className="px-6 py-4">
                                <p className="font-semibold text-dark line-clamp-1">{post.title}</p>
                              </td>
                              <td className="px-6 py-4 text-sm text-dark/60 hidden sm:table-cell">
                                {new Date(post.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm text-dark/60 hidden md:table-cell">
                                {post.views || 0}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex gap-2 justify-end">
                                  <Link
                                    to={`/admin/edit-post/${post.slug}`}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                                  >
                                    <Edit size={16} />
                                    <span className="hidden sm:inline">Edit</span>
                                  </Link>
                                  <button
                                    onClick={() => deletePost(post.id)}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                    <span className="hidden sm:inline">Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
