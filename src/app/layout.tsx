import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "NOVA - Cinematic AI Social Platform",
  description: "Next-generation AI companion platform combining character chat, swipeable discovery, safe social matchmaking, and communities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
