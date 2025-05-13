import {ActiveNavItemMarker} from "@/components/Header.jsx";
import {NavMenuItemId} from "../../../common/scopes.js";

export const metadata = {
  title: "Job Opportunities",
  description: "Browse job postings shared by ICS alumni and partners to help kickstart your career.",
};

export default function RootLayout({ children }) {
  return <>
    <ActiveNavItemMarker id={NavMenuItemId.JOBS} />
    {children}
  </>;
}
