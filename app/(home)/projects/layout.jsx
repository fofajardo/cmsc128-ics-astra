import {ActiveNavItemMarker} from "@/components/Header.jsx";
import {NavMenuItemId} from "../../../common/scopes.js";

export const metadata = {
  title: "Projects",
  description: "Fund the future of technology through scholarships and fundraisers.",
};

export default function RootLayout({ children }) {
  return <>
    <ActiveNavItemMarker id={NavMenuItemId.PROJECTS} />
    {children}
  </>;
}
