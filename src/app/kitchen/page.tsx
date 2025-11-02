"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import TimerIcon from "@mui/icons-material/Timer";
import { Avatar, Chip, Paper, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

type Ticket = {
  id: string;
  table: string;
  items: string[];
  status: "expedite" | "firing" | "plating";
  minutes: number;
};

const tickets: Ticket[] = [
  {
    id: "TK-204",
    table: "Table 7",
    items: ["2x Grilled Salmon", "1x Mushroom Risotto"],
    status: "expedite",
    minutes: 2,
  },
  {
    id: "TK-205",
    table: "Table 3",
    items: ["3x Margherita Pizza", "2x Caesar Salad"],
    status: "firing",
    minutes: 6,
  },
  {
    id: "TK-206",
    table: "Pickup",
    items: ["1x Vegan Bowl", "1x Spicy Ramen"],
    status: "plating",
    minutes: 4,
  },
  {
    id: "TK-207",
    table: "Table 11",
    items: ["2x Steak Frites", "1x Seasonal Greens"],
    status: "firing",
    minutes: 7,
  },
];

const statusConfig: Record<
  Ticket["status"],
  {
    label: string;
    color: "default" | "primary" | "success" | "warning";
    icon: React.ReactElement;
  }
> = {
  expedite: { label: "Expedite", color: "success", icon: <CheckCircleIcon fontSize="small" /> },
  firing: { label: "Firing", color: "warning", icon: <LocalDiningIcon fontSize="small" /> },
  plating: { label: "Plating", color: "primary", icon: <TimerIcon fontSize="small" /> },
};

export default function KitchenPage() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h4" fontWeight={700}>
          Kitchen Queue
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Live tickets from dining room and online orders. Swipe to mark complete when sent.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {tickets.map((ticket) => {
          const status = statusConfig[ticket.status];
          return (
            <Grid key={ticket.id} size={{ xs: 12, md: 6 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  borderLeft: "6px solid",
                  borderLeftColor:
                    status.color === "success"
                      ? "success.main"
                      : status.color === "warning"
                        ? "warning.main"
                        : "primary.main",
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Stack direction="row" spacing={2}>
                    <Avatar sx={{ bgcolor: "primary.main", width: 42, height: 42 }}>
                      {ticket.table[0]}
                    </Avatar>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {ticket.id}
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {ticket.table}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Chip
                    icon={status.icon}
                    label={status.label}
                    color={status.color}
                    variant="filled"
                    size="small"
                  />
                </Stack>

                <Stack spacing={1}>
                  {ticket.items.map((item) => (
                    <Typography key={item} variant="body1">
                      • {item}
                    </Typography>
                  ))}
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    {ticket.minutes} min since placed
                  </Typography>
                  <Chip label="Mark Ready" variant="outlined" size="small" />
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
}
