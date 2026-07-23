"use client"

import { useEffect, useState } from "react"
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google"
import Script from "next/script"

const CONSENT_KEY = "yf_cookie_consent"

function useConsented() {
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(CONSENT_KEY) === "accepted") {
      // localStorage access must not happen during render (SSR/hydration
      // safety), so this has to run eagerly in an effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConsented(true)
      return
    }
    function onConsent(e: CustomEvent) {
      if (e.detail === "accepted") setConsented(true)
    }
    window.addEventListener("cookie-consent", onConsent as EventListener)
    return () => window.removeEventListener("cookie-consent", onConsent as EventListener)
  }, [])

  return consented
}

export function TrackingScripts() {
  const consented = useConsented()
  const gaId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  const fbId = process.env.NEXT_PUBLIC_FB_PIXEL_ID
  const ttId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID

  if (!consented) return null

  return (
    <>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}

      {gaId && <GoogleAnalytics gaId={gaId} />}

      {fbId && (
        <>
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${fbId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {ttId && (
        <Script id="tt-pixel" strategy="afterInteractive">
          {`
            !function(w,d,t){
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.load=function(i){var s=d.createElement("script");s.type="text/javascript";s.async=true;s.src="https://analytics.tiktok.com/i18n/pixel/static/main.js";var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(s,a);ttq.loaded=!0;ttq.identify(i)};
              ttq.load('${ttId}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}
    </>
  )
}
