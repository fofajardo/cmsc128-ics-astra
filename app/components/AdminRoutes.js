export const SideNavItem = [
  { title: "Dashboard", path: "/admin/dashboard", icon: "lucide:layout-grid" },
  {
    title: "Alumni",
    icon: "lucide:graduation-cap",
    children: [
      { title: "Search", path: "/admin/alumni/search", icon: "lucide:user-search" },
      { title: "Manage Access", path: "/admin/alumni/access", icon: "lucide:key-round" },
    ],
  },
  { title: "Events", path: "/admin/events", icon: "lucide:calendar" },
  { title: "Jobs", path: "/admin/jobs", icon: "lucide:briefcase" },
  { title: "Donations", path: "/admin/donations", icon: "lucide:hand-heart" },
  { title: "Communications", path: "/admin/communications", icon: "lucide:message-square" },
];
