import { NextRequest, NextResponse } from 'next/server'

const locales = ['fr', 'en', 'de', 'es', 'it', 'pt']
const defaultLocale = 'fr'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Ignore API & static
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return
  }

  // Already has locale
  const hasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}`)
  )

  if (hasLocale) return

  // Browser language detection
  const lang = request.headers.get('accept-language') || ''
  const detected = locales.find(l => lang.includes(l)) || defaultLocale

  return NextResponse.redirect(
    new URL(`/${detected}${pathname}`, request.url)
  )
}
