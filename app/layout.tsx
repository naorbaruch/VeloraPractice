import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Velora | Project Finance Training Simulator",
  description:
    "Interactive scenario-driven simulator for project finance legal and structuring decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="pt-16">{children}</main>
        <footer className="border-t border-border/50 mt-8">
          <div className="max-w-5xl mx-auto px-8 py-4">
            <p className="text-xs text-muted-light leading-relaxed max-w-lg">
              This is an educational tool only. It does not constitute legal or
              financial advice. No jurisdiction-specific reliance.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
