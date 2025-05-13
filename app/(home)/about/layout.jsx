import {ActiveNavItemMarker} from "@/components/Header.jsx";
import {NavMenuItemId} from "../../../common/scopes.js";
import {RouteGuard} from "@/components/RouteGuard.jsx";

export const metadata = {
  title: "About",
  description: "Learn about the team and story behind this platform.",
};

export default function RootLayout({children}) {
  return <RouteGuard
    component={
      <>
        <ActiveNavItemMarker id={NavMenuItemId.ABOUT}/>
        {children}
      </>
    }
  />;
}
