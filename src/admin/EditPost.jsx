import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Plus, Trash2, Image as ImageIcon, ArrowLeft } from 'lucide-react';

export default function EditPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [postId, setPostId] = useState(null);
  const [title, setTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [category, setCategory] = useState('skincare');
  const [tags, setTags] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [products, setProducts] = useState([]);
  const [existingProducts, setExistingProducts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data: post, error: postErr } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (postErr) throw postErr;

        setPostId(post.id);
        setTitle(post.title);
        setPostSlug(post.slug);
        setCategory(post.category);
        setTags(post.tags?.join(', ') || '');
        setThumbnailUrl(post.thumbnail_url);

        setTimeout(() => {
          if (quillRef.current) quillRef.current.root.innerHTML = post.content;
        }, 100);

        const { data: prods } = await supabase
          .from('affiliate_products')
          .select('*')
          .eq('post_id', post.id);

        setExistingProducts(prods || []);
        setLoading(false);
      } catch (err) {
        alert('Error loading post: ' + err.message);
        navigate('/admin/dashboard');
      }
    };

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

    fetchPost();
  }, [slug, navigate]);

  const handleSlugChange = (e) => {
    setPostSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const autoGenSlug = (val) => {
    setTitle(val);
    setPostSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
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

  const removeExistingProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      await supabase.from('affiliate_products').delete().eq('id', id);
      setExistingProducts(existingProducts.filter(p => p.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalThumbnailUrl = thumbnailUrl;
      if (thumbnail) {
        const ext = thumbnail.name.split('.').pop();
        const fileName = `${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('thumbnails').upload(fileName, thumbnail);
        if (uploadErr) throw uploadErr;
        
        const { data } = supabase.storage.from('thumbnails').getPublicUrl(fileName);
        finalThumbnailUrl = data.publicUrl;
      }

      const content = quillRef.current.root.innerHTML;
      const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);

      const { error: updateErr } = await supabase
        .from('posts')
        .update({
          title,
          slug: postSlug,
          category,
          thumbnail_url: finalThumbnailUrl,
          content,
          tags: tagArray
        })
        .eq('id', postId);

      if (updateErr) throw updateErr;

      // Handle new products
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
            post_id: postId,
            name: prod.name,
            affiliate_url: prod.affiliate_url,
            image_url: prodImageUrl
          };
        }));

        const { error: prodsErr } = await supabase.from('affiliate_products').insert(productsToInsert);
        if (prodsErr) throw prodsErr;
      }

      alert('Post updated successfully! 🎉');
      navigate('/admin/dashboard');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin"><div className="w-12 h-12 border-4 border-softBrown/20 border-t-softBrown rounded-full" /></div></div>;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-sage/20 px-4 md:px-10 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="text-dark/60 hover:text-dark transition p-2 hover:bg-sage/10 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-dark">Edit Post</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-10">
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-sage/20 space-y-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Title</label>
              <input type="text" required value={title} onChange={(e) => autoGenSlug(e.target.value)} className="w-full p-3 border-2 border-sage/30 rounded-lg focus:border-softBrown focus:outline-none bg-white text-dark" placeholder="My Awesome Post" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Slug</label>
              <input type="text" required value={postSlug} onChange={handleSlugChange} className="w-full p-3 border-2 border-sage/30 rounded-lg focus:border-softBrown focus:outline-none bg-white text-dark" placeholder="my-awesome-post" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border-2 border-sage/30 rounded-lg focus:border-softBrown focus:outline-none bg-white text-dark">
                <option value="skincare">Skincare</option>
                <option value="fashion">Fashion</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Tags (comma separated)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full p-3 border-2 border-sage/30 rounded-lg focus:border-softBrown focus:outline-none bg-white text-dark" placeholder="glow, summer, routine" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Thumbnail Image</label>
            {thumbnailUrl && !thumbnail && <p className="text-sm text-dark/60 mb-2">Current: <img src={thumbnailUrl} alt="Current" className="w-32 h-32 object-contain mt-1 rounded" /></p>}
            <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} className="w-full p-2 border-2 border-sage/30 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blush/30 file:text-softBrown hover:file:bg-blush/50 transition cursor-pointer text-dark" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Content</label>
            <div className="bg-white rounded-lg overflow-hidden border-2 border-sage/30">
              <div ref={editorRef} className="h-96 text-base font-body" />
            </div>
          </div>

          <div className="border-t border-sage/30 pt-6">
            <h3 className="font-display text-xl font-bold text-dark mb-6">Existing Products</h3>
            <div className="space-y-4 mb-6">
              {existingProducts.map((prod) => (
                <div key={prod.id} className="p-4 bg-sage/10 rounded-xl border border-sage/30 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-dark">{prod.name}</p>
                    <p className="text-sm text-dark/60">{prod.affiliate_url}</p>
                  </div>
                  <button type="button" onClick={() => removeExistingProduct(prod.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-lg font-bold text-dark">Add New Products</h3>
              <button type="button" onClick={addProduct} className="flex items-center text-sm bg-sage/30 text-dark/80 px-3 py-1.5 rounded-lg hover:bg-sage/50 transition">
                <Plus size={16} className="mr-1" /> Add Product
              </button>
            </div>
            
            <div className="space-y-4">
              {products.map((prod, index) => (
                <div key={index} className="p-4 bg-cream/50 rounded-xl border-2 border-sage/30 flex flex-col md:flex-row gap-4 items-start md:items-end">
                  <div className="flex-1 w-full space-y-3">
                    <input type="text" placeholder="Product Name" required value={prod.name} onChange={(e) => updateProduct(index, 'name', e.target.value)} className="w-full p-3 border-2 border-sage/30 rounded-lg focus:border-softBrown focus:outline-none bg-white text-dark text-sm" />
                    <input type="url" placeholder="Affiliate URL" required value={prod.affiliate_url} onChange={(e) => updateProduct(index, 'affiliate_url', e.target.value)} className="w-full p-3 border-2 border-sage/30 rounded-lg focus:border-softBrown focus:outline-none bg-white text-dark text-sm" />
                  </div>
                  <div className="w-full md:w-auto">
                    <input type="file" accept="image/*" id={`file-${index}`} className="hidden" onChange={(e) => updateProduct(index, 'image', e.target.files[0])} />
                    <label htmlFor={`file-${index}`} className="flex items-center justify-center w-full md:w-32 h-[84px] border-2 border-dashed border-sage/50 rounded-lg cursor-pointer hover:bg-sage/10 transition text-dark/50">
                      {prod.image ? <span className="text-xs text-center p-2 break-all">{prod.image.name}</span> : <ImageIcon size={24} />}
                    </label>
                  </div>
                  <button type="button" onClick={() => removeProduct(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" disabled={saving} className="w-full py-4 bg-gradient-to-r from-softBrown to-blush text-white font-bold rounded-xl hover:shadow-lg transition shadow-md shadow-softBrown/20 disabled:opacity-50 text-lg">
              {saving ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
