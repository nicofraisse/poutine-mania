#!/usr/bin/env node
const fetch = require("node-fetch");
const xml2js = require("xml2js");
const Table = require("cli-table3");

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://poutinemania.ca";

async function fetchXml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  return res.text();
}

async function getUrlsFromSitemap(url) {
  const xml = await fetchXml(url);
  const parsed = await xml2js.parseStringPromise(xml);

  if (parsed.sitemapindex) {
    const locs = parsed.sitemapindex.sitemap.map((s) => s.loc[0]);
    const batches = await Promise.all(locs.map(getUrlsFromSitemap));
    return batches.flat();
  }

  if (parsed.urlset) {
    return parsed.urlset.url.map((u) => {
      const loc = u.loc[0];
      const lastmod = (u.lastmod || [""])[0];
      const alternates = (u["xhtml:link"] || []).map((x) => ({
        hreflang: x.$.hreflang,
        href: x.$.href,
      }));
      return { loc, lastmod, alternates };
    });
  }

  return [];
}

function formatDateAgo(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${mm}-${dd}-${yy} ${hh}:${mi}`;
}

(async () => {
  try {
    const indexUrl = `${BASE_URL.replace(/\/$/, "")}/sitemap.xml`;
    console.log(`Inspecting sitemap at ${indexUrl} …\n`);

    const entries = await getUrlsFromSitemap(indexUrl);

    const table = new Table({
      head: ["Path", "fr", "en", "lastmod"],
      colWidths: [50, 50, 50, 17],
      wordWrap: true,
    });

    for (const { loc, lastmod, alternates } of entries) {
      const path = new URL(loc).pathname;
      const langs = { fr: "—", en: "—" };
      alternates.forEach((a) => {
        if (a.hreflang in langs) langs[a.hreflang] = a.href;
      });
      table.push([path, langs.fr, langs.en, formatDateAgo(lastmod)]);
    }

    console.log(table.toString());
  } catch (err) {
    console.error("Error inspecting sitemap:", err);
    process.exit(1);
  }
})();
