import {ActiveNavItemMarker} from "@/components/Header.jsx";
import {NavMenuItemId, RouteGuardMode} from "../../../common/scopes.js";
import {RouteGuard} from "@/components/RouteGuard.jsx";

export default function RootLayout({children}) {
  return <RouteGuard
    mode={RouteGuardMode.AUTHENTICATED}
    component={
      <>
        {children}
      </>
    }
  />;
}
