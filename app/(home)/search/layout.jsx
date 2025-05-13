import {ActiveNavItemMarker} from "@/components/Header.jsx";
import {NavMenuItemId} from "../../../common/scopes.js";

export const metadata = {
  title: "Search Alumni",
  description: "Find and connect with ICS alumni based on skills, graduation year, and location.",
};

export default function RootLayout({ children }) {
  return <>
    <ActiveNavItemMarker id={NavMenuItemId.ALUMNI_DIRECTORY} />
    {children}
  </>;
}
