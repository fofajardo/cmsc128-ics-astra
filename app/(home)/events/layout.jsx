import {ActiveNavItemMarker} from "@/components/Header.jsx";
import {NavMenuItemId} from "../../../common/scopes.js";
import {RouteGuard} from "@/components/RouteGuard.jsx";

export const metadata = {
  title: "Events",
  description: "Explore and manage campus events with powerful filters and real-time updates.",
};

export default function RootLayout({children}) {
  return <RouteGuard
    component={
      <>
        <ActiveNavItemMarker id={NavMenuItemId.EVENTS}/>
        {children}
      </>
    }
  />;
}
