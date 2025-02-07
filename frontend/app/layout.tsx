import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import {Toaster} from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AnvaTech - Next-Gen Management",
  description: "A powerful and intuitive management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <html lang="en">
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <div>
            <Navbar />
            <Toaster position="bottom-right" />
            <main className="z-0"> {/* Add z-0 here to ensure children are below the navbar */}
              {children}
            </main>
            <Footer />
          </div>
        </body>
      </html>
  );
}