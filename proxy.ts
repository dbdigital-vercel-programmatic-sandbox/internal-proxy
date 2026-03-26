import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const host = req.headers.get("host") || "";
    const subdomain = host.replace(".p.bhaskarapp.com", "");
    
    if (!subdomain || subdomain === host) {
        // Someone hit p.bhaskarapp.com directly
        return new NextResponse("Not found", { status: 404 });
    }
    
    const target = new URL(
        `${req.nextUrl.pathname}${req.nextUrl.search}`,
        // <data>.p.bhaskarapp.com -> <data>-db-digital.vercel.app
        `https://${subdomain}-db-digital.vercel.app`
    );

    return NextResponse.rewrite(target);
}

export const config = {
    matcher: "/(.*)",
};