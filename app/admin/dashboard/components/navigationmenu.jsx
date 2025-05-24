"use client";

import { Check } from "lucide-react"; // Optional: for a check icon
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

const tabOptions = {
  demographics: [
    { value: "age", label: "Age", description: "View alumni age distribution." },
    { value: "sex", label: "Sex", description: "See alumni by gender." },
    { value: "civil", label: "Civil Status", description: "Civil status breakdown." },
    { value: "batch", label: "Batch", description: "Alumni by graduation batch." },
  ],
  career: [
    { value: "field", label: "Field/Industry", description: "Industries and fields of alumni." },
    { value: "employment", label: "Employment Status", description: "Employment status overview." },
    { value: "income", label: "Income Range", description: "Income range distribution." },
    { value: "org", label: "Org Affiliation", description: "Organization affiliations." },
    { value: "donations", label: "Donations", description: "Alumni donations and fundraising." },
    { value: "degree", label: "Highest Degree", description: "Highest degree obtained by alumni." },
  ],
  status: [
    { value: "alumni", label: "Alumni Status", description: "Active, inactive, and other statuses." },
    { value: "events", label: "Events", description: "Alumni events status." },
  ],
};

function getSelectedLabel(category, tab) {
  const found = tabOptions[category].find(opt => opt.value === tab);
  return found ? found.label : category.charAt(0).toUpperCase() + category.slice(1);
}

export function NavigationMenuDemo({
  tab,
  setTab,
}) {
  const getCategoryByTab = (tab) => {
    for (const key in tabOptions) {
      if (tabOptions[key].some(opt => opt.value === tab)) return key;
    }
    return "demographics";
  };
  const currentCategory = getCategoryByTab(tab);

  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList className="w-full">
        <NavigationMenuItem>
          <div className="font-sb">
            Demographics
          </div>
          <NavigationMenuTrigger>
            {currentCategory === "demographics" && getSelectedLabel("demographics", tab) !== "Demographics" ? (
              <span className="font-semibold text-astraprimary flex items-center gap-1 line-clamp-1">
                {getSelectedLabel("demographics", tab)}
                {/* <Check className="w-4 h-4" /> */}
              </span>
            ) : (
              "Select..."
            )}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid grid-cols-2 gap-2 p-3 w-90 md:w-max">
              {tabOptions.demographics.map(opt => (
                <li key={opt.value}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      tab === opt.value
                        ? "bg-astraprimary text-white"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setTab(opt.value)}
                    type="button"
                  >
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-foreground">{opt.description}</div>
                  </button>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <div className="font-sb">
            Career
          </div>
          <NavigationMenuTrigger>
            {currentCategory === "career" && getSelectedLabel("career", tab) !== "Career" ? (
              <span className="font-semibold text-primary flex items-center gap-1 line-clamp-1">
                {getSelectedLabel("career", tab)}
                {/* <Check className="w-4 h-4" /> */}
              </span>
            ) : (
              "Select..."
            )}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid grid-cols-2 gap-2 p-4 w-90 md:w-max">
              {tabOptions.career.map(opt => (
                <li key={opt.value}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      tab === opt.value
                        ? "bg-astraprimary text-white"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setTab(opt.value)}
                    type="button"
                  >
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-foreground">{opt.description}</div>
                  </button>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <div className="font-sb">
            Status
          </div>
          <NavigationMenuTrigger>
            {currentCategory === "status" && getSelectedLabel("status", tab) !== "Status" ? (
              <span className="font-semibold text-primary flex items-center gap-1 line-clamp-1">
                {getSelectedLabel("status", tab)}
                {/* <Check className="w-4 h-4" /> */}
              </span>
            ) : (
              "Select..."
            )}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid grid-cols-2 gap-1 p-4 w-90 md:w-max">
              {tabOptions.status.map(opt => (
                <li key={opt.value}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      tab === opt.value
                        ? "bg-primary text-white"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setTab(opt.value)}
                    type="button"
                  >
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-foreground">{opt.description}</div>
                  </button>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
