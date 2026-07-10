import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import slugify from "slugify";

export type Post = CollectionEntry<"blog">;

export interface PostData {
  title: string;
  slug: string;
  status: string;
  description: string;
  author?: string;
  tags: string[];
  pubDate: Date;
  updatedDate?: Date;
  coverImage?: Post["data"]["coverImage"] | null;
}

export interface TagArchive {
  name: string;
  slug: string;
  posts: Post[];
}

export function isPublishedPost(post: Post) {
  return post.data.status.trim().toLowerCase() === "publicado";
}

function slugifyValue(value: string) {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
    locale: "pt",
  });
}

export function getPostSlug(post: Post) {
  return slugifyValue(post.data.title);
}

export function getPostData(post: Post): PostData {
  return {
    title: post.data.title,
    slug: getPostSlug(post),
    status: post.data.status,
    description: post.data.description,
    author: post.data.author,
    tags: post.data.tags,
    pubDate: post.data.pubDate,
    updatedDate: post.data.updatedDate,
    coverImage: post.data.coverImage,
  };
}

export function sortPostsByDate(posts: Post[]) {
  return [...posts].sort((a, b) => {
    const aTime = getPostData(a).pubDate.getTime();
    const bTime = getPostData(b).pubDate.getTime();

    return bTime - aTime;
  });
}

export async function getPublishedPosts() {
  const posts = await getCollection("blog");

  return sortPostsByDate(posts.filter(isPublishedPost));
}

export function getTagSlug(tag: string) {
  return slugifyValue(tag);
}

export function getTagPath(tag: string) {
  return `/blog/tags/${getTagSlug(tag)}/`;
}

export function getTagArchives(posts: Post[]) {
  const tags = new Map<string, TagArchive>();

  for (const post of posts) {
    for (const tag of new Set(getPostData(post).tags)) {
      const slug = getTagSlug(tag);
      const existing = tags.get(slug);

      if (existing) {
        existing.posts.push(post);
        continue;
      }

      tags.set(slug, {
        name: tag,
        slug,
        posts: [post],
      });
    }
  }

  return [...tags.values()].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }),
  );
}
