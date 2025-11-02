"use client";

import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import KitchenIcon from "@mui/icons-material/Kitchen";
import MenuIcon from "@mui/icons-material/Menu";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { primaryNavigation } from "../../config/navigation";

type NavigationItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

const ICON_MAP = {
  customer: <RestaurantMenuIcon fontSize="small" />,
  dashboard: <DashboardIcon fontSize="small" />,
  kitchen: <KitchenIcon fontSize="small" />,
} as const;

const DEFAULT_LINKS: NavigationItem[] = primaryNavigation.map((item) => ({
  label: item.label,
  href: item.href,
  icon: item.icon ? ICON_MAP[item.icon] : undefined,
}));

type AppShellProps = {
  children: React.ReactNode;
  links?: NavigationItem[];
};

const DRAWER_WIDTH = 240;

export function AppShell({ children, links = DEFAULT_LINKS }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const pathname = usePathname();

  const toggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawerContent = (
    <Box sx={{ display: "flex", height: "100%", flexDirection: "column" }}>
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="h6" component="div">
          Ghuman Restaurant
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Control Center
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1 }}>
        {links.map((item) => {
          const selected = pathname === item.href;

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={selected}
              onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: 2, mx: 1, my: 0.5 }}
            >
              {item.icon ? (
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              ) : null}
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: selected ? 600 : undefined,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Staff access coming soon.
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          backdropFilter: "blur(18px)",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar>
          {!isDesktop && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
              aria-label="open navigation"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" component="div">
              Ghuman Restaurant
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Unified guest, manager, and kitchen experiences
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        aria-label="primary navigation"
      >
        <Drawer
          variant={isDesktop ? "permanent" : "temporary"}
          open={isDesktop ? true : mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: 1,
              borderColor: "divider",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1, px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
