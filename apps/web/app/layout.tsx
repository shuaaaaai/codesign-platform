import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CodeSign Platform",
  description: "Design collaboration and code export platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
