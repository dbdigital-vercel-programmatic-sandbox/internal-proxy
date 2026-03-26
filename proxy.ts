// proxy.ts
import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const subdomain = host.replace(".p.bhaskarapp.com", "");

  if (!subdomain || subdomain === host) {
    return new NextResponse("Not found", { status: 404 });
  }

  const target = new URL(
    `${req.nextUrl.pathname}${req.nextUrl.search}`,
    `https://${subdomain}-db-digital.vercel.app`
  );

  return NextResponse.rewrite(target);
}

export const config = {
  matcher: "/:path*",
};