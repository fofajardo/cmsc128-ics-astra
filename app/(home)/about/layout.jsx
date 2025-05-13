import {ActiveNavItemMarker} from "@/components/Header.jsx";
import {NavMenuItemId} from "../../../common/scopes.js";

export const metadata = {
  title: "About",
  description: "Learn about the team and story behind this platform.",
};

export default function RootLayout({ children }) {
  return <>
    <ActiveNavItemMarker id={NavMenuItemId.ABOUT} />
    {children}
  </>;
}
