import { Geist_Mono, Inter } from "next/font/google"
import { headers } from "next/headers"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const host = (await headers()).get("host") ?? ""
  const hostname = host.split(":")[0]
  const showNonSharableBanner = hostname.endsWith(".s.bhaskarapp.com")

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          {showNonSharableBanner ? (
            <div className="fixed top-0 right-0 left-0 z-50 bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white">
              This is not a sharable link
            </div>
          ) : null}
          <div className={showNonSharableBanner ? "pt-10" : undefined}>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
