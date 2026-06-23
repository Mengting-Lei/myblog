import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";

/**
 * Returns posts that are eligible to be shown to users.
 *
 * Sorting priority:
 *   1. Featured posts (featured: true) come first
 *   2. Then by "last updated" descending (uses `modDatetime` when present, otherwise `pubDatetime`)
 */
export function getSortedPosts(posts: CollectionEntry<"posts">[]) {
  return posts
    .filter(postFilter)
    .sort((a, b) => {
      // Featured posts always first
      const aFeatured = a.data.featured ? 1 : 0;
      const bFeatured = b.data.featured ? 1 : 0;
      if (aFeatured !== bFeatured) return bFeatured - aFeatured;

      // Then by date
      return (
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
      );
    });
}
