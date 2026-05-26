/**
 * Utility helper functions for Shopify product exclusivity, gender classification,
 * and visibility routing based on tags and collection assignments.
 */

export interface MinimialProduct {
  id?: string;
  handle?: string;
  title?: string;
  tags?: string[];
  collections?: {
    nodes: Array<{
      handle: string;
      title?: string;
    }>;
  };
}

/**
 * Checks if a product is Private Access exclusive.
 * Rules:
 * - Product tags contain 'exclusive:private', 'private-access', or 'private'
 * - OR product belongs to 'private-access' or 'private' collection
 */
export function isPrivateExclusive(product: MinimialProduct | null | undefined): boolean {
  if (!product) return false;

  // 1. Check tags (case-insensitive)
  const tags = product.tags || [];
  const hasPrivateTag = tags.some((tag: string) => {
    const t = tag.toLowerCase().trim();
    return t === 'exclusive:private' || t === 'private-access' || t === 'private';
  });
  if (hasPrivateTag) return true;

  // 2. Check collections (case-insensitive handle matching)
  const collections = product.collections?.nodes || [];
  const hasPrivateCollection = collections.some((col: any) => {
    const h = col.handle?.toLowerCase().trim();
    return h === 'private-access' || h === 'private';
  });

  return hasPrivateCollection;
}

/**
 * Checks if a product is Blacmelo Club exclusive.
 * Rules:
 * - Product tags contain 'exclusive:blacmeloclub' or 'blacmelo-club'
 * - OR product belongs to 'blacmelo-club' collection
 */
export function isClubExclusive(product: MinimialProduct | null | undefined): boolean {
  if (!product) return false;

  // 1. Check tags (case-insensitive)
  const tags = product.tags || [];
  const hasClubTag = tags.some((tag: string) => {
    const t = tag.toLowerCase().trim();
    return t === 'exclusive:blacmeloclub' || t === 'blacmelo-club';
  });
  if (hasClubTag) return true;

  // 2. Check collections (case-insensitive handle matching)
  const collections = product.collections?.nodes || [];
  const hasClubCollection = collections.some((col: any) => {
    const h = col.handle?.toLowerCase().trim();
    return h === 'blacmelo-club';
  });

  return hasClubCollection;
}

/**
 * Checks if a product belongs to the Men's section.
 * Rules:
 * - Product tags contain 'men' or 'man'
 * - OR product belongs to 'men' or 'man' collection
 */
export function isMenProduct(product: MinimialProduct | null | undefined): boolean {
  if (!product) return false;

  const tags = product.tags || [];
  
  // Normalize tags
  const normalizedTags = tags.map(t => t.toLowerCase().trim());
  const hasMenTag = normalizedTags.includes('men') || normalizedTags.includes('man');
  const hasWomenTag = normalizedTags.includes('women') || normalizedTags.includes('woman');

  // If explicitly tagged as exclusively women's, it's not a men's product
  if (hasWomenTag && !hasMenTag) {
    return false;
  }

  if (hasMenTag) return true;

  // Check collections
  const collections = product.collections?.nodes || [];
  const hasMenCollection = collections.some((col: any) => {
    const h = col.handle?.toLowerCase().trim();
    return h === 'men' || h === 'man';
  });

  return hasMenCollection;
}

/**
 * Checks if a product belongs to the Women's section.
 * Rules:
 * - Product tags contain 'women' or 'woman'
 * - OR product belongs to 'women', 'woman', 'w-tops', or 'women-tops' collection
 */
export function isWomenProduct(product: MinimialProduct | null | undefined): boolean {
  if (!product) return false;

  const tags = product.tags || [];
  
  // Normalize tags
  const normalizedTags = tags.map(t => t.toLowerCase().trim());
  const hasMenTag = normalizedTags.includes('men') || normalizedTags.includes('man');
  const hasWomenTag = normalizedTags.includes('women') || normalizedTags.includes('woman');

  // If explicitly tagged as exclusively men's, it's not a women's product
  if (hasMenTag && !hasWomenTag) {
    return false;
  }

  if (hasWomenTag) return true;

  // Check collections
  const collections = product.collections?.nodes || [];
  const hasWomenCollection = collections.some((col: any) => {
    const h = col.handle?.toLowerCase().trim();
    return (
      h === 'women' ||
      h === 'woman' ||
      h === 'w-tops' ||
      h === 'women-tops'
    );
  });

  return hasWomenCollection;
}

/**
 * Checks if a product is exclusive to any premium group (Private Access or Club).
 */
export function isExclusiveProduct(product: MinimialProduct | null | undefined): boolean {
  return isPrivateExclusive(product) || isClubExclusive(product);
}

/**
 * Retrieves all images matching a specific gender context for a product.
 * Searches first by image Alt Text, then falls back to product tag indices (e.g. men_image_index:N).
 */
export function getGenderImages(product: any, gender: 'men' | 'women'): any[] {
  if (!product) return [];
  const rawImages = product.images?.nodes || [];

  // Search by image alt text (Recommended & robust)
  return rawImages.filter((img: any) => {
    const alt = img.altText?.toLowerCase().trim() || '';
    if (gender === 'men') {
      return alt === 'men' || alt === 'man' || alt.includes('gender:men') || alt.includes('gender:man');
    } else {
      return alt === 'women' || alt === 'woman' || alt.includes('gender:women') || alt.includes('gender:woman');
    }
  });
}

/**
 * Returns the primary featured image matching the specified gender context.
 * Falls back to the product's featuredImage or the first gallery image.
 */
export function getGenderFeaturedImage(product: any, genderContext?: string | null): any {
  if (!product) return null;
  const defaultImage = product.featuredImage || product.images?.nodes?.[0];
  if (!genderContext || (genderContext !== 'men' && genderContext !== 'women')) {
    return defaultImage;
  }
  const genderImages = getGenderImages(product, genderContext);
  return genderImages[0] || defaultImage;
}

/**
 * Returns the secondary hover image matching the specified gender context.
 * Falls back to the second gallery image, or the first non-matching image if only one gender image exists.
 */
export function getGenderHoverImage(product: any, genderContext?: string | null): any {
  if (!product) return null;
  const defaultHover = product.images?.nodes?.[1];
  if (!genderContext || (genderContext !== 'men' && genderContext !== 'women')) {
    return defaultHover;
  }
  const genderImages = getGenderImages(product, genderContext);
  // If we have at least 2 gender-specific images, use the second one as hover!
  if (genderImages.length >= 2) {
    return genderImages[1];
  }
  // Otherwise, if we have exactly 1 gender-specific image, we hover to the first non-matching image
  const firstGenderImage = genderImages[0];
  const allImages = product.images?.nodes || [];
  const secondaryImage = allImages.find((img: any) => img.id !== firstGenderImage?.id);
  return secondaryImage || null;
}

/**
 * Filters the product's image gallery to show only images relevant to the active gender context,
 * plus any general/neutral images (such as fabric detailed shots or flat-lays).
 * Completely filters out and hides images explicitly designated for the opposite gender.
 */
export function getGenderFilteredImages(product: any, genderContext?: string | null): any[] {
  if (!product) return [];
  const rawImages = product.images?.nodes || [];
  if (!genderContext || (genderContext !== 'men' && genderContext !== 'women')) {
    return rawImages;
  }

  // Helper to check if an image's alt text matches a specific gender
  const matchesGenderAlt = (img: any, gender: 'men' | 'women'): boolean => {
    const alt = img.altText?.toLowerCase().trim() || '';
    if (gender === 'men') {
      return alt === 'men' || alt === 'man' || alt.includes('gender:men') || alt.includes('gender:man');
    } else {
      return alt === 'women' || alt === 'woman' || alt.includes('gender:women') || alt.includes('gender:woman');
    }
  };

  // Find all images matching either gender context
  const hasGenderAlt = rawImages.some((img: any) => matchesGenderAlt(img, 'men') || matchesGenderAlt(img, 'women'));

  // If this product has absolutely NO gender configuration, return all images
  if (!hasGenderAlt) {
    return rawImages;
  }

  // Filter the images: keep current gender images & neutral images; exclude opposite gender images
  const filtered = rawImages.filter((img: any) => {
    const isExplicitlyMen = matchesGenderAlt(img, 'men');
    const isExplicitlyWomen = matchesGenderAlt(img, 'women');

    if (genderContext === 'men') {
      // Keep if it matches Men's OR if it is a general/neutral image (not explicitly Women's)
      return isExplicitlyMen || !isExplicitlyWomen;
    } else {
      // Keep if it matches Women's OR if it is a general/neutral image (not explicitly Men's)
      return isExplicitlyWomen || !isExplicitlyMen;
    }
  });

  // Re-order the filtered array so that explicitly matched gender images come first in the list
  const currentGenderMatched = filtered.filter((img: any) => matchesGenderAlt(img, genderContext));
  const rest = filtered.filter((img: any) => !currentGenderMatched.some((m: any) => m.id === img.id));

  return [...currentGenderMatched, ...rest];
}

