import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

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

  return (
    <div className="flex h-screen bg-cream">
      {/* Sidebar Layout */}
      <div className="w-64 bg-white shadow-lg flex flex-col shrink-0">
        <div className="p-6">
          <h2 className="font-display text-2xl font-bold text-dark">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-sage/20 text-dark/70 rounded-lg transition">Dashboard</Link>
          <Link to="/admin/add-post" className="block px-4 py-2 bg-blush/30 text-softBrown rounded-lg font-medium shadow-sm transition">Add Post</Link>
          <Link to="/admin/links" className="block px-4 py-2 hover:bg-sage/20 text-dark/70 rounded-lg transition">Manage Links</Link>
        </nav>
      </div>

      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="font-display text-3xl font-bold text-dark mb-8">Write a New Post</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-sage/20 space-y-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark/70 mb-1">Title</label>
              <input type="text" required value={title} onChange={(e) => autoGenSlug(e.target.value)} className="w-full p-2 border border-sage/50 rounded focus:border-softBrown outline-none" placeholder="My Awesome Post" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark/70 mb-1">Slug</label>
              <input type="text" required value={slug} onChange={handleSlugChange} className="w-full p-2 border border-sage/50 rounded focus:border-softBrown outline-none" placeholder="my-awesome-post" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark/70 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border border-sage/50 rounded focus:border-softBrown outline-none bg-white">
                <option value="skincare">Skincare</option>
                <option value="fashion">Fashion</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark/70 mb-1">Tags (comma separated)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full p-2 border border-sage/50 rounded focus:border-softBrown outline-none" placeholder="glow, summer, routine" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark/70 mb-1">Thumbnail Image</label>
            <input type="file" required accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} className="w-full p-2 border border-sage/50 rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blush/30 file:text-softBrown hover:file:bg-blush/50 transition cursor-pointer" />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark/70 mb-1">Content</label>
            <div className="bg-white rounded overflow-hidden border border-sage/50">
              <div ref={editorRef} className="h-96 text-base font-body" />
            </div>
          </div>

          <div className="border-t border-sage/30 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-xl font-bold text-dark">Affiliate Products</h3>
              <button type="button" onClick={addProduct} className="flex items-center text-sm bg-sage/30 text-dark/80 px-3 py-1.5 rounded-lg hover:bg-sage/50 transition">
                <Plus size={16} className="mr-1" /> Add Product
              </button>
            </div>
            
            <div className="space-y-4">
              {products.map((prod, index) => (
                <div key={index} className="p-4 bg-cream/30 rounded-xl border border-sage/30 flex flex-col md:flex-row gap-4 items-start md:items-end">
                  <div className="flex-1 w-full space-y-3">
                    <input type="text" placeholder="Product Name" required value={prod.name} onChange={(e) => updateProduct(index, 'name', e.target.value)} className="w-full p-2 border border-sage/50 rounded focus:border-softBrown outline-none text-sm" />
                    <input type="url" placeholder="Affiliate URL (https://...)" required value={prod.affiliate_url} onChange={(e) => updateProduct(index, 'affiliate_url', e.target.value)} className="w-full p-2 border border-sage/50 rounded focus:border-softBrown outline-none text-sm" />
                  </div>
                  <div className="w-full md:w-auto">
                    <input type="file" accept="image/*" id={`file-${index}`} className="hidden" onChange={(e) => updateProduct(index, 'image', e.target.files[0])} />
                    <label htmlFor={`file-${index}`} className="flex items-center justify-center w-full md:w-32 h-[84px] border-2 border-dashed border-sage/50 rounded-lg cursor-pointer hover:bg-sage/10 transition text-dark/50">
                      {prod.image ? <span className="text-xs text-center p-2 break-all">{prod.image.name}</span> : <ImageIcon size={24} />}
                    </label>
                  </div>
                  <button type="button" onClick={() => removeProduct(index)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition mt-auto mb-1">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-sm text-dark/50 italic text-center py-4">No products added yet. Click above to add affiliate links.</p>
              )}
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" disabled={loading} className="w-full py-4 bg-softBrown text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-softBrown/20 disabled:opacity-50">
              {loading ? 'Publishing...' : 'Publish Post & Products'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}