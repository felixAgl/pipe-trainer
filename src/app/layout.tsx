import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "PipeTrainer - Entrenamiento Inteligente",
  description:
    "Genera planes de entrenamiento personalizados para tus clientes. Coaching fitness profesional.",
  icons: {
    icon: "/pipe-trainer/favicon.ico",
    apple: "/pipe-trainer/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-pt-dark antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
