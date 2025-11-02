export type NavigationLink = {
  label: string;
  href: string;
  icon?: "customer" | "dashboard" | "kitchen";
  roles?: Array<"guest" | "manager" | "kitchen">;
};

export const primaryNavigation: NavigationLink[] = [
  { label: "Customer", href: "/", icon: "customer" },
  { label: "Dashboard", href: "/dashboard", icon: "dashboard", roles: ["manager"] },
  { label: "Kitchen", href: "/kitchen", icon: "kitchen", roles: ["kitchen", "manager"] },
];
