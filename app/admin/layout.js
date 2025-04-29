import NavbarAdmin from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";
import "@/styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen max-w-screen overflow-x-hidden">

        <div className="fixed top-0 left-0 w-full z-50">
          <NavbarAdmin />
        </div>

        <div className="flex flex-col min-h-screen pt-20">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
