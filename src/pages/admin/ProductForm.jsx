import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import toast from 'react-hot-toast';

const categories = ['Running', 'Casual', 'Sports', 'Formal', 'Boots', 'Sandals'];
const genders = ['Men', 'Women', 'Unisex'];
const defaultSizes = ['6', '7', '8', '9', '10', '11', '12'];
const defaultColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Gray', 'Brown', 'Navy'];

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', brand: '', description: '', price: '', discountPrice: '',
    stock: '', category: '', gender: '', sku: '', sizes: [], color: []
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const { data: res } = await API.get(`/products/${id}`);
          const p = res.data;
          setForm({
            name: p.name || '', brand: p.brand || '', description: p.description || '',
            price: p.price || '', discountPrice: p.discountPrice || '',
            stock: p.stock || '', category: p.category || '',
            gender: p.gender || '', sku: p.sku || '', sizes: p.sizes || [], color: p.color || []
          });
          setExistingImages(p.images || []);
        } catch {
          setError('Failed to load product');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSizeToggle = (size) => {
    setForm({
      ...form,
      sizes: form.sizes.includes(size) ? form.sizes.filter((s) => s !== size) : [...form.sizes, size]
    });
  };

  const handleColorToggle = (color) => {
    setForm({
      ...form,
      color: form.color.includes(color) ? form.color.filter((c) => c !== color) : [...form.color, color]
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrls((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const removePreview = (idx) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const data = { ...form };
      if (!data.sku) {
        const prefix = (data.brand || 'GEN').toUpperCase().slice(0, 4);
        const ts = Date.now().toString(36).toUpperCase();
        const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
        data.sku = `${prefix}-${ts}${rand}`;
      }
      data.gender = data.gender.toLowerCase();

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'sizes' || key === 'color') {
          formData.append(key, value.join(','));
        } else {
          formData.append(key, value);
        }
      });
      existingImages.forEach((url) => formData.append('existingImages', url));
      images.forEach((file) => formData.append('images', file));

      if (isEdit) {
        await API.put(`/products/${id}`, formData);
        toast.success('Product updated!');
      } else {
        await API.post('/products', formData);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (error && !submitting) return <Message variant="error">{error}</Message>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        {error && <Message variant="error">{error}</Message>}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-surface-300 block mb-1">Product Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required
              className="w-full input-field" />
          </div>
          <div>
            <label className="text-sm text-surface-300 block mb-1">Brand</label>
            <input type="text" name="brand" value={form.brand} onChange={handleChange}
              className="w-full input-field" />
          </div>
        </div>

        <div>
          <label className="text-sm text-surface-300 block mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4}
            className="w-full input-field" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-surface-300 block mb-1">Price ($)</label>
            <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required
              className="w-full input-field" />
          </div>
          <div>
            <label className="text-sm text-surface-300 block mb-1">Discount Price ($)</label>
            <input type="number" step="0.01" name="discountPrice" value={form.discountPrice} onChange={handleChange}
              className="w-full input-field" />
          </div>
          <div>
            <label className="text-sm text-surface-300 block mb-1">Stock</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} required
              className="w-full input-field" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-surface-300 block mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} required
              className="w-full input-field">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-surface-300 block mb-1">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}
              className="w-full input-field">
              <option value="">Select gender</option>
              {genders.map((g) => <option key={g.toLowerCase()} value={g.toLowerCase()}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-surface-300 block mb-1">SKU</label>
            <input type="text" name="sku" value={form.sku} onChange={handleChange} placeholder="Auto-generated if empty"
              className="w-full input-field" />
          </div>
        </div>

        <div>
          <label className="text-sm text-surface-300 block mb-2">Sizes</label>
          <div className="flex flex-wrap gap-2">
            {defaultSizes.map((size) => (
              <button key={size} type="button" onClick={() => handleSizeToggle(size)}
                className={`w-12 h-12 text-sm rounded-lg border transition-colors ${form.sizes.includes(size) ? 'bg-brand-600 border-brand-500 text-white' : 'border-surface-700 text-surface-400 hover:border-surface-500'}`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-surface-300 block mb-2">Colors</label>
          <div className="flex flex-wrap gap-2">
            {defaultColors.map((color) => (
              <button key={color} type="button" onClick={() => handleColorToggle(color)}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${form.color.includes(color) ? 'bg-brand-600 border-brand-500 text-white' : 'border-surface-700 text-surface-400 hover:border-surface-500'}`}>
                {color}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-surface-300 block mb-2">Images</label>
          <div className="border-2 border-dashed border-surface-700 rounded-xl p-4">
            <input type="file" multiple accept="image/*" onChange={handleImageChange}
              className="w-full text-sm text-surface-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-600 file:text-white hover:file:bg-brand-500" />
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            {existingImages.map((url, idx) => (
              <div key={`existing-${idx}`} className="relative group">
                <img src={url} alt="" className="w-24 h-24 object-cover rounded-lg" />
                <button type="button" onClick={() => removeExistingImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity">X</button>
              </div>
            ))}
            {previewUrls.map((url, idx) => (
              <div key={`preview-${idx}`} className="relative group">
                <img src={url} alt="" className="w-24 h-24 object-cover rounded-lg" />
                <button type="button" onClick={() => removePreview(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity">X</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')}
            className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
