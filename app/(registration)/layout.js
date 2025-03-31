import '../styles/globals.css';
import '../styles/styles.css';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main> 
      </body>
    </html>
  );
}