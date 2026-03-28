'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import {
  Book,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import VanGoghToggle from './VanGoghToggle';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Collection' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: isScrolled ? '12px 0' : '20px 0',
          background: 'var(--glass)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--glass-border)',
          transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '24px',
        }}>
          {/* Logo */}
          <div>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', width: 'fit-content' }}>
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
                <span className="font-brand" style={{
                  fontSize: '24px',
                  fontWeight: 400,
                  color: 'var(--foreground)',
                  letterSpacing: '0.02em',
                  lineHeight: 1.2,
                }}>
                  Mountains Ink
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--accent)',
                  lineHeight: 1.2,
                  direction: 'rtl',
                  fontFamily: 'var(--font-arabic)',
                }}>
                  کتێبخانەی مۆرکی چیاکان
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
          }}
          className="hidden md:flex"
          >
            {navLinks.map(link => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: pathname === link.href ? 'var(--accent)' : 'var(--foreground)',
                  opacity: pathname === link.href ? 1 : 0.7,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
            {/* Removed Search Button */}

            {/* Theme Toggle */}
            <VanGoghToggle />

            {/* Removed Account Link */}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--foreground)',
                border: 'none',
                background: 'transparent',
              }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Removed Search Overlay */}

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden"
              style={{
                position: 'fixed',
                top: '80px',
                left: 0,
                right: 0,
                background: 'var(--card)',
                backdropFilter: 'blur(30px)',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                borderBottom: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 999,
              }}
            >
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    textDecoration: 'none',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'var(--foreground)',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {/* Removed Account Link Mobile */}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div style={{ height: '80px' }} />
    </>
  );
}
