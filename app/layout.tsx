import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextAuthProvider from "@/components/NextAuthProvider";
import UserProvider from "@/context/user.context";
import { SnackContextProvider } from "@/context/snack.context";
import "./globals.css";

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
          className="max-h-100 flex min-h-screen bg-gradient-to-tr 
          from-gray-100 to-sky-200 backdrop-blur-xl overflow-hidden"
        >
          <NextAuthProvider>
            <SnackContextProvider>
              <UserProvider>{children}</UserProvider>
            </SnackContextProvider>
          </NextAuthProvider>
        </main>
      </body>
    </html>
  );
}
