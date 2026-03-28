'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: 'Phone (Primary)',
      value: '07515364194',
      label: 'Call or WhatsApp',
      href: 'tel:07515364194'
    },
    {
      icon: <Phone size={24} />,
      title: 'Phone (Secondary)',
      value: '07721094314',
      label: 'Call or WhatsApp',
      href: 'tel:07721094314'
    },
    {
      icon: <Mail size={24} />,
      title: 'Email',
      value: 'mountainsbookstore@gmail.com',
      label: 'Official Inquiries',
      href: 'mailto:mountainsbookstore@gmail.com'
    },
    {
      icon: <Clock size={24} />,
      title: 'Availability',
      value: 'Sat — Thu: 9 AM - 9 PM',
      label: 'Response Time: < 2 Hours',
      href: null
    }
  ];

  return (
    <PageTransition>
      <main style={{ minHeight: '100vh', padding: '120px 24px 160px', background: 'var(--background)', color: 'var(--foreground)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 style={{
                fontSize: 'clamp(40px, 6vw, 72px)',
                fontWeight: 400,
                marginBottom: '16px',
                color: 'var(--foreground)'
              }}>
                Get in Touch
              </h1>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 500,
                color: 'var(--accent)',
                fontFamily: 'var(--font-arabic)',
                direction: 'rtl',
                marginBottom: '32px'
              }}>
                پەیوەندیمان پێوە بکەن
              </h2>
              <div style={{
                width: '60px',
                height: '2px',
                background: 'var(--accent)',
                margin: '0 auto',
                opacity: 0.5
              }} />
            </motion.div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '80px',
            alignItems: 'start'
          }}>
            {/* Left: Contact Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h3 style={{ 
                  fontSize: '12px', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.2em', 
                  color: 'var(--muted)', 
                  marginBottom: '40px' 
                }}>
                  Direct Channels
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  {contactInfo.map((info, i) => (
                    <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'var(--card)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        {info.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>
                          {info.title}
                        </div>
                        {info.href ? (
                          <a href={info.href} style={{ 
                            fontSize: '18px', 
                            fontWeight: 500, 
                            color: 'var(--foreground)', 
                            textDecoration: 'none',
                            display: 'block',
                            marginBottom: '4px'
                          }}>
                            {info.value}
                          </a>
                        ) : (
                          <div style={{ 
                            fontSize: '18px', 
                            fontWeight: 500, 
                            color: 'var(--foreground)', 
                            marginBottom: '4px' 
                          }}>
                            {info.value}
                          </div>
                        )}
                        <span style={{ fontSize: '14px', color: 'var(--muted)', opacity: 0.8 }}>
                          {info.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 1, delay: 0.6 }}
                style={{
                  padding: '32px',
                  background: 'var(--glass)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '24px',
                  border: '1px solid var(--glass-border)',
                  marginTop: '40px'
                }}
              >
                <p style={{ fontSize: '14px', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "Literature is the most agreeable way of ignoring life." 
                  <br />
                  <span style={{ fontWeight: 600 }}>— Fernando Pessoa</span>
                </p>
              </motion.div>
            </div>

            {/* Right: Message Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                background: 'var(--card)',
                padding: '48px',
                borderRadius: '0px', // Sophisticated boxy look
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative'
              }}
            >
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>Send a Message</h3>
                <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Our curators will respond with diligence.</p>
              </div>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} onSubmit={(e) => e.preventDefault()}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)' }}>Name</label>
                    <input className="form-input" style={{ background: 'var(--background)' }} placeholder="Your name" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)' }}>Email</label>
                    <input className="form-input" style={{ background: 'var(--background)' }} placeholder="Your email" />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)' }}>Message</label>
                  <textarea className="form-input" style={{ background: 'var(--background)', minHeight: '150px', paddingTop: '16px' }} placeholder="How can we assist your literary journey?" />
                </div>

                <button style={{
                  height: '56px',
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease',
                  marginTop: '12px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
                >
                  <Send size={18} />
                  Dispatch Message
                </button>
              </form>

              {/* Decorative Corner */}
              <div style={{
                position: 'absolute',
                top: '-1px',
                right: '-1px',
                width: '40px',
                height: '40px',
                borderTop: '3px solid var(--accent)',
                borderRight: '3px solid var(--accent)',
              }} />
            </motion.div>
          </div>

        </div>
      </main>
    </PageTransition>
  );
}
