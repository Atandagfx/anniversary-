import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: "Happy One-Year Anniversary, Ajoke ❤️",
    description: "Atanda and Ajoke — 365 days of love, laughter and beautiful memories.",
    icons: {
      icon: "/images/heart-icon.png",
      shortcut: "/images/heart-icon.png",
    },
    openGraph: {
      title: "Happy One-Year Anniversary, Ajoke ❤️",
      description: "Atanda and Ajoke — 365 days of love, laughter and beautiful memories.",
      images: [{ url: "/og.png", width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Happy One-Year Anniversary, Ajoke ❤️",
      description: "Atanda and Ajoke — 365 days of love, laughter and beautiful memories.",
      images: ["/og.png"],
    },
    robots: {
      index: false,
      follow: false,
      noarchive: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
