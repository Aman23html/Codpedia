import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import AppShell from "@/components/global/AppShell";


export const metadata: Metadata = {
  metadataBase: new URL("https://codepediasolutions.com"),

  title: {
    default: "Codepedia Solutions",
    template: "%s | Codepedia Solutions",
  },

  description:
    "Codepedia Solutions is a global education ecosystem offering tutoring, research support, career development, language education, and technology solutions.",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  keywords: [
    "Codepedia Solutions",
    "Online Education",
    "Tutoring",
    "Research",
    "IELTS",
    "Career Support",
    "Technology",
    "Global Education",
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Codepedia Solutions",
    description: "Building the Future of Global Education",
    url: "https://codepediasolutions.com",
    siteName: "Codepedia Solutions",
    images: ["/og-image.jpg"],
  },

  
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}