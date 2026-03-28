'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/Toast';
import PageTransition from '@/components/PageTransition';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      showToast('Please enter both username and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        showToast('Login successful', 'success');
        // Refresh router so the middleware accurately reads the new cookie
        window.location.href = '/admin';
      } else {
        showToast('Invalid credentials', 'error');
        setLoading(false);
      }
    } catch {
      showToast('Login failed. Please try again.', 'error');
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--background)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: '420px',
            background: 'var(--card)',
            padding: '48px 40px',
            borderRadius: '0px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-color)',
            textAlign: 'center'
          }}
        >
          {/* Logo or Icon */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--foreground)', color: 'var(--background)', borderRadius: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={28} />
            </div>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>Admin Portal</h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '40px', fontWeight: 500 }}>Enter your credentials to manage the Artisan Library.</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '48px', height: '52px', fontSize: '14px' }}
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '48px', height: '52px', fontSize: '14px' }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              autoFocus
              style={{
                background: 'var(--foreground)',
                color: 'var(--background)',
                border: 'none',
                height: '52px',
                marginTop: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </PageTransition>
  );
}
