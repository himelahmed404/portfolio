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

// #region agent log
fetch("http://127.0.0.1:7912/ingest/6069950f-60ce-4ab8-bf02-9e08a731636e", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Debug-Session-Id": "a3026d",
  },
  body: JSON.stringify({
    sessionId: "a3026d",
    runId: "post-fix",
    hypothesisId: "A",
    location: "src/app/layout.tsx:fonts",
    message: "layout fonts module evaluated successfully",
    data: {
      hasArchivo: Boolean(archivo?.variable),
      hasInstrument: Boolean(instrumentSans?.variable),
      hasGeistMono: Boolean(geistMono?.variable),
      nextHint: "16.4.6+",
    },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion

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
