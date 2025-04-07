import type React from "react"
import "./globals.css"
import { Amiri } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
})

export const metadata = {
  title: "Happy Birthday Sania!",
  description: "A special birthday card for Sania",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload the audio file */}
        <link rel="preload" href="/birds-of-a-feather.mp3" as="audio" />
      </head>
      <body className={amiri.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

