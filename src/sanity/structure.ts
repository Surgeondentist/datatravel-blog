import type { StructureResolver } from "sanity/structure";

/** Sanity Studio sidebar: document types under CMS. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("CMS")
    .items([
      S.documentTypeListItem("post").title("Posts"),
      S.documentTypeListItem("author").title("Authors"),
    ]);
