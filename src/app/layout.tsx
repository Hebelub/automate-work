import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { Navigation } from "~/app/_components/navigation";

export const metadata: Metadata = {
  title: "Automate Work - Task Manager",
  description: "Task management with organized link collections",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="min-h-screen bg-background text-foreground">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
