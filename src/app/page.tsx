'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Loader2 } from 'lucide-react';
import BookCard from '@/components/BookCard';
import OrderModal from '@/components/OrderModal';
import PageTransition from '@/components/PageTransition';
import { Book } from '@/lib/types';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState(3000);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [booksList, setBooksList] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        setBooksList(data);
        setLoading(false);
      });
  }, []);

  const filteredBooks = useMemo(() => {
    if (!Array.isArray(booksList)) return [];
    return booksList.filter(book => {
      return !search ||
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());
    });
  }, [booksList, search]);

  const handleOrder = (book: Book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  return (
    <PageTransition>
      <main style={{ minHeight: '100vh', paddingBottom: '120px', background: 'var(--background)', color: 'var(--foreground)' }}>
        {/* Transparent Hero Section */}
        <section style={{
          width: '100%',
          minHeight: '350px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 24px 20px',
          zIndex: 10
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              overflow: 'hidden',
              marginBottom: '20px',
              border: '2px solid var(--accent)',
              background: 'white',
              boxShadow: '0 0 50px rgba(184, 142, 72, 0.4)'
            }}
          >
            <img src="/logo.jpg" alt="Mountains Ink" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-brand text-pop"
            style={{
              fontSize: 'clamp(55px, 11vw, 130px)',
              fontWeight: 400,
              lineHeight: 0.8,
              color: 'var(--foreground)',
              marginBottom: '10px'
            }}
          >
            Mountains Ink
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-pop"
          >
            <h2 style={{
              fontSize: 'clamp(30px, 5.5vw, 60px)',
              fontWeight: 500,
              color: 'var(--accent)',
              direction: 'rtl',
              fontFamily: 'var(--font-arabic)',
            }}>
              کتێبخانەی مۆرکی چیاکان
            </h2>
            <p style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--muted)',
              letterSpacing: '0.7em',
              textTransform: 'uppercase',
              marginTop: '15px',
              textShadow: '0 1px 5px rgba(0,0,0,0.2)'
            }}>
              MI Bookstore
            </p>
          </motion.div>
        </section>

        {/* Storefront Layout */}
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', backdropFilter: 'blur(2px)' }}>
          <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-start', flexDirection: 'row' }} className="flex-col md:flex-row">
            
            {/* Book Grid */}
            <div style={{ flex: 1 }}>
              {/* Centered Search */}
              <div style={{ maxWidth: '600px', margin: '0 auto 60px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                  <input
                    type="text"
                    placeholder="Search titles or authors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-input text-pop"
                    style={{ 
                      paddingLeft: '54px', 
                      height: '56px', 
                      fontSize: '16px',
                      borderRadius: '0px',
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 500, color: 'var(--foreground)' }}>Browsing Library</h2>
                  <p style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 500, marginTop: '4px' }}>{filteredBooks.length} volumes found</p>
                </div>
              </div>

              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                  <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--muted)' }} />
                </div>
              ) : filteredBooks.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '40px 32px',
                }}>
                  {filteredBooks.map((book, i) => (
                    <BookCard key={book.id} book={book} index={i} onOrder={handleOrder} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                  <BookOpen size={40} style={{ color: 'var(--muted)', opacity: 0.5, marginBottom: '20px', margin: '0 auto' }} />
                  <h3 style={{ fontSize: '20px', color: 'var(--foreground)', fontWeight: 500 }}>The archives are empty.</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '8px' }}>Adjust your refined search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <OrderModal
        book={selectedBook}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </PageTransition>
  );
}
