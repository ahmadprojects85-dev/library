'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    // Admin pages: no Navbar/Footer, admin has its own sidebar layout
    return <>{children}</>;
  }

  // Public pages: show Navbar + Footer
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </>
  );
}
