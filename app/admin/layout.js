import NavbarAdmin from '@/components/NavbarAdmin';
import '../styles/globals.css';
import '../styles/styles.css';

export default function AdminLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <NavbarAdmin />
                <main className="p-4">{children}</main>
            </body>
        </html>
    );
}
