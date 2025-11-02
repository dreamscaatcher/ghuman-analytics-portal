"use client";

import AssessmentIcon from "@mui/icons-material/Assessment";
import InventoryIcon from "@mui/icons-material/Inventory2";
import PeopleIcon from "@mui/icons-material/PeopleAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

const KPIS = [
  {
    title: "Today's Revenue",
    value: "$8,420",
    change: "+12% vs. yesterday",
    icon: <TrendingUpIcon color="success" />,
  },
  {
    title: "Open Orders",
    value: "14",
    change: "3 ready for pickup",
    icon: <AssessmentIcon color="primary" />,
  },
  {
    title: "Low Inventory Items",
    value: "6",
    change: "Needs attention",
    icon: <InventoryIcon color="warning" />,
  },
  {
    title: "Staff On Shift",
    value: "9",
    change: "2 breaks scheduled",
    icon: <PeopleIcon color="secondary" />,
  },
];

const highlights = [
  {
    label: "Reservations",
    value: "24",
    sublabel: "Tonight",
  },
  {
    label: "Dining Room Capacity",
    value: "68%",
    sublabel: "Projected",
  },
  {
    label: "Average Ticket",
    value: "$36.20",
    sublabel: "Last 7 days",
  },
];

export default function DashboardPage() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h4" fontWeight={700}>
          Manager Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Live summary of guests, orders, inventory, and staff activity.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {KPIS.map((item) => (
          <Grid key={item.title} size={{ xs: 12, md: 6, lg: 3 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" color="text.secondary">
                  {item.title}
                </Typography>
                {item.icon}
              </Stack>
              <Typography variant="h4" fontWeight={700}>
                {item.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.change}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            variant="outlined"
            sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Order Pipeline
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kitchen throughput versus service goals.
                </Typography>
              </Box>
              <Chip label="Live" color="success" size="small" />
            </Stack>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2">Prep Station</Typography>
                <LinearProgress value={72} variant="determinate" sx={{ mt: 1 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2">Grill Station</Typography>
                <LinearProgress value={55} variant="determinate" sx={{ mt: 1 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2">Pastry Station</Typography>
                <LinearProgress value={88} variant="determinate" sx={{ mt: 1 }} />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            variant="outlined"
            sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography variant="h6" fontWeight={600}>
              Tonight&apos;s Highlights
            </Typography>
            <Stack spacing={2}>
              {highlights.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {item.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.sublabel}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
