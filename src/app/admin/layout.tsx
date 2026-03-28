'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingCart,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed');
    }
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/books', label: 'Books', icon: BookOpen },
  ];

  if (pathname === '/admin/login') {
    return (
      <main style={{ 
        minHeight: '100vh', 
        // @ts-ignore
        '--background': '#f8f6f3',
        '--foreground': '#2D1B10',
        '--card': '#ffffff',
        '--card-hover': '#f5f3f0',
        '--border-color': 'rgba(45, 27, 16, 0.12)',
        '--muted': '#5D4336',
        '--accent': '#906948',
        '--glass': 'rgba(255,255,255,0.95)',
        '--shadow-lg': '0 8px 32px rgba(0,0,0,0.06)',
        background: '#f8f6f3',
      } as React.CSSProperties}>
        {children}
      </main>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      // Override CSS variables for admin with solid, opaque colors
      // @ts-ignore
      '--background': '#f8f6f3',
      '--foreground': '#2D1B10',
      '--card': '#ffffff',
      '--card-hover': '#f5f3f0',
      '--border-color': 'rgba(45, 27, 16, 0.12)',
      '--muted': '#5D4336',
      '--accent': '#906948',
      '--accent-gold': '#B8860B',
      '--glass': 'rgba(255,255,255,0.95)',
      '--glass-border': 'rgba(45, 27, 16, 0.1)',
      '--shadow-sm': '0 2px 8px rgba(0,0,0,0.04)',
      '--shadow-lg': '0 8px 32px rgba(0,0,0,0.06)',
      background: '#f8f6f3',
    } as React.CSSProperties}>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? '80px' : '280px' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          background: '#ffffff',
          borderRight: '1px solid var(--border-color)',
          padding: '32px 16px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          marginBottom: '48px',
          padding: '0 8px',
        }}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                fontSize: '20px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldCheck size={24} color="var(--accent)" />
              <span>Admin <span style={{ fontWeight: 400, fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>Panel</span></span>
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.1, background: 'var(--card-hover)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed(!collapsed)}
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
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </motion.button>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: 'none',
                  padding: '14px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  color: isActive ? 'var(--background)' : 'var(--foreground)',
                  background: isActive ? 'var(--foreground)' : 'transparent',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              padding: '14px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: 'var(--muted)',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={20} />
            {!collapsed && 'Back to Site'}
          </Link>
          
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: 'var(--error)',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
          >
            <LogOut size={20} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main style={{ flex: 1, height: '100vh', overflow: 'auto', padding: '40px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
