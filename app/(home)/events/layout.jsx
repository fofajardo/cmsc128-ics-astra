import {ActiveNavItemMarker} from "@/components/Header.jsx";
import {NavMenuItemId} from "../../../common/scopes.js";

export const metadata = {
  title: "Events",
  description: "Explore and manage campus events with powerful filters and real-time updates.",
};

export default function RootLayout({ children }) {
  return <>
    <ActiveNavItemMarker id={NavMenuItemId.EVENTS} />
    {children}
  </>;
}
