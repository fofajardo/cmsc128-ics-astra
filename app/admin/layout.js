import NavbarAdmin from '@/components/NavbarAdmin';
import Footer from '@/components/Footer';
import "@/styles/globals.css";

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
