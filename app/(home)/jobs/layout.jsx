import {ActiveNavItemMarker} from "@/components/Header.jsx";
import {NavMenuItemId, RouteGuardMode} from "../../../common/scopes.js";
import {RouteGuard} from "@/components/RouteGuard.jsx";

export const metadata = {
  title: "Job Opportunities",
  description: "Browse job postings shared by ICS alumni and partners to help kickstart your career.",
};

export default function RootLayout({children}) {
  return <RouteGuard
    mode={RouteGuardMode.AUTHENTICATED}
    component={
      <>
        <ActiveNavItemMarker id={NavMenuItemId.JOBS}/>
        {children}
      </>
    }
  />;
}
