import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/navigation";

/**
 * Next 16 renamed `middleware.ts` to `proxy.ts`. A default export is
 * treated as the proxy function. next-intl's middleware is exported as
 * a default, so we just re-export it directly.
 */
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
