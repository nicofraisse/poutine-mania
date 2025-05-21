import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const locale = ctx.locale || "fr";
    return { ...initialProps, locale };
  }

  render() {
    const { locale } = this.props;
    const siteName = "Poutine Mania";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const siteUrl = locale === "en" ? `${baseUrl}/en` : baseUrl;
    const searchTarget =
      locale === "en"
        ? `${baseUrl}/en/restaurants?search={search_term_string}`
        : `${baseUrl}/restaurants?search={search_term_string}`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: siteUrl,
      name: siteName,
      potentialAction: {
        "@type": "SearchAction",
        target: searchTarget,
        "query-input": "required name=search_term_string",
      },
    };

    return (
      <Html lang={locale}>
        <Head>
          {/* ---- Global Metadata ---- */}
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
          />
          <meta name="referrer" content="strict-origin-when-cross-origin" />

          {/* ---- Favicon ---- */}
          <link rel="icon" href="/favicon.ico" sizes="any" />

          {/* ---- Font Preconnects & Preloads ---- */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          {/* @Todo (Optional) Preload most-critical font file if self-hosted */}

          {/* ---- JSON-LD Structured Data ---- */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd),
            }}
          />

          {/* ---- Cloudflare Insights ---- */}
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "4ad878b9015b4f1a96f9c29b75d86221"}'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
