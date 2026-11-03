/**
 * UTM tags: which ad or link brought a visitor. The app (divergent-lms,
 * src/lib/utm.ts) reads the same cookie on divergentclasses.com, so the tags
 * follow a visitor from here into the app and onto their lead and payment.
 * The latest tagged click wins and lasts 30 days. Keep the two in step.
 */
export const UTM_COOKIE = "dv_utm";

/** Runs in <head> before anything else, so a form sent early still has the tags. */
export const UTM_CAPTURE = `(function(){try{
var q=new URLSearchParams(location.search),g=function(k){var v=(q.get('utm_'+k)||'').trim();return v?v.slice(0,120):undefined};
var u={source:g('source'),medium:g('medium'),campaign:g('campaign'),content:g('content'),term:g('term')};
if(!u.source&&q.has('fbclid'))u={source:'facebook',medium:'paid'};
if(!u.source&&q.has('gclid'))u={source:'google',medium:'paid'};
if(!u.source)return;
u.landing=location.pathname.slice(0,200);u.at=new Date().toISOString();
var h=location.hostname,d=(h==='divergentclasses.com'||/\\.divergentclasses\\.com$/.test(h))?'; domain=.divergentclasses.com':'';
document.cookie='${UTM_COOKIE}='+encodeURIComponent(JSON.stringify(u))+'; path=/; max-age=2592000; samesite=lax'+d+(location.protocol==='https:'?'; secure':'');
}catch(e){}})();`;

/** The saved tags, sent with a form (the app is another origin, so its cookie does not go). */
export function savedUtm(): unknown {
  try {
    const raw = document.cookie.split("; ").find((c) => c.startsWith(`${UTM_COOKIE}=`))?.slice(UTM_COOKIE.length + 1);
    return raw ? JSON.parse(decodeURIComponent(raw)) : undefined;
  } catch {
    return undefined;
  }
}
