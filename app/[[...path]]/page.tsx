import {
  AlertTriangle,
  Clock,
  Route,
  Server,
  TerminalSquare,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type CatchAllPageProps = {
  params: Promise<{
    path?: string[]
  }>
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { path } = await params
  const pathname = path?.length ? `/${path.join("/")}` : "/"
  const routeDepth = path?.length ?? 0
  const routeSegments = path?.length ? path : ["root"]
  const timestamp = new Date().toISOString()

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <main className="relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_34%),radial-gradient(circle_at_80%_20%,_rgba(148,163,184,0.16),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(9,9,11,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:96px_96px] opacity-20" />
        <div className="absolute top-0 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-14 sm:px-10 lg:px-12">
          <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            {/* Left: hero / messaging */}
            <section className="flex flex-col justify-center">
              <Badge
                variant="outline"
                className="mb-5 w-fit animate-in border-white/10 bg-white/5 px-3 py-1 text-[11px] tracking-[0.24em] text-muted-foreground uppercase duration-500 fade-in-0 slide-in-from-bottom-3"
              >
                <AlertTriangle className="size-3" />
                Unmatched route
              </Badge>

              <div className="max-w-3xl animate-in space-y-6 duration-700 fade-in-0 slide-in-from-bottom-4">
                <div className="space-y-4">
                  <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                    You should not be seeing this page.
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                    This route does not exist. If you ended up here, something
                    is wrong — either a broken link, a misconfigured redirect,
                    or an incorrect URL. Check the original URL from source and
                    try again.
                  </p>
                </div>
              </div>
            </section>

            {/* Right: diagnostics card */}
            <section className="animate-in duration-700 fade-in-0 slide-in-from-bottom-6 lg:pl-4">
              <Card className="overflow-hidden border border-white/10 bg-zinc-950/80 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                <CardHeader className="border-b border-white/10 pb-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardDescription className="mb-2 flex items-center gap-2 text-[11px] tracking-[0.26em] text-zinc-400 uppercase">
                        <TerminalSquare className="size-3.5" />
                        Request diagnostics
                      </CardDescription>
                      <CardTitle className="text-2xl">Route details</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-red-400/80" />
                      <span className="size-2 rounded-full bg-amber-300/80" />
                      <span className="size-2 rounded-full bg-emerald-400/80" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-sm text-zinc-300">
                    <div className="mb-3 flex items-center gap-2 text-zinc-500">
                      <Server className="size-4" />
                      catchall
                    </div>
                    <div className="space-y-2">
                      <p>
                        <span className="text-zinc-500">path</span>
                        <span className="ml-3 text-zinc-100">{pathname}</span>
                      </p>
                      <p>
                        <span className="text-zinc-500">segments</span>
                        <span className="ml-3 text-zinc-100">
                          {routeSegments.join(" / ")}
                        </span>
                      </p>
                      <p>
                        <span className="text-zinc-500">depth</span>
                        <span className="ml-3 text-zinc-100">{routeDepth}</span>
                      </p>
                      <p>
                        <span className="text-zinc-500">timestamp</span>
                        <span className="ml-3 text-zinc-100">{timestamp}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="mb-1 flex items-center gap-2 text-sm font-medium text-white">
                        <Route className="size-4 text-zinc-400" />
                        Matched route
                      </p>
                      <p className="font-mono text-sm break-all text-zinc-400">
                        {pathname}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="mb-1 flex items-center gap-2 text-sm font-medium text-white">
                        <Clock className="size-4 text-zinc-400" />
                        Rendered at
                      </p>
                      <p className="font-mono text-sm text-zinc-400">
                        {timestamp}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
