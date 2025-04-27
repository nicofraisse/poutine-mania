import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="fr">
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
          {/*
          <link
            rel="preload"
            as="font"
            href="/fonts/DM-Sans.woff2"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          */}

          {/* ---- JSON-LD Structured Data ---- */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                url: "https://poutinemania.ca/",
                name: "Poutinemania",
                potentialAction: {
                  "@type": "SearchAction",
                  target:
                    "https://poutinemania.ca/restaurants?search={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              }),
            }}
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
