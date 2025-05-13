import Footer from "@/components/Footer";
import "@/styles/globals.css";
import {RouteGuard} from "@/components/RouteGuard.jsx";
import {Header} from "@/components/Header.jsx";
import {RouteGuardMode} from "../../common/scopes.js";

export default function RootLayout({children}) {
  return (
    <RouteGuard
      mode={RouteGuardMode.AUTHENTICATED_ADMIN}
      component={
        <div className="relative min-h-screen max-w-screen">
          <Header fromAdmin={true}/>
          <main className="flex-1">
            {children}
          </main>
          <Footer/>
        </div>
      }
    />
  );
}
