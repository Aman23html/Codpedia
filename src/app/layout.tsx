import Navbar from "@/components/global/Navbar";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Footer from "@/components/global/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}