'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  BookOpen,
  Loader2,
  ImageIcon,
  Upload,
} from 'lucide-react';
import { Book } from '@/lib/types';
import { useToast } from '@/components/Toast';
import PageTransition from '@/components/PageTransition';

export default function BooksManagementPage() {
  const [booksList, setBooksList] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showGallery, setShowGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const galleryImages = [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800',
    'https://images.unsplash.com/photo-1543005128-d39eef40237e?w=800',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
    'https://images.unsplash.com/photo-1511108690759-001da6ed8072?w=800',
    'https://images.unsplash.com/photo-1524578271613-d550eebcd500?w=800',
    'https://images.unsplash.com/photo-1474932430478-3a7faaa5d5e7?w=800',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800',
  ];

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        setBooksList(data);
        setLoading(false);
      });
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form, setForm] = useState({
    title: '',
    author: '',
    price: '',
    image: '',
    description: '',
    rating: '4.5',
    pages: '',
    year: '',
  });
  const { showToast } = useToast();

  const filteredBooks = Array.isArray(booksList) ? booksList.filter(b =>
    !search ||
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const openAdd = () => {
    setEditingBook(null);
    setForm({
      title: '', author: '', price: '', image: '',
      description: '', rating: '4.5', pages: '', year: '',
    });
    setShowModal(true);
  };

  const openEdit = (book: Book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      author: book.author,
      price: String(book.price),
      image: book.image,
      description: book.description,
      rating: String(book.rating),
      pages: String(book.pages),
      year: String(book.year),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.author || !form.price) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const payload = {
      title: form.title,
      author: form.author,
      price: parseFloat(form.price),
      image: form.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
      description: form.description,
      rating: parseFloat(form.rating) || 4.5,
      pages: parseInt(form.pages) || 200,
      year: parseInt(form.year) || 2024,
    };

    try {
      if (editingBook) {
        const res = await fetch(`/api/books/${editingBook.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setBooksList(prev => prev.map(b => b.id === editingBook.id ? updated : b));
        showToast('Book updated successfully', 'success');
      } else {
        const res = await fetch(`/api/books`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error();
        const added = await res.json();
        setBooksList(prev => [added, ...prev]);
        showToast('Book added successfully', 'success');
      }
      setShowModal(false);
    } catch (e) {
      showToast('Error saving book', 'error');
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setBooksList(prev => prev.filter(b => b.id !== id));
      showToast('Book deleted', 'success');
    } catch (e) {
      showToast('Error deleting book', 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setForm(prev => ({ ...prev, image: data.url }));
      showToast('Image uploaded successfully', 'success');
    } catch (err) {
      showToast('Error uploading image', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageTransition>
      <div style={{ maxWidth: '1100px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '36px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Books Management
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--muted)', marginTop: '4px' }}>
              {booksList.length} books in collection
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openAdd}
            style={{
              padding: '12px 24px',
              borderRadius: '0px',
              background: 'var(--foreground)',
              border: 'none',
              color: 'var(--background)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <Plus size={18} />
            Add Book
          </motion.button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: '24px' }}
        >
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--muted)',
            }} />
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '46px' }}
            />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            borderRadius: '20px',
            background: 'var(--card)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
          }}
        >
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '50px 2fr 1.5fr 0.7fr 0.7fr auto',
            gap: '12px',
            padding: '14px 24px',
            borderBottom: '1px solid var(--border-color)',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            <div></div>
            <div>Title</div>
            <div>Author</div>
            <div>Price (د.ع)</div>
            <div>Actions</div>
          </div>

          {/* Table Rows */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--muted)' }} />
            </div>
          ) : (
            <AnimatePresence>
            {filteredBooks.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: i * 0.02 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '50px 2fr 1.5fr 0.7fr 0.7fr auto',
                  gap: '12px',
                  padding: '14px 24px',
                  borderBottom: '1px solid var(--border-color)',
                  alignItems: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--card-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '40px',
                  height: '50px',
                  borderRadius: '8px',
                  background: `url(${book.image}) center/cover`,
                  flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {book.title}
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                  {book.author}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>
                  {book.price.toLocaleString()} د.ع
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openEdit(book)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '0px',
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--foreground)',
                    }}
                  >
                    <Edit3 size={14} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteBook(book.id)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '0px',
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--error)',
                    }}
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9000,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '560px',
                maxHeight: '90vh',
                overflow: 'auto',
                borderRadius: '0px',
                background: 'var(--card)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '24px 28px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)',
                position: 'sticky',
                top: 0,
                background: 'var(--card)',
                zIndex: 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BookOpen size={20} color="#F59E0B" />
                  <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
                    {editingBook ? 'Edit Book' : 'Add New Book'}
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--muted)',
                  }}
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Form */}
              <div style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Title *</label>
                  <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Book title" />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Author *</label>
                  <input className="form-input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author name" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                   <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Price (د.ع) *</label>
                    <input className="form-input" type="number" step="250" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="25000" />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>Image URL</label>
                    <button 
                      onClick={() => setShowGallery(true)}
                      style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        color: 'var(--accent)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <ImageIcon size={12} />
                      Pick from Gallery
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        color: 'var(--accent)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        opacity: uploading ? 0.5 : 1
                      }}
                    >
                      {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                      {uploading ? 'Uploading...' : 'Upload from Device'}
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                    />
                  </div>
                  <input className="form-input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Pages</label>
                    <input className="form-input" type="number" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} placeholder="300" />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Year</label>
                    <input className="form-input" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Rating</label>
                    <input className="form-input" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="4.5" />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Description</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Book description..."
                    style={{ resize: 'none' }}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '0px',
                    background: 'var(--foreground)',
                    border: 'none',
                    color: 'var(--background)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: 'none',
                    marginTop: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  <Save size={18} />
                  {editingBook ? 'Update Book' : 'Add Book'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGallery(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '800px',
                maxHeight: '80vh',
                overflow: 'auto',
                background: 'var(--card)',
                padding: '32px',
                border: '1px solid var(--border-color)',
                borderRadius: '0px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 className="font-serif" style={{ fontSize: '24px', fontWeight: 500 }}>Editorial Gallery</h2>
                <button onClick={() => setShowGallery(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                  <X size={24} />
                </button>
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                gap: '16px' 
              }}>
                {galleryImages.map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setForm({ ...form, image: img });
                      setShowGallery(false);
                    }}
                    style={{
                      aspectRatio: '2/3',
                      background: `url(${img}) center/cover`,
                      cursor: 'pointer',
                      border: form.image === img ? '3px solid var(--accent)' : '1px solid var(--border-color)',
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
