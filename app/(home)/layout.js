import NavbarUser from '../components/NavbarUser'; // Swap this line in
import Footer from '../components/Footer'; 
import '../styles/globals.css';
import '../styles/styles.css';
import Navbar from '../components/Navbar';
import NavbarAdmin from '../components/NavbarAdmin';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavbarUser />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
