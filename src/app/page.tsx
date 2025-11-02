import { Box, Button, Container, Divider, Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box component="main" sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Stack spacing={2}>
            <Typography
              component="h1"
              variant="h3"
              sx={{ fontWeight: 700, maxWidth: 560 }}
            >
              Welcome to Ghuman Restaurant
            </Typography>
            <Typography variant="body1" color="text.secondary" maxWidth={720}>
              This workspace will evolve into the customer-facing experience,
              management dashboard, and kitchen interface. We&apos;re starting
              with a shared Material UI foundation, ready to grow into the full
              platform.
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" size="large" color="primary">
              Explore Customer Journey
            </Button>
            <Button variant="outlined" size="large" color="secondary">
              View Product Roadmap
            </Button>
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Next Steps
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Build out shared layout primitives, define navigation for customer,
              dashboard, and kitchen surfaces, and connect to the Neo4j backend.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
