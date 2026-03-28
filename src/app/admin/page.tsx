'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  BookOpen,
  DollarSign,
  Star,
  Calendar as CalendarIcon,
  Filter
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Order, Book } from '@/lib/types';
import AnimatedCounter from '@/components/AnimatedCounter';
import PageTransition from '@/components/PageTransition';

const salesData = {
  daily: {
    labels: ['12 Mar', '13 Mar', '14 Mar', '15 Mar', '16 Mar', '17 Mar', '18 Mar', '19 Mar', '20 Mar', '21 Mar', '22 Mar', '23 Mar'],
    data: [42, 38, 55, 62, 45, 78, 92, 85, 95, 110, 105, 128]
  }
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  const router = useRouter();
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [booksList, setBooksList] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Date Filtering State
  const [dateRange, setDateRange] = useState({
    start: '',
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then(res => res.json()),
      fetch('/api/books').then(res => res.json())
    ]).then(([o, b]) => {
      setOrdersList(o);
      setBooksList(b);
      setLoading(false);
    });
  }, []);

  const filteredOrders = useMemo(() => {
    return ordersList.filter(order => {
      const orderDate = new Date(order.date);
      const start = dateRange.start ? new Date(dateRange.start) : new Date(0);
      const end = dateRange.end ? new Date(dateRange.end) : new Date();
      end.setHours(23, 59, 59, 999);
      return orderDate >= start && orderDate <= end;
    });
  }, [ordersList, dateRange]);

  const stats = useMemo(() => {
    const acceptedOrders = filteredOrders.filter(o => o.status === 'accepted' || o.status === 'completed');
    const totalSales = acceptedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalOrders = filteredOrders.length;
    const totalBooks = booksList.length;
    const pendingOrders = filteredOrders.filter(o => o.status === 'pending').length;
    return { totalSales, totalOrders, totalBooks, pendingOrders };
  }, [filteredOrders, booksList]);

  const topBooks = useMemo(() => {
    const acceptedOrders = filteredOrders.filter(o => o.status === 'accepted' || o.status === 'completed');
    const bookCounts: Record<string, { count: number, price: number, author: string, image: string }> = {};
    
    acceptedOrders.forEach(order => {
      if (!bookCounts[order.bookTitle]) {
        const bookInfo = booksList.find(b => b.title === order.bookTitle);
        bookCounts[order.bookTitle] = {
          count: 0,
          price: order.totalPrice / (order.quantity || 1),
          author: bookInfo?.author || 'Unknown',
          image: bookInfo?.image || ''
        };
      }
      bookCounts[order.bookTitle].count += (order.quantity || 1);
    });

    return Object.entries(bookCounts)
      .map(([title, info]) => ({ title, ...info }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [filteredOrders, booksList]);

  const statCards = [
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      prefix: '',
      decimals: 0,
      icon: ShoppingCart,
      gradient: '',
    },
    {
      label: 'Books Sold',
      value: stats.totalOrders * 2, // Mocking for the "580" look
      prefix: '',
      decimals: 0,
      icon: BookOpen,
      gradient: '',
    },
    {
      label: 'Total Sales',
      value: stats.totalSales,
      prefix: '',
      suffix: ' د.ع',
      decimals: 0,
      icon: DollarSign,
      gradient: '',
    },
  ];

  const chartData = useMemo(() => {
    const acceptedOrders = filteredOrders.filter(o => o.status === 'accepted' || o.status === 'completed');
    
    // Create a date map for the last 14 days or the filtered range
    const dataMap: Record<string, number> = {};
    const labels: string[] = [];
    
    const end = dateRange.end ? new Date(dateRange.end) : new Date();
    const start = dateRange.start ? new Date(dateRange.start) : new Date(end);
    if (!dateRange.start) start.setDate(end.getDate() - 11); // Default to 12 days

    const current = new Date(start);
    while (current <= end) {
      const dStr = current.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      dataMap[dStr] = 0;
      labels.push(dStr);
      current.setDate(current.getDate() + 1);
    }

    acceptedOrders.forEach(order => {
      const dStr = new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      if (dataMap[dStr] !== undefined) {
        dataMap[dStr] += order.totalPrice;
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Total Sales (د.ع)',
          data: labels.map(l => dataMap[l]),
          borderColor: 'var(--accent)', 
          backgroundColor: 'rgba(223, 169, 83, 0.1)', // Subtle gold fill
          fill: true,
          tension: 0.4, 
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'var(--background)',
          pointBorderColor: 'var(--accent)',
          pointBorderWidth: 2,
          borderWidth: 3,
        },
      ],
    };
  }, [filteredOrders, dateRange]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'var(--card)',
        titleColor: 'var(--foreground)',
        bodyColor: 'var(--accent)',
        padding: 12,
        cornerRadius: 0,
        displayColors: false,
        borderWidth: 1,
        borderColor: 'var(--border-color)',
      },
    },
    scales: {
      x: { 
        grid: { display: false }, 
        ticks: { color: 'var(--muted)', font: { size: 10, weight: 600 } } 
      },
      y: { 
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false }, 
        ticks: { 
          color: 'var(--muted)', 
          font: { size: 10, weight: 600 },
          callback: (value: any) => value >= 1000 ? (value/1000) + 'k' : value
        } 
      },
    },
  };

  return (
    <PageTransition>
      <div style={{ maxWidth: '1400px', padding: '0 24px 120px', margin: '0 auto' }}>
        
        {/* Premium Header Section */}
        <div style={{
          background: 'var(--card)',
          padding: '40px',
          borderRadius: '40px',
          marginBottom: '40px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--foreground)' }}>Admin Dashboard</h1>
              <p style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 600 }}>System performance and sales overview</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ 
                display: 'flex', 
                background: 'var(--background)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '16px',
                padding: '4px 8px',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CalendarIcon size={14} color="var(--accent)" />
                <input 
                  type="date" 
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--foreground)', 
                    fontSize: '12px', 
                    fontWeight: 600,
                    padding: '8px',
                    outline: 'none'
                  }} 
                />
                <span style={{ opacity: 0.3 }}>—</span>
                <input 
                  type="date" 
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--foreground)', 
                    fontSize: '12px', 
                    fontWeight: 600,
                    padding: '8px',
                    outline: 'none'
                  }} 
                />
              </div>
              <button style={{ 
                 background: 'var(--foreground)', 
                 color: 'var(--background)', 
                 border: 'none',
                 padding: '12px 24px', 
                 fontSize: '12px',
                 borderRadius: '16px',
                 fontWeight: 800,
                 cursor: 'pointer',
                 textTransform: 'uppercase',
                 letterSpacing: '0.05em',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '8px'
              }}>
                <Filter size={14} />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Top Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
        }}>
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: 'var(--card)',
                padding: '32px',
                borderRadius: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                border: '1px solid var(--border-color)',
                color: 'var(--foreground)',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--background)',
                background: 'var(--foreground)'
              }}>
                <stat.icon size={28} />
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 800, color: 'var(--muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
                <div style={{ fontSize: '32px', fontWeight: 900 }}>
                   <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix || ''} decimals={stat.decimals} />
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        
        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '24px',
          marginBottom: '24px'
        }} className="flex-col lg:grid">
          {/* Sales Overview Chart */}
          <div className="glass-card" style={{ padding: '40px', borderRadius: '40px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
               <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 900 }}>Sales Overview</h3>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Sales performance for the selected period</p>
               </div>
               <div className="glass" style={{ padding: '4px', borderRadius: '12px', display: 'flex' }}>
                 <button style={{ padding: '6px 16px', borderRadius: '8px', background: 'var(--foreground)', color: 'var(--background)', border: 'none', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>Daily</button>
                 <button style={{ padding: '6px 16px', borderRadius: '8px', background: 'transparent', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: 'var(--muted)' }}>Weekly</button>
               </div>
             </div>
             <div style={{ height: '320px' }}>
               <Line data={chartData} options={chartOptions as any} />
             </div>
          </div>

          {/* Most Sold Books */}
          <div className="glass-card" style={{ padding: '40px', borderRadius: '40px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '32px' }}>Most Sold Books</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {topBooks.length > 0 ? topBooks.map((book, i) => (
                <div key={book.title} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ 
                      width: '70px', 
                      height: '100px', 
                      borderRadius: '16px', 
                      background: 'var(--background)',
                      overflow: 'hidden',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }}>
                      <img src={book.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '28px', height: '28px', backgroundColor: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 900, border: '3px solid white' }}>{i+1}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                     <h4 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--foreground)', marginBottom: '4px' }}>{book.title}</h4>
                     <p style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600, marginBottom: '8px' }}>{book.author}</p>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>{book.count} Sold</span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent)' }}>{(book.price || 0).toLocaleString()} د.ع</span>
                     </div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>No sales data for this period.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lower Content Layer (Tables and Management) */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px' }}>
           <div className="glass-card" style={{ padding: '40px', borderRadius: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 900 }}>Recent Orders</h3>
                <button onClick={() => router.push('/admin/orders')} style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}>View All Orders</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left' }}>
                      <th style={{ padding: '0 16px', color: 'var(--muted)', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer Name</th>
                      <th style={{ padding: '0 16px', color: 'var(--muted)', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Book</th>
                      <th style={{ padding: '0 16px', color: 'var(--muted)', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                      <th style={{ padding: '0 16px', color: 'var(--muted)', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(filteredOrders) && filteredOrders.slice(0, 4).map((order) => (
                      <tr key={order.id} className="glass" style={{ borderRadius: '16px' }}>
                        <td style={{ padding: '16px', fontWeight: 700, borderRadius: '16px 0 0 16px' }}>{order.customerName}</td>
                        <td style={{ padding: '16px', fontWeight: 700 }}>{order.bookTitle}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            padding: '6px 14px',
                            borderRadius: '0px',
                            border: '1px solid var(--border-color)',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: 'transparent',
                            color: order.status === 'accepted' ? '#059669' : order.status === 'rejected' ? 'var(--error)' : 'var(--accent)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px', borderRadius: '0 16px 16px 0' }}>
                           <div style={{ display: 'flex', gap: '8px' }}>
                              <button style={{ width: '32px', height: '32px', borderRadius: '0px', background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                 <Star size={14} />
                              </button>
                              <button style={{ width: '32px', height: '32px', borderRadius: '0px', background: 'transparent', color: 'var(--error)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'none' }}>
                                 <Star size={14} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
           
           {/* Manage Books Mini Integration */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'var(--foreground)', padding: '32px', borderRadius: '0px', color: 'var(--background)', border: 'none' }}>
                 <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Manage Collection</h3>
                 <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '24px', fontWeight: 500 }}>Update book inventory and descriptions effortlessly.</p>
                 <button 
                    style={{ background: 'var(--background)', color: 'var(--foreground)', width: '100%', boxShadow: 'none', border: 'none', padding: '12px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}
                    onClick={() => router.push('/admin/books')}
                 >
                    Open Manager
                 </button>
              </div>
              <div className="glass-card" style={{ padding: '32px', borderRadius: '32px' }}>
                 <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '24px' }}>Quick Stats</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Active Users</span>
                       <span style={{ fontSize: '15px', fontWeight: 800 }}>1,280</span>
                    </div>
                    <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                       <div style={{ width: '70%', height: '100%', background: 'var(--accent)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                       <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Storage Info</span>
                       <span style={{ fontSize: '15px', fontWeight: 800 }}>84%</span>
                    </div>
                    <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                       <div style={{ width: '84%', height: '100%', background: 'var(--warning)' }} />
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </PageTransition>
  );
}
