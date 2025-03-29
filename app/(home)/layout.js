import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; 
import '../styles/globals.css';
import '../styles/styles.css';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar /> 
        <main>{children}</main> 
        <Footer /> 
      </body>
    </html>
  );
}