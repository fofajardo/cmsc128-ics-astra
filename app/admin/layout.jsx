import NavbarAdmin from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";
import "@/styles/globals.css";
import {RouteGuard} from "@/components/RouteGuard.jsx";
import {Header} from "@/components/Header.jsx";

export default function RootLayout({ children }) {
  return (
    <div className="relative min-h-screen max-w-screen overflow-x-hidden">
      <RouteGuard mode={RouteGuardMode.ADMIN} />
      <div className="fixed top-0 left-0 w-full z-50">
        <Header fromAdmin={true} />
      </div>

      <div className="flex flex-col min-h-screen pt-20">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
