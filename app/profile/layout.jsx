import "../styles/globals.css";
import "../styles/styles.css";
import {ActiveNavItemMarker, Header} from "../components/Header.jsx";
import {UserFetcher, UserProvider} from "@/components/UserContext.jsx";
import ProfileInterstitial from "@/components/ProfileInterstitial.jsx";
import {NavMenuItemId} from "../../common/scopes.js";

export default function RootLayout({ children }) {
  return (
    <>
      <Header />
      <UserProvider>
        <UserFetcher inferId="id" isMinimal={false} />
        <ActiveNavItemMarker id={NavMenuItemId.NONE}/>
        <ProfileInterstitial>
          {children}
        </ProfileInterstitial>
      </UserProvider>
    </>
  );
}
