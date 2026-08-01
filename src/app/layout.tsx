import type { Metadata } from "next";
import { Archivo, Instrument_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["500", "600"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://himelahmed.dev"),
  title: "Himel Ahmed — Full-stack developer",
  description:
    "Full-stack developer who builds the product and then tries to break it. Dhaka, Bangladesh — available remote.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    title: "Himel Ahmed — Full-stack developer",
    description: "Full-stack developer who builds the product and then tries to break it.",
    url: "https://himelahmed.dev/",
  },
  twitter: { card: "summary" },
};

export const viewport = {
  themeColor: "#1E2124",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrumentSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-ink-900 text-ink-100 font-body antialiased">{children}</body>
    </html>
  );
}
