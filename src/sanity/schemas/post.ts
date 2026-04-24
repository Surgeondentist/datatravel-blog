import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Artículo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Resumen",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "coverImage",
      title: "Imagen de portada",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Texto alternativo", type: "string" }),
      ],
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          { title: "Tecnología", value: "tecnologia" },
          { title: "Inteligencia artificial", value: "inteligencia-artificial" },
          { title: "Ciberseguridad", value: "ciberseguridad" },
          { title: "Guías y herramientas", value: "guias" },
        ],
      },
    }),
    defineField({
      name: "readTime",
      title: "Tiempo de lectura (min)",
      type: "number",
    }),
    defineField({
      name: "publishedAt",
      title: "Fecha de publicación",
      type: "datetime",
    }),
    defineField({
      name: "body",
      title: "Contenido",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Texto alternativo", type: "string" }),
            defineField({ name: "caption", title: "Leyenda", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO: Título",
      type: "string",
      description: "Dejar vacío para usar el título del artículo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO: Descripción",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "title", media: "coverImage", subtitle: "category" },
  },
});
