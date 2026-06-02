import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Plus, Trash2, Image as ImageIcon, Menu, X } from 'lucide-react';

export default function AddPost() {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('skincare');
  const [tags, setTags] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [products, setProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write your beautiful post here...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }
      });
    }
  }, []);

  const handleSlugChange = (e) => {
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const autoGenSlug = (val) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const addProduct = () => {
    setProducts([...products, { name: '', affiliate_url: '', image: null }]);
  };

  const updateProduct = (index, field, value) => {
    const newProds = [...products];
    newProds[index][field] = value;
    setProducts(newProds);
  };

  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let thumbnailUrl = null;
      if (thumbnail) {
        const ext = thumbnail.name.split('.').pop();
        const fileName = `${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('thumbnails').upload(fileName, thumbnail);
        if (uploadErr) throw uploadErr;
        
        const { data } = supabase.storage.from('thumbnails').getPublicUrl(fileName);
        thumbnailUrl = data.publicUrl;
      }

      const content = quillRef.current.root.innerHTML;
      const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);

      const { data: post, error: postErr } = await supabase.from('posts').insert({
        title,
        slug,
        category,
        thumbnail_url: thumbnailUrl,
        content,
        tags: tagArray
      }).select().single();

      if (postErr) throw postErr;

      // Handle affiliate products
      if (products.length > 0) {
        const productsToInsert = await Promise.all(products.map(async (prod) => {
          let prodImageUrl = null;
          if (prod.image) {
            const ext = prod.image.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
            const { error: pUploadErr } = await supabase.storage.from('products').upload(fileName, prod.image);
            if (!pUploadErr) {
              const { data: pData } = supabase.storage.from('products').getPublicUrl(fileName);
              prodImageUrl = pData.publicUrl;
            }
          }
          return {
            post_id: post.id,
            name: prod.name,
            affiliate_url: prod.affiliate_url,
            image_url: prodImageUrl
          };
        }));

        const { error: prodsErr } = await supabase.from('affiliate_products').insert(productsToInsert);
        if (prodsErr) throw prodsErr;
      }

      alert('Post published successfully! 🎉');
      navigate('/admin/dashboard');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Add Post', to: '/admin/add-post', active: true },
    { label: 'Manage Links', to: '/admin/links' }
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

        <div className="p-4 border-t border-sage/20">
          <Link to="/admin/dashboard" className="block w-full py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all text-center">
            Back
          </Link>
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
          <h1 className="font-display text-2xl md:text-3xl font-bold text-dark">Write a New Post</h1>
          <div className="w-8" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-10">
            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-sage/20 space-y-6 max-w-4xl">
              {/* Title and Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Title *</label>
                  <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={(e) => autoGenSlug(e.target.value)} 
                    className="w-full p-3 border-2 border-sage/30 rounded-lg focus:border-softBrown focus:outline-none bg-white text-dark placeholder-dark/40" 
                    placeholder="My Awesome Post" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Slug *</label>
                  <input 
                    type="text" 
                    required 
                    value={slug} 
                    onChange={handleSlugChange} 
                    className="w-full p-3 border-2 border-sage/30 rounded-lg focus:border-softBrown focus:outline-none bg-white text-dark placeholder-dark/40" 
                    placeholder="my-awesome-post" 
                  />
                </div>
              </div>

              {/* Category and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Category *</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="w-full p-3 border-2 border-sage/30 rounded-lg focus:border-softBrown focus:outline-none bg-white text-dark"
                  >
                    <option value="skincare">Skincare</option>
                    <option value="fashion">Fashion</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Tags (comma separated)</label>
                  <input 
                    type="text" 
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)} 
                    className="w-full p-3 border-2 border-sage/30 rounded-lg focus:border-softBrown focus:outline-none bg-white text-dark placeholder-dark/40" 
                    placeholder="glow, summer, routine" 
                  />
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Thumbnail Image *</label>
                <input 
                  type="file" 
                  required 
                  accept="image/*" 
                  onChange={(e) => setThumbnail(e.target.files[0])} 
                  className="w-full p-3 border-2 border-sage/30 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blush/30 file:text-softBrown hover:file:bg-blush/50 transition cursor-pointer text-dark" 
                />
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Content *</label>
                <div className="bg-white rounded-lg overflow-hidden border-2 border-sage/30">
                  <div ref={editorRef} className="h-96 text-base font-body" />
                </div>
              </div>

              {/* Affiliate Products */}
              <div className="border-t border-sage/30 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display text-xl font-bold text-dark">Affiliate Products</h3>
                  <button 
                    type="button" 
                    onClick={addProduct} 
                    className="flex items-center text-sm bg-gradient-to-r from-sage/40 to-blush/40 text-dark/80 px-4 py-2 rounded-lg hover:from-sage/60 hover:to-blush/60 transition font-semibold"
                  >
                    <Plus size={16} className="mr-2" /> Add Product
                  </button>
                </div>
                
                <div className="space-y-4">
                  {products.map((prod, index) => (
                    <div key={index} className="p-4 bg-sage/10 rounded-xl border-2 border-sage/30 flex flex-col md:flex-row gap-4 items-start md:items-end">
                      <div className="flex-1 w-full space-y-3">
                        <input 
                          type="text" 
                          placeholder="Product Name" 
                          required 
                          value={prod.name} 
                          onChange={(e) => updateProduct(index, 'name', e.target.value)} 
                          className="w-full p-3 border-2 border-sage/30 rounded-lg focus:border-softBrown focus:outline-none bg-white text-dark text-sm placeholder-dark/40" 
                        />
                        <input 
                          type="url" 
                          placeholder="Affiliate URL (https://...)" 
                          required 
                          value={prod.affiliate_url} 
                          onChange={(e) => updateProduct(index, 'affiliate_url', e.target.value)} 
                          className="w-full p-3 border-2 border-sage/30 rounded-lg focus:border-softBrown focus:outline-none bg-white text-dark text-sm placeholder-dark/40" 
                        />
                      </div>
                      <div className="w-full md:w-auto">
                        <input type="file" accept="image/*" id={`file-${index}`} className="hidden" onChange={(e) => updateProduct(index, 'image', e.target.files[0])} />
                        <label htmlFor={`file-${index}`} className="flex items-center justify-center w-full md:w-32 h-[84px] border-2 border-dashed border-sage/50 rounded-lg cursor-pointer hover:bg-sage/10 transition text-dark/50">
                          {prod.image ? <span className="text-xs text-center p-2 break-all text-dark/60">{prod.image.name}</span> : <ImageIcon size={24} />}
                        </label>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeProduct(index)} 
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <p className="text-sm text-dark/50 italic text-center py-6 bg-sage/5 rounded-lg">No products added yet. Click above to add affiliate links.</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-4 bg-gradient-to-r from-softBrown to-blush text-white font-bold rounded-xl hover:shadow-lg transition shadow-md shadow-softBrown/20 disabled:opacity-50 text-lg"
                >
                  {loading ? 'Publishing...' : 'Publish Post & Products'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
