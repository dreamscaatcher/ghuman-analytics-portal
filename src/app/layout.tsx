import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Ghuman Analytics Portal",
  description: "Marketing analytics, Cypher/Neo4j insights, and BI storytelling for ghuman.online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          background: "#0b1220",
          color: "#e8edf5",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
