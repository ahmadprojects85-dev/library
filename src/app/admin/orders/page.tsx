'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  CheckCircle,
  Trash2,
  Clock,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  Mail,
} from 'lucide-react';
import { Order } from '@/lib/types';
import { useToast } from '@/components/Toast';
import PageTransition from '@/components/PageTransition';

export default function OrdersPage() {
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'pending' | 'accepted' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrdersList(data);
        setLoading(false);
      });
  }, []);

  const filteredOrders = ordersList.filter(order => {
    const matchesSearch = !search ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = order.status === filter;
    return matchesSearch && matchesFilter;
  });

  const updateStatus = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error();
      setOrdersList(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      showToast(`Order ${status === 'accepted' ? 'Accepted' : 'Rejected'}`, 'success');
    } catch {
      showToast('Failed to update order', 'error');
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setOrdersList(prev => prev.filter(o => o.id !== id));
      showToast('Order deleted', 'success');
    } catch {
      showToast('Failed to delete order', 'error');
    }
  };

  return (
    <PageTransition>
      <div style={{ maxWidth: '1100px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '36px' }}
        >
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Orders Management
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--muted)', marginTop: '4px' }}>
            Review and process incoming book requests
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--muted)',
            }} />
            <input
              type="text"
              placeholder="Search by name, book or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '46px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', background: 'var(--card)', padding: '6px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            {(['pending', 'accepted', 'rejected'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '12px',
                  background: filter === f ? 'var(--foreground)' : 'transparent',
                  color: filter === f ? 'var(--background)' : 'var(--muted)',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
             <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
               <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--muted)' }} />
             </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98, x: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    padding: '32px',
                    borderRadius: '0px',
                    background: 'var(--card)',
                    border: '1px solid var(--border-color)',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '32px',
                    alignItems: 'start',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--muted)',
                        padding: '4px 10px',
                        borderRadius: '0px',
                        background: 'var(--background)',
                        border: '1px solid var(--border-color)',
                        fontFamily: 'monospace',
                      }}>
                        #{order.id.slice(-6).toUpperCase()}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: order.status === 'accepted' ? '#059669' : order.status === 'rejected' ? 'var(--error)' : 'var(--accent)'
                      }}>
                        {order.status}
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '24px',
                    }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px', color: 'var(--foreground)' }}>
                          {order.customerName}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Phone size={14} />
                            {order.phone}
                          </div>
                          {order.email && (
                            <div style={{ fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Mail size={14} />
                              {order.email}
                            </div>
                          )}
                          <div style={{ fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'start', gap: '8px' }}>
                            <MapPin size={14} style={{ marginTop: '2px' }} />
                            <div>
                              <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>{order.city}</span><br />
                              {order.address}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div style={{ 
                          padding: '16px', 
                          background: 'var(--background)', 
                          border: '1px solid var(--border-color)',
                          borderRadius: '0px'
                        }}>
                          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
                             {order.bookTitle}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>
                            Date: {order.date}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <span style={{ fontSize: '13px', fontWeight: 600 }}>Qty: {order.quantity}</span>
                             <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--accent)' }}>{order.totalPrice.toLocaleString()} د.ع</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    minWidth: '140px'
                  }}>
                    {order.status === 'pending' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateStatus(order.id, 'accepted')}
                          style={{
                            padding: '12px',
                            background: 'var(--foreground)',
                            color: 'var(--background)',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}
                        >
                          Accept Order
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateStatus(order.id, 'rejected')}
                          style={{
                            padding: '12px',
                            background: 'transparent',
                            color: 'var(--error)',
                            border: '1px solid var(--error)',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}
                        >
                          Reject
                        </motion.button>
                      </>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => deleteOrder(order.id)}
                      style={{
                        padding: '12px',
                        background: 'transparent',
                        color: 'var(--muted)',
                        border: '1px solid var(--border-color)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginTop: order.status === 'pending' ? '12px' : '0'
                      }}
                    >
                      Archive
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

        {!loading && filteredOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '60px 24px',
                color: 'var(--muted)',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--foreground)' }}>
                No orders found
              </h3>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
