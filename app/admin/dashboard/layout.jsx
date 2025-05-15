import {ActiveNavItemMarker} from "@/components/Header.jsx";
import {NavMenuItemId} from "../../../common/scopes.js";

export const metadata = {
  title: "Dashboard",
  description: "Manage users, projects, and platform content via the ICS-ASTRA admin dashboard.",
};

export default function RootLayout({children}) {
  return <>
    <ActiveNavItemMarker id={NavMenuItemId.HOME}/>
    {children}
  </>;
}
