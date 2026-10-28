import type { Metadata } from "next";

export const SITE_URL = "https://www.divergentclasses.com";

export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: SITE_URL + path },
    openGraph: { title, description, type: "website", url: SITE_URL + path },
  };
}
