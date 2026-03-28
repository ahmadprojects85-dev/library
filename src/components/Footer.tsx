'use client';

import Link from 'next/link';
import { BookOpen, ExternalLink, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      background: 'rgba(255,255,255,0.02)',
      backdropFilter: 'blur(20px)',
      padding: '100px 24px 60px',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '64px',
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
            }}>
              <img src="/logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="font-brand" style={{ fontSize: '24px', fontWeight: 400, color: 'var(--foreground)', letterSpacing: '0.02em', lineHeight: 1.2 }}>
                Mountains Ink
              </span>
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--accent)', lineHeight: 1.2, direction: 'rtl', fontFamily: 'var(--font-arabic)' }}>
                کتێبخانەی مۆرکی چیاکان
              </span>
            </div>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: '1.6', maxWidth: '320px', fontWeight: 500 }}>
            Embark on a literary journey through the heights of wisdom. 
            The enduring spirit of the mountains, bound in fine ink.
          </p>
        </div>

        {/* Removed Navigation Column */}

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '24px' }}>
            Inquiries
          </h4>
          <Link href="/contact" style={{ display: 'block', textDecoration: 'none', marginBottom: '8px' }}>
            <p style={{ color: 'var(--foreground)', fontSize: '15px', fontWeight: 600, transition: 'color 0.2s ease' }}>
              mountainsbookstore@gmail.com
            </p>
          </Link>
          <p style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>
            07515364194 <br/> 07721094314
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500, marginTop: '8px' }}>
            Orders settled in cash upon tactile exchange.
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        maxWidth: '1280px',
        margin: '80px auto 0',
        paddingTop: '32px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
      }}>
        <p style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 500 }}>
          © 2024 Mountains Ink Library <span style={{ fontFamily: 'var(--font-arabic)', fontSize: '14px' }}>(کتێبخانەی مۆرکی چیاکان)</span>. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 500 }}>Privacy Policy</span>
          <span style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 500 }}>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
