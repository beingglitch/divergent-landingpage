/**
 * UTM tags: which ad or link brought a visitor. The app (divergent-lms,
 * src/lib/utm.ts) reads the same cookie on divergentclasses.com, so the tags
 * follow a visitor from here into the app and onto their lead and payment.
 * The latest tagged click wins and lasts 30 days. A visit with no tags keeps
 * the site it came from (google, instagram, youtube...; utmFromReferrer in
 * the app) when nothing is saved yet: a referrer never overwrites the
 * cookie, a tagged click always does. Keep the two in step.
 */
export const UTM_COOKIE = "dv_utm";

/** Runs in <head> before anything else, so a form sent early still has the tags. */
export const UTM_CAPTURE = `(function(){try{
var q=new URLSearchParams(location.search),g=function(k){var v=(q.get('utm_'+k)||'').trim();return v?v.slice(0,120):undefined};
var u={source:g('source'),medium:g('medium'),campaign:g('campaign'),content:g('content'),term:g('term')};
if(!u.source&&q.has('fbclid'))u={source:'facebook',medium:'paid'};
if(!u.source&&q.has('gclid'))u={source:'google',medium:'paid'};
if(!u.source){
if(document.cookie.indexOf('${UTM_COOKIE}=')>-1)return;
var r='';try{r=new URL(document.referrer).hostname.toLowerCase()}catch(e){}
if(!r||r==='localhost'||r==='divergentclasses.com'||/\\.divergentclasses\\.com$/.test(r))return;
var m=[[/(^|\\.)google\\./,'google','organic'],[/(^|\\.)bing\\.com$/,'bing','organic'],[/(^|\\.)duckduckgo\\.com$/,'duckduckgo','organic'],[/(^|\\.)instagram\\.com$/,'instagram','social'],[/(^|\\.)(facebook\\.com|fb\\.com)$/,'facebook','social'],[/(^|\\.)(youtube\\.com|youtu\\.be)$/,'youtube','social'],[/(^|\\.)(linkedin\\.com|lnkd\\.in)$/,'linkedin','social'],[/(^|\\.)(x\\.com|twitter\\.com|t\\.co)$/,'x','social'],[/(^|\\.)(whatsapp\\.com|wa\\.me)$/,'whatsapp','social'],[/(^|\\.)(chatgpt\\.com|chat\\.openai\\.com)$/,'chatgpt.com','referral']];
var k=null;for(var i=0;i<m.length;i++){if(m[i][0].test(r)){k=m[i];break}}
u={source:k?k[1]:r.replace(/^www\\./,'').slice(0,120),medium:k?k[2]:'referral'};
}
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
