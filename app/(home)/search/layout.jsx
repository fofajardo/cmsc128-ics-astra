import {ActiveNavItemMarker} from "@/components/Header.jsx";
import {NavMenuItemId, RouteGuardMode} from "../../../common/scopes.js";
import {RouteGuard} from "@/components/RouteGuard.jsx";

export const metadata = {
  title: "Search Alumni",
  description: "Find and connect with ICS alumni based on skills, graduation year, and location.",
};

export default function RootLayout({children}) {
  return <RouteGuard
    mode={RouteGuardMode.AUTHENTICATED}
    component={
      <>
        <ActiveNavItemMarker id={NavMenuItemId.ALUMNI_DIRECTORY}/>
        {children}
      </>
    }
  />;
}
