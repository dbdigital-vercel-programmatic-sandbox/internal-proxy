import { NextRequest, NextResponse } from "next/server"

const nonSharableBannerStylesheetPath = "/__proxy/nonshareable-banner.css"

const rewrites = [
  {
    sourceSuffix: ".p.bhaskarapp.com",
    targetDomain: "-db-digital.vercel.app",
    injectNonSharableBanner: false,
  },
  {
    sourceSuffix: ".s.bhaskarapp.com",
    targetDomain: ".vercel.run",
    injectNonSharableBanner: true,
  },
] as const

function getHostname(value: string | null) {
  return value?.split(",")[0]?.trim().split(":")[0] ?? ""
}

function isDocumentRequest(req: NextRequest) {
  const accept = req.headers.get("accept") ?? ""
  const destination = req.headers.get("sec-fetch-dest")

  return (
    req.method === "GET" &&
    (destination === "document" || accept.includes("text/html"))
  )
}

function buildTargetUrl(
  req: NextRequest,
  subdomain: string,
  targetDomain: string
) {
  return new URL(
    `${req.nextUrl.pathname}${req.nextUrl.search}`,
    `https://${subdomain}${targetDomain}`
  )
}

function injectBannerStylesheet(html: string) {
  if (html.includes("data-non-shareable-banner")) {
    return html
  }

  const stylesheetTag = `<link rel="stylesheet" href="${nonSharableBannerStylesheetPath}" data-non-shareable-banner="true">`
  const headMatch = /<head\b[^>]*>/i.exec(html)

  if (headMatch?.index !== undefined) {
    const insertAt = headMatch.index + headMatch[0].length

    return `${html.slice(0, insertAt)}${stylesheetTag}${html.slice(insertAt)}`
  }

  const htmlMatch = /<html\b[^>]*>/i.exec(html)

  if (htmlMatch?.index !== undefined) {
    const insertAt = htmlMatch.index + htmlMatch[0].length

    return `${html.slice(0, insertAt)}<head>${stylesheetTag}</head>${html.slice(insertAt)}`
  }

  return `${stylesheetTag}${html}`
}

function rewriteRedirectLocation(
  location: string,
  req: NextRequest,
  target: URL
) {
  const locationUrl = new URL(location, target)

  if (locationUrl.origin !== target.origin) {
    return location
  }

  return new URL(
    `${locationUrl.pathname}${locationUrl.search}${locationUrl.hash}`,
    req.nextUrl.origin
  ).toString()
}

async function proxyHtmlDocument(req: NextRequest, target: URL) {
  const upstreamHeaders = new Headers(req.headers)
  const originalHost = getHostname(req.headers.get("host"))

  upstreamHeaders.delete("host")

  if (originalHost) {
    upstreamHeaders.set("x-forwarded-host", originalHost)
  }

  const upstreamResponse = await fetch(target, {
    headers: upstreamHeaders,
    redirect: "manual",
    signal: req.signal,
  })

  const responseHeaders = new Headers(upstreamResponse.headers)
  const location = responseHeaders.get("location")

  if (
    location &&
    upstreamResponse.status >= 300 &&
    upstreamResponse.status < 400
  ) {
    responseHeaders.set(
      "location",
      rewriteRedirectLocation(location, req, target)
    )

    return new Response(null, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    })
  }

  const contentType = responseHeaders.get("content-type") ?? ""

  if (!contentType.includes("text/html")) {
    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    })
  }

  const html = injectBannerStylesheet(await upstreamResponse.text())

  responseHeaders.delete("content-encoding")
  responseHeaders.delete("content-length")
  responseHeaders.delete("etag")

  return new Response(html, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  })
}

export function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/__proxy/")) {
    return NextResponse.next()
  }

  const hostname = getHostname(req.headers.get("host"))

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

  const target = buildTargetUrl(req, subdomain, rewrite.targetDomain)

  if (rewrite.injectNonSharableBanner && isDocumentRequest(req)) {
    return proxyHtmlDocument(req, target)
  }

  return NextResponse.rewrite(target)
}

export const config = {
  matcher: "/:path*",
}
