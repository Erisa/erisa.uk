import lumeCMS from "lume/cms/mod.ts";

const cms = lumeCMS();

cms.storage("src", "blog");

cms.collection({
  name: "blog",
  store: "src:*.md",
  fields: [
    "title: text!",
    "meta_title: text",
    "date: date",
    "description: text",
    "content: markdown",
  ],
  previewUrl: () => "/blog/",
  documentName: "{title}.md",
  rename: "auto",
});

cms.upload("images", "src:images");

export default cms;
