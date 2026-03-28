'use client';

import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import { Book } from '@/lib/types';

interface BookCardProps {
  book: Book;
  index?: number;
  onOrder?: (book: Book) => void;
  variant?: 'featured' | 'standard';
}

export default function BookCard({ book, index = 0, onOrder, variant = 'standard' }: BookCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
      }}
    >
      <div 
        onClick={() => onOrder?.(book)}
        style={{ cursor: 'pointer' }}
      >
        <motion.div
          whileHover={{ y: -8, scale: 1.01 }}
          className={isFeatured ? "" : "glass-card"}
          style={{
            borderRadius: '0px',
            overflow: 'hidden',
            aspectRatio: isFeatured ? '16/9' : '2/3',
            position: 'relative',
            background: 'var(--card)', 
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <img
            src={book.image}
            alt={book.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Subtle Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 40%)'
          }} />
        </motion.div>
      </div>

      {/* Labels below card as seen in photo - Pure Transparent with Text Shadows */}
      <div style={{ padding: '0 4px' }}>
        <div style={{ marginTop: '16px' }}>
          {/* Price Header (Highly Visible with Shadow) */}
          <div 
            className="text-pop"
            style={{ 
              fontSize: '18px', 
              fontWeight: 800, 
              color: 'var(--accent)',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'baseline',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '22px' }}>{book.price.toLocaleString()}</span>
            <span style={{ fontSize: '13px', fontWeight: 700, opacity: 0.9 }}>د.ع</span>
          </div>

          <h3 className="font-serif text-pop" style={{ 
            fontSize: '20px', 
            fontWeight: 700, 
            marginBottom: '2px', 
            color: 'var(--foreground)',
            lineHeight: 1.2,
            letterSpacing: '-0.01em'
          }}>
            {book.title}
          </h3>
          <p className="text-pop" style={{ 
            fontSize: '14px', 
            color: 'var(--muted)', 
            marginBottom: '12px',
            fontWeight: 800
          }}>
            {book.author}
          </p>

          {!isFeatured && (
            <div className="text-pop" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
               {[...Array(5)].map((_, i) => (
                  <Star 
                     key={i} 
                     size={12} 
                     fill={i < Math.round(book.rating) ? "var(--accent-gold)" : "none"} 
                     color={i < Math.round(book.rating) ? "var(--accent-gold)" : "var(--muted)"}
                     style={{ opacity: i < Math.round(book.rating) ? 1 : 0.4 }}
                     strokeWidth={2.5}
                  />
                ))}
            </div>
          )}


          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onOrder?.(book);
            }}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              borderRadius: '0px'
            }}
          >
            {isFeatured && <ShoppingCart size={14} />}
            Order
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
