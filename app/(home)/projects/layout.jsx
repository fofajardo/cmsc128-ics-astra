import {ActiveNavItemMarker} from "@/components/Header.jsx";
import {NavMenuItemId} from "../../../common/scopes.js";
import {RouteGuard} from "@/components/RouteGuard.jsx";

export const metadata = {
  title: "Projects",
  description: "Fund the future of technology through scholarships and fundraisers.",
};

export default function RootLayout({children}) {
  return <RouteGuard
    component={
      <>
        <ActiveNavItemMarker id={NavMenuItemId.PROJECTS}/>
        {children}
      </>
    }
  />;
}
