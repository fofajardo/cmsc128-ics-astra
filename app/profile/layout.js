import '../styles/globals.css';
import '../styles/styles.css';
import NavbarUser from '../components/NavbarUser';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body>
          <NavbarUser /> 
          <main>{children}</main> 
        </body>
    </html>
  )
}
