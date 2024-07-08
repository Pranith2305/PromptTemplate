import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/ui/theme-provider";
import "./globals.css";
import Home from "./home/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Effortless",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Home/>
        {children}
        </ThemeProvider></body>
    </html>
  );
}