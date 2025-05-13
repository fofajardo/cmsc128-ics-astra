import {ActiveNavItemMarker} from "@/components/Header.jsx";
import {NavMenuItemId} from "../../../common/scopes.js";

export default function RootLayout({ children }) {
  return <>
    <ActiveNavItemMarker id={NavMenuItemId.HOME} />
    {children}
  </>;
}
