import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const subdomain = host.replace(".p.bhaskarapp.com", "");

  if (!subdomain || subdomain === host) {
    return new NextResponse("Not found", { status: 404 });
  }

  const targetOrigin = `https://${subdomain}-db-digital.vercel.app`;

  // Redirect image optimization requests — Vercel's optimizer
  // rejects rewrites from a different hostname
  if (req.nextUrl.pathname.startsWith("/_next/image")) {
    const target = new URL(
      `${req.nextUrl.pathname}${req.nextUrl.search}`,
      targetOrigin
    );
    return NextResponse.redirect(target);
  }

  // Rewrite everything else
  const target = new URL(
    `${req.nextUrl.pathname}${req.nextUrl.search}`,
    targetOrigin
  );

  return NextResponse.rewrite(target);
}

export const config = {
  matcher: "/:path*",
};