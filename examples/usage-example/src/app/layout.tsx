import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { urlWithBasePath } from "./utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IngoOutgo | Example",
  description: "Example usage of IngoOutgo",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <head>
        <link
          rel="shortcut icon"
          href={urlWithBasePath("/favicons/favicon.ico")}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={urlWithBasePath("/favicons/apple-touch-icon.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={urlWithBasePath("/favicons/favicon-32x32.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={urlWithBasePath("/favicons/favicon-16x16.png")}
        />
      </head>
    </html>
  )
}
