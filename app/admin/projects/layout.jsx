import {NavMenuItemId} from "../../../common/scopes.js";
import {ActiveNavItemMarker} from "@/components/Header.jsx";

export const metadata = {
  title: "Project Management",
  description: "Manage and oversee ICS-ASTRA projects from the admin dashboard.",
};

export default function AdminProjectsLayout({ children }) {
  return <>
    <ActiveNavItemMarker id={NavMenuItemId.PROJECTS}/>
    {children}
  </>;
}