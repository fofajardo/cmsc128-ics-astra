"use client";
import NavbarUser from '../components/NavbarUser'; // Swap this line in
import Footer from '../components/Footer'; 
import { usePathname } from 'next/navigation';
import '../styles/globals.css';
import '../styles/styles.css';
import Navbar from '../components/Navbar';
import NavbarAdmin from '../components/NavbarAdmin';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isRequestPage = pathname.startsWith('/projects/request');

  return (
    <html lang="en">
      <body>
        {!isRequestPage && <NavbarUser />}
        <main>{children}</main>
        {!isRequestPage && <Footer />}
      </body>
    </html>
  );
}
