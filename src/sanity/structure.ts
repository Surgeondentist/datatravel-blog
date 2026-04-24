import type { StructureResolver } from "sanity/structure";

/** Lista lateral del Studio: agrupa tipos de documento bajo «CMS». */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("CMS")
    .items([
      S.documentTypeListItem("post").title("Artículos"),
      S.documentTypeListItem("author").title("Autores"),
    ]);
