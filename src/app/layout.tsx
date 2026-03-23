import type { Metadata } from "next";
import Navbar from "./_components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contact Manager",
  description: "Contact Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-8"> 
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
