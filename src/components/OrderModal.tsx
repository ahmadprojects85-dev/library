'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, MapPin, ShoppingBag, Loader2 } from 'lucide-react';
import { Book, Order } from '@/lib/types';
import { useToast } from './Toast';

interface OrderModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ book, isOpen, onClose }: OrderModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !city || !address) {
      showToast('Please fill in required fields (Name, Phone, City, Address)', 'error');
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (book) {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: name,
            email: email || null,
            phone,
            city,
            address,
            bookId: book.id,
            bookTitle: book.title,
            quantity: 1,
            totalPrice: book.price
          })
        });
        
        if (!response.ok) throw new Error('Order failed');
        showToast(`Order placed for "${book?.title}" successfully!`, 'success');
      } catch (error) {
        showToast('Failed to place order', 'error');
        setLoading(false);
        return;
      }
    }
    
    setLoading(false);
    setName('');
    setEmail('');
    setPhone('');
    setCity('');
    setAddress('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && book && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9000,
            background: 'rgba(0, 0, 0, 0.7)', /* Darker overlay for better focus */
            backdropFilter: 'blur(30px)', /* Stronger blur for readability */
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '480px',
              borderRadius: '24px',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '32px 32px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <h2 className="font-brand" style={{ fontSize: '28px', fontWeight: 400, color: 'var(--foreground)', letterSpacing: '0.02em' }}>
                  Mountains Ink <span style={{ fontSize: '18px', fontFamily: 'var(--font-sans)', fontWeight: 600, fontStyle: 'normal', color: 'var(--accent)', marginLeft: '4px' }}>Library</span>
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--accent)', marginTop: '4px', fontWeight: 700, letterSpacing: '0.05em', fontFamily: 'var(--font-arabic)' }}>
                  کتێبخانەی مۆرکی چیاکان
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
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

            {/* Book Info */}
            <div style={{
              margin: '0 32px',
              padding: '20px',
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              background: 'rgba(var(--background-rgb, 255, 255, 255), 0.9)', /* High contrast background */
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}>
              <div style={{
                width: '64px',
                height: '84px',
                borderRadius: '10px',
                background: `url(${book.image}) center/cover`,
                flexShrink: 0,
                boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: 'var(--foreground)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                   {book.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 500 }}>{book.author}</p>
              </div>
              <span style={{
                fontSize: '22px',
                fontWeight: 900,
                color: 'var(--accent)',
                flexShrink: 0,
                letterSpacing: '-0.02em',
              }}>
                {book.price.toLocaleString()} د.ع
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Name */}
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--muted)',
                  }} />
                  <input
                    type="text"
                    placeholder="Recipient Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '48px' }}
                    required
                  />
                </div>

                {/* Phone */}
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--muted)',
                  }} />
                  <input
                    type="tel"
                    placeholder="Contact Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '48px' }}
                    required
                  />
                </div>

                {/* Gmail */}
                <div style={{ position: 'relative' }}>
                  <ShoppingBag size={18} style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--muted)',
                  }} />
                  <input
                    type="email"
                    placeholder="Gmail (Optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '48px' }}
                  />
                </div>

                {/* city */}
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--muted)',
                  }} />
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '48px' }}
                    required
                  />
                </div>

                {/* Address */}
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{
                    position: 'absolute',
                    left: '16px',
                    top: '18px',
                    color: 'var(--muted)',
                  }} />
                  <textarea
                    placeholder="Full Delivery Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-input"
                    rows={2}
                    style={{
                      paddingLeft: '48px',
                      resize: 'none',
                    }}
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, background: 'var(--accent-gold)' }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '40px',
                  padding: '20px',
                  borderRadius: '0px',
                  background: 'var(--accent)',
                  color: 'white', // Pure white for absolute contrast on bronze
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 900,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  opacity: loading ? 0.7 : 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  boxShadow: '0 12px 40px -10px rgba(176, 137, 104, 0.6)',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ marginLeft: '10px' }}>Finalizing...</span>
                  </>
                ) : (
                  'Confirm Order'
                )}
              </motion.button>
              
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>
                  A confirmation call will precede the physical exchange.
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
