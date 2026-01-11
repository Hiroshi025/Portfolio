import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import "../styles/notifications.css";

import { NotificationProvider } from "../components/tools/NotificationContext";

export const metadata: Metadata = {
  title: "Hiroshi025 - Portfolio",
  description:
    "Portfolio profesional de Hiroshi025. Desarrollador backend especializado en Python, C++, NestJS y TypeScript. Creador de bots, monitores, herramientas innovadoras y proyectos open source.",
  generator: "Next.js",
  applicationName: "Portfolio Hiroshi025",
  keywords:
    "desarrollo, backend, full stack, bots, monitores, hacking, proyectos, herramientas, Python, C++, TypeScript, NestJS, React, desarrollo web",
  authors: [
    {
      name: "Hiroshi025",
    },
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "Hiroshi025 | Desarrollador Full Stack & Backend Specialist",
    description:
      "Desarrollador backend especializado en Python, C++, NestJS y TypeScript. Creador de bots, monitores y herramientas innovadoras.",
    siteName: "Portfolio Hiroshi025",
    images: [
      {
        url: "https://i.pinimg.com/736x/99/3c/85/993c852d1a92514a8feca6ec7d71f0a2.jpg",
        width: 1200,
        height: 630,
        alt: "Hiroshi025 Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hiroshi025 | Desarrollador Full Stack & Backend Specialist",
    description:
      "Desarrollador backend especializado en Python, C++, NestJS y TypeScript. Creador de bots, monitores y herramientas innovadoras.",
    creator: "@Hiroshi025",
    images: [
      "https://i.pinimg.com/736x/99/3c/85/993c852d1a92514a8feca6ec7d71f0a2.jpg",
    ],
  },
  other: {
    "theme-color": "#ec4899",
    "og:image:width": "1200",
    "og:image:height": "630",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="icon"
          href="https://i.pinimg.com/736x/e9/e1/40/e9e140e3069196bf1b3b0aae89e0e6b3.jpg"
          type="image/x-icon"
        />
      </head>
      <body>
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}
