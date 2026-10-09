import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

export const alt = "Noor Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Satori lays out with flexbox only: every element with more than one child
// needs `display: flex`, or the render throws and the response is empty. It
// also cannot shape Arabic, so the Arabic site shares the English card.
export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const textLocale = locale === "ar" ? routing.defaultLocale : locale;
  const tSite = await getTranslations({ locale: textLocale, namespace: "site" });
  const tHome = await getTranslations({ locale: textLocale, namespace: "home" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf7f0",
          color: "#1e2433",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, color: "#4a5268" }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, border: "3px solid #b7791f" }} />
          <div style={{ display: "flex" }}>{tSite("name")}</div>
        </div>
        <div style={{ display: "flex", fontSize: 72, lineHeight: 1.15, maxWidth: 960 }}>
          {tHome("title")}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #e3dccb",
            paddingTop: 28,
            fontSize: 26,
            color: "#4a5268",
          }}
        >
          <div style={{ display: "flex" }}>{tHome("subline")}</div>
          <div style={{ display: "flex", color: "#2f5d8a" }}>{new URL(SITE_URL).host}</div>
        </div>
      </div>
    ),
    size,
  );
}
