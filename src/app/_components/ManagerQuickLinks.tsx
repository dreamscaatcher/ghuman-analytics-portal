"use client";

import Link from "next/link";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";

import { useRole } from "../../components/providers/RoleProvider";

const MANAGER_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Customer View", href: "/" },
  { label: "Kitchen", href: "/kitchen" },
] as const;

export function ManagerQuickLinks() {
  const { allowedRoles, isReady } = useRole();
  const isManagerWorkspace = allowedRoles.includes("manager");

  if (!isReady || !isManagerWorkspace) {
    return null;
  }

  return (
    <Card variant="outlined" sx={{ mt: { xs: 4, md: 6 } }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" color="text.secondary">
            Manager workspace
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            Jump to dashboard, customer view, or kitchen
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            {MANAGER_LINKS.map((link) => (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                variant={link.href === "/dashboard" ? "contained" : "outlined"}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
