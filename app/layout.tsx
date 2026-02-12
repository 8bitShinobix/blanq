import type { Metadata } from "next";
import { Outfit, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Blanq — Beautiful forms. Zero effort.",
    template: "%s | Blanq",
  },
  description:
    "Create stunning, branded forms in minutes. No design skills needed. Beautiful by default, customizable themes, and zero effort.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    siteName: "Blanq",
    title: "Blanq — Beautiful forms. Zero effort.",
    description:
      "Create stunning, branded forms in minutes. No design skills needed. Beautiful by default, customizable themes, and zero effort.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blanq — Beautiful forms. Zero effort.",
    description:
      "Create stunning, branded forms in minutes. No design skills needed.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
