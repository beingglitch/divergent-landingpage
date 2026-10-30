import { PIXEL_ID } from "./config";

/* The Meta pixel. Its loader sits in the page head (see layout.tsx), so fbq is
   there before any page code runs, and calls wait until the script arrives. */
declare global {
  interface Window { fbq?: (...args: unknown[]) => void }
}

/* Runs before anything else on the page: sets up the fbq queue and starts the
   pixel. PageView is sent by SiteBehaviour, on every page change. */
export const PIXEL_LOADER = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');`;

/* eventID lets Meta count an event once when the server reports it too. */
export function track(event: string, data?: Record<string, unknown>, eventID?: string) {
  window.fbq?.("track", event, data ?? {}, eventID ? { eventID } : {});
}

/* The pixel's browser id and ad click id, which the server sends along. */
export function pixelCookie(name: "_fbp" | "_fbc"): string | undefined {
  return document.cookie.split("; ").find((c) => c.startsWith(name + "="))?.slice(name.length + 1);
}
