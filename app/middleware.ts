import { NextRequest, NextResponse } from 'next/server';

const locales = ['fr', 'en', 'de', 'es', 'it', 'pt'];
const defaultLocale = 'fr';

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  for (const lang of acceptLanguage.split(',')) {
    const code = lang.split('-')[0];
    if (locales.includes(code)) return code;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return;
  }

  if (locales.some(locale => pathname.startsWith(`/${locale}`))) {
    return;
  }

  const locale = getLocale(request);

  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  );
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
