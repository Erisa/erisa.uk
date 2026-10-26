import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";
import lightningcss from "lume/plugins/lightningcss.ts";
import mdx from "lume/plugins/mdx.ts";
import metas from "lume/plugins/metas.ts";

const site = lume({
  src: "./src",
  dest: "./dist",
  prettyUrls: false,
  location: new URL("https://erisa.uk"),
});

site.use(mdx());
site.use(jsx());
site.use(lightningcss());
site.use(metas());

site.add("styles");
site.copy("static", "/");
site.copy("static/_headers", "/_headers");
site.copy("static/_redirects", "/_redirects");

// The metas plugin points og:url at the raw output path (e.g. "/contact.html"),
// but the host rewrites URLs to their extensionless form, so canonical links
// and og:url need to match that instead.
site.process([".html"], (pages) => {
  for (const page of pages) {
    if (!page.data.metas) continue;

    const canonicalUrl = site.url(page.data.url, true)
      .replace(/\/index\.html$/, "/")
      .replace(/\.html$/, "");

    const { document } = page;
    document.querySelector('meta[property="og:url"]')
      ?.setAttribute("content", canonicalUrl);

    const link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", canonicalUrl);
    document.head.appendChild(link);
  }
});

export default site;
