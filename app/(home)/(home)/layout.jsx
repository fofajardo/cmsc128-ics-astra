import {ActiveNavItemMarker} from "@/components/Header.jsx";
import {NavMenuItemId} from "../../../common/scopes.js";
import {RouteGuard} from "@/components/RouteGuard.jsx";

export default function RootLayout({children}) {
  return <RouteGuard
    component={
      <>
        <ActiveNavItemMarker id={NavMenuItemId.HOME}/>
        {children}
      </>
    }
  />;
}
