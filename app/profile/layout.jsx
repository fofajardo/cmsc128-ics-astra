import "../styles/globals.css";
import "../styles/styles.css";
import {Header} from "../components/Header.jsx";
import {UserFetcher, UserProvider} from "@/components/UserContext.jsx";
import ProfileInterstitial from "@/components/ProfileInterstitial.js";

export default function RootLayout({ children }) {
  return (
    <>
      <Header />
      <UserProvider>
        <UserFetcher inferId="id" isMinimal={false} />
        <ProfileInterstitial>
          {children}
        </ProfileInterstitial>
      </UserProvider>
    </>
  );
}
