/**
 * Variant Helper Utilities
 * Functions to process and group product variants by color
 */

export interface VariantThumbnail {
  id: string;
  title: string;
  colorValue: string;
  colorName: string;
  image: {
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  } | null;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  } | null;
  availableForSale: boolean;
  handle: string;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

/**
 * Groups variants by color and returns the first variant of each color
 * with its thumbnail image for display in the color selector
 */
export function getColorVariantThumbnails(
  product: any,
  currentHandle: string
): VariantThumbnail[] {
  if (!product?.variants?.nodes) return [];

  const variants = product.variants.nodes;
  const colorMap = new Map<string, VariantThumbnail>();

  // Find the color option name (could be "Color" or "Colour")
  const colorOptionName = product.options?.find(
    (opt: any) => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour'
  )?.name || 'Color';

  variants.forEach((variant: any) => {
    const colorOption = variant.selectedOptions?.find(
      (opt: any) => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour'
    );

    if (!colorOption) return;

    const colorValue = colorOption.value;
    
    // Only add the first variant of each color (as thumbnail representative)
    if (!colorMap.has(colorValue)) {
      colorMap.set(colorValue, {
        id: variant.id,
        title: variant.title,
        colorValue: colorValue,
        colorName: colorValue,
        image: variant.image || null,
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        availableForSale: variant.availableForSale,
        handle: currentHandle,
        selectedOptions: variant.selectedOptions || [],
      });
    }
  });

  return Array.from(colorMap.values());
}

/**
 * Builds the URL query string for a specific variant selection
 */
export function buildVariantUrl(
  handle: string,
  colorValue: string,
  colorOptionName: string = 'Color'
): string {
  const params = new URLSearchParams();
  params.set(colorOptionName, colorValue);
  return `/products/${handle}?${params.toString()}`;
}

/**
 * Checks if a color variant is currently selected
 */
export function isColorSelected(
  colorValue: string,
  selectedVariant: any
): boolean {
  if (!selectedVariant?.selectedOptions) return false;
  
  const selectedColor = selectedVariant.selectedOptions.find(
    (opt: any) => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour'
  );
  
  return selectedColor?.value === colorValue;
}
