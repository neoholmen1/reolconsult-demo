// i18n middleware disabled — site pages use hardcoded Norwegian text.
// Chatbot has its own built-in language toggle (NO/EN).
// Re-enable when full next-intl page translations are ready.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
