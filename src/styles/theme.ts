import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: "#006C4F",
      dark: "#00513B",
      light: "#4CB38C",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F97316",
      dark: "#C2410C",
      light: "#FDBA74",
      contrastText: "#1F2933",
    },
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
    success: {
      main: "#16A34A",
    },
    error: {
      main: "#DC2626",
    },
    warning: {
      main: "#FACC15",
    },
    info: {
      main: "#0EA5E9",
    },
    grey: {
      900: "#0F172A",
      800: "#1E293B",
      700: "#334155",
      600: "#475569",
      500: "#64748B",
      400: "#94A3B8",
      300: "#CBD5F5",
      200: "#E2E8F0",
      100: "#F1F5F9",
      50: "#F8FAFC",
    },
  },
  typography: {
    fontFamily: `${roboto.style.fontFamily}, var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
    h1: { fontWeight: 600, letterSpacing: "-0.02em" },
    h2: { fontWeight: 600, letterSpacing: "-0.02em" },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export { roboto };
export default theme;
