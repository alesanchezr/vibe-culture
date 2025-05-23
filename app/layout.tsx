import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VibeCulture - Discover Local Cultural Events",
  description: "Find and explore authentic cultural experiences in your city",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="min-h-screen">{children}</main>
          <footer className="py-6 border-t">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-sm text-muted-foreground">© 2024 VibeCulture. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-sm text-muted-foreground hover:underline">
                    Terms
                  </a>
                  <a href="#" className="text-sm text-muted-foreground hover:underline">
                    Privacy
                  </a>
                  <a href="#" className="text-sm text-muted-foreground hover:underline">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
