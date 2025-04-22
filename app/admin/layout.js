import NavbarAdmin from '@/components/NavbarAdmin';
import '../styles/globals.css';
import '../styles/styles.css';

export default function AdminLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <NavbarAdmin />
                <main className="pt-20">{children}</main>
            </body>
        </html>
    );
}
