import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;

const repoAssetPathToRelative = (value: unknown) => {
  const normalizedValue = emptyToUndefined(value);

  if (typeof normalizedValue !== "string") {
    return normalizedValue;
  }

  return normalizedValue.replace(/^\/?src\/assets\//, "../../assets/");
};

const blog = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/*.{md,mdx}",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      status: z.preprocess(emptyToUndefined, z.string().default("Publicado")),
      pubDate: z.coerce.date(),
      updatedDate: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
      coverImage: z.preprocess(repoAssetPathToRelative, image().optional()),
      author: z.string().optional(),
      tags: z.preprocess(
        (value) => (Array.isArray(value) ? value : []),
        z.array(z.string()).default([]),
      ),
    }),
});

export const collections = {
  blog,
};
