export const reviewLinkKeys = {
  all: () => ["review-links"] as const,
  lists: () => [...reviewLinkKeys.all(), "list"] as const,
  list: () => [...reviewLinkKeys.lists()] as const,
  details: () => [...reviewLinkKeys.all(), "detail"] as const,
  detail: (linkId: string) => [...reviewLinkKeys.details(), linkId] as const,
  public: () => [...reviewLinkKeys.all(), "public"] as const,
  publicBySlug: (slug: string) => [...reviewLinkKeys.public(), slug] as const,
  slugCheck: () => [...reviewLinkKeys.all(), "slug-check"] as const,
  slugAvailability: (slug: string, excludeId?: string) =>
    [...reviewLinkKeys.slugCheck(), slug, excludeId] as const,
};
