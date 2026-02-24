import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Image } from '@shopify/hydrogen';
import { Plus } from 'lucide-react';
import { AddToCartButton } from '~/components/AddToCartButton';
import { sortSizeLabels } from '~/lib/sortSizes';

export function ProductCard({ product }: { product: any }) {
  const variant = product.selectedOrFirstAvailableVariant?.nodes?.[0];
  const image = variant?.image || product.images?.nodes?.[0];
  const price = variant?.price;
  const [showSizes, setShowSizes] = useState(false);

  // Count unique colors from variants
  const colorCount = product.variants?.nodes
    ? [...new Set(product.variants.nodes
      .map((v: any) => {
        const colorOption = v.selectedOptions?.find((opt: any) => opt.name.toLowerCase() === 'color');
        return colorOption?.value;
      })
      .filter(Boolean)
    )].length
    : 0;

  // Format price without decimals if .00
  const formatPrice = (priceData: any) => {
    const amount = parseFloat(priceData.amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: priceData.currencyCode,
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${product.handle}`)}
      className="group block cursor-pointer"
      onMouseLeave={() => setShowSizes(false)}
    >
      {/* Image Container - 3:4 Aspect Ratio */}
      <div className="aspect-[3/4] bg-[#F6F6F6] relative overflow-hidden mb-3">
        {image && (
          <Image
            data={image}
            alt={product.title}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
        )}

        {/* Quick Add Reveal Button (Mobile Only) */}
        <button
          className={`md:hidden absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center border border-black/10 bg-white/90 backdrop-blur-sm text-black shadow-sm transition-all duration-300 z-10 ${showSizes ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'
            }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowSizes(true);
          }}
        >
          <Plus size={16} />
        </button>

        {/* Sizes Grid (Revealed on hover for Desktop, or when + clicked on Mobile) */}
        <div
          className={`absolute bottom-3 left-0 right-0 flex flex-wrap gap-1.5 justify-center px-2 transition-all duration-300 z-20
            opacity-0 pointer-events-none translate-y-2 
            md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-hover:translate-y-0
            ${showSizes ? '!opacity-100 !pointer-events-auto !translate-y-0' : ''}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {(() => {
            // Build flat size list from all variants, deduplicate & sort
            const rawSizes = (product.variants?.nodes || []).map((v: any) => {
              const sizeOption = v.selectedOptions?.find((o: any) => o.name.toLowerCase() === 'size');
              if (!sizeOption) return null;
              return { label: sizeOption.value, available: v.availableForSale ?? true, variantId: v.id };
            }).filter(Boolean) as Array<{ label: string; available: boolean; variantId: string }>;

            const sortedSizes = sortSizeLabels(rawSizes);

            return sortedSizes.map((sizeItem) => (
              <AddToCartButton
                key={sizeItem.variantId}
                disabled={!sizeItem.available}
                lines={[{ merchandiseId: sizeItem.variantId, quantity: 1 }]}
                className={`text-[10px] font-semibold uppercase min-w-[28px] px-1.5 py-1 text-center border transition-all duration-200 ${!sizeItem.available
                  ? 'border-white/30 text-black/30 cursor-not-allowed bg-white/50 backdrop-blur-sm'
                  : 'border-white/60 bg-white/85 backdrop-blur-md text-black hover:bg-white hover:border-white hover:scale-105 hover:font-bold cursor-pointer shadow-sm'
                  }`}
              >
                {sizeItem.label === '2XL' ? 'XXL' : sizeItem.label}
              </AddToCartButton>
            ));
          })()}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="text-[10px] uppercase tracking-tighter font-semibold leading-tight text-black">
          {product.title}
        </h3>

        <div className="flex items-center gap-2">
          {price && (
            <p className="text-[10px] text-gray-500 font-medium">
              {formatPrice(price)}
            </p>
          )}

          {(() => {
            const colorFamilyMetafield = product.metafields?.find(
              (m: any) => m && m.namespace === 'custom' && m.key === 'color_family'
            );
            const colorFamily = colorFamilyMetafield?.value;

            if (colorFamily) {
              return (
                <p className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                  • {colorFamily}
                </p>
              );
            } else if (colorCount > 0) {
              return (
                <p className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                  • {colorCount} {colorCount === 1 ? 'Color' : 'Colors'}
                </p>
              );
            }
            return null;
          })()}
        </div>

        {product.vendor && (
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
            {product.vendor}
          </p>
        )}
      </div>
    </div>
  );
}
