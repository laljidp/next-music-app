import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextAuthProvider from "@/components/NextAuthProvider";
import "./globals.css";
import UserProvider from "@/context/user.context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Music",
  description: "Stream music & upload albums",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "./next-streaming-192x192.png",
      url: "./next-streaming-512x512.png",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main
          className="flex min-h-screen max-h-100 p-5 
          bg-gradient-to-tr to-sky-200 from-gray-100 backdrop-blur-md"
        >
          <NextAuthProvider>
            <UserProvider>{children}</UserProvider>
          </NextAuthProvider>
        </main>
      </body>
    </html>
  );
}
