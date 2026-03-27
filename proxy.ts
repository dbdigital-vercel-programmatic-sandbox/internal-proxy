// proxy.ts
import { NextRequest, NextResponse } from "next/server"

const rewrites = [
  {
    sourceSuffix: ".p.bhaskarapp.com",
    targetDomain: "-db-digital.vercel.app",
  },
  {
    sourceSuffix: ".s.bhaskarapp.com",
    targetDomain: ".vercel.run",
  },
] as const

export function proxy(req: NextRequest) {
  const hostname = (req.headers.get("host") || "").split(":")[0]

  if (!hostname || hostname === "localhost" || hostname === "127.0.0.1") {
    return NextResponse.next()
  }

  const rewrite = rewrites.find(({ sourceSuffix }) =>
    hostname.endsWith(sourceSuffix)
  )

  if (!rewrite) {
    return NextResponse.next()
  }

  const subdomain = hostname.slice(0, -rewrite.sourceSuffix.length)

  if (!subdomain) {
    return NextResponse.next()
  }

  const target = new URL(
    `${req.nextUrl.pathname}${req.nextUrl.search}`,
    `https://${subdomain}${rewrite.targetDomain}`
  )

  return NextResponse.rewrite(target)
}

export const config = {
  matcher: "/:path*",
}
