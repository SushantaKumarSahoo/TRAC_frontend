import type { Metadata } from "next";
import "./globals.css";
import { VideoProvider } from "@/context/VideoContext";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "TRAC Enterprise Video Portal",
  description: "Enterprise video portal for meeting recordings and transcripts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-canvas font-body-md text-body-md text-text-primary antialiased min-h-screen">
        <VideoProvider>
          {/* Persistent Sidebar with ONLY the TRAC Logo */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="pl-64 min-h-screen flex flex-col">
            <Header />
            <div className="pt-16 flex-1 w-full">{children}</div>
          </div>
        </VideoProvider>
      </body>
    </html>
  );
}
