import lume from "lume/mod.ts";
import mdx from "lume/plugins/mdx.ts";
import jsx from "lume/plugins/jsx.ts";
import lightningcss from "lume/plugins/lightningcss.ts";

const site = lume({
  src: "./src",
  dest: "./dist",
  prettyUrls: false,
  location: new URL("https://erisa.uk"),
});

site.use(mdx());
site.use(jsx());
site.use(lightningcss());

site.add("styles");
site.copy("static", "/");

export default site;
