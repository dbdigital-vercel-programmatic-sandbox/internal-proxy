type CatchAllPageProps = {
  params: Promise<{
    path?: string[]
  }>
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { path } = await params
  const pathname = path?.length ? `/${path.join("/")}` : "/"

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="mb-6 text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
          Bhaskarapp proxy server
        </h1>
        <p className="mb-4 text-xl leading-relaxed text-gray-600 dark:text-gray-300">
          If you&apos;re seeing this page then there&apos;s something wrong
        </p>
        <p className="font-mono text-sm text-gray-500 dark:text-gray-400">
          Path: {pathname}
        </p>
      </div>
    </div>
  )
}
