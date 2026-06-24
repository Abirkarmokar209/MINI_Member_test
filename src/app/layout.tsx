import type { Metadata } from "next";
// Replace whatever path you have on line 2 with this:
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini Quiz",
  description: "An ultra-minimal MCQ exam app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
