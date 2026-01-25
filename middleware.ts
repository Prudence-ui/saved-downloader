import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['fr', 'en', 'de', 'es', 'it', 'pt'];
const DEFAULT_LOCALE = 'fr';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les fichiers internes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return;
  }

  // Si l’URL contient déjà une langue → ne rien faire
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) {
    return;
  }

  // Détection langue navigateur
  const acceptLanguage = request.headers.get('accept-language');
  let detectedLocale = DEFAULT_LOCALE;

  if (acceptLanguage) {
    const browserLocales = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].toLowerCase());

    const match = browserLocales.find((lang) =>
      SUPPORTED_LOCALES.includes(lang.split('-')[0])
    );

    if (match) {
      detectedLocale = match.split('-')[0];
    }
  }

  // Redirection vers /{locale}
  const url = request.nextUrl.clone();
  url.pathname = `/${detectedLocale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/'],
};
