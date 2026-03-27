// proxy.ts
import { NextRequest, NextResponse } from "next/server"

export function proxy(req: NextRequest) {
  const hostname = (req.headers.get("host") || "").split(":")[0]

  if (!hostname || hostname === "localhost" || hostname === "127.0.0.1") {
    return NextResponse.next()
  }

  if (!hostname.endsWith(".p.bhaskarapp.com")) {
    return NextResponse.next()
  }

  const subdomain = hostname.slice(0, -".p.bhaskarapp.com".length)

  if (!subdomain) {
    return NextResponse.next()
  }

  const target = new URL(
    `${req.nextUrl.pathname}${req.nextUrl.search}`,
    `https://${subdomain}-db-digital.vercel.app`
  )

  return NextResponse.rewrite(target)
}

export const config = {
  matcher: "/:path*",
}
