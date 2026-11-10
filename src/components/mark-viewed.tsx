"use client";

import { useEffect } from "react";
import { usePack } from "./pack-provider";

/** Counts a profile visit towards the "Scholar" achievement. */
export function MarkViewed({ slug }: { slug: string }) {
  const { markViewed } = usePack();
  useEffect(() => markViewed(slug), [slug, markViewed]);
  return null;
}
