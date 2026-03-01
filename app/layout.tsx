import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Repolume — AI Codebase Explainer",
  description:
    "Paste a GitHub repository URL and Repolume will analyze the entire project, explain the architecture, summarize files, and let you chat with your codebase using AI.",
  keywords: ["AI", "codebase", "explainer", "GitHub", "developer tool"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
