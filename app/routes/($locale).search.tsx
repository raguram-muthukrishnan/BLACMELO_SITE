import {
  useLoaderData,
  useNavigate,
  useSearchParams,
} from 'react-router';
import { useState, useRef, useEffect } from 'react';
// @ts-ignore
import type { Route } from './+types/search';
import { Analytics, Image, Money } from '@shopify/hydrogen';
import { Search as SearchIcon, Plus, X } from 'lucide-react';
import searchStyles from '~/styles/pages/search.css?url';
import { AddToCartButton } from '~/components/AddToCartButton';
import { ProductCard } from '~/components/ProductCard';

export const links = () => [
  { rel: 'stylesheet', href: searchStyles },
];

export const meta: Route.MetaFunction = () => {
  return [{ title: `BLACMELO | Search` }];
};

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('q') || '';
  const collectionHandle = url.searchParams.get('collection') || 'all';
  const { storefront } = context;

  let products: any[] = [];
  let collectionsResult: any[] = [];
  let totalProducts = 0;

  try {
    // Fetch all products and collections
    const { products: productConnection, collections: collectionConnection } = await storefront.query(ALL_PRODUCTS_AND_COLLECTIONS_QUERY, {
      variables: {
        first: 250,
      },
    });

    products = productConnection?.nodes || [];
    collectionsResult = collectionConnection?.nodes || [];

    console.log(`Fetched ${products.length} products from Shopify`);

    // Apply search filter if search term exists
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      products = products.filter((product: any) => {
        // Search in title
        if (product.title?.toLowerCase().includes(term)) return true;

        // Search in description
        if (product.description?.toLowerCase().includes(term)) return true;

        // Search in vendor
        if (product.vendor?.toLowerCase().includes(term)) return true;

        // Search in product type
        if (product.productType?.toLowerCase().includes(term)) return true;

        // Search in tags
        if (product.tags?.some((tag: string) => tag.toLowerCase().includes(term))) return true;

        // Search in variant titles
        if (product.variants?.nodes?.some((variant: any) =>
          variant.title?.toLowerCase().includes(term)
        )) return true;

        return false;
      });

      console.log(`Filtered to ${products.length} products matching "${searchTerm}"`);
    }

    // Apply collection filter
    if (collectionHandle !== 'all') {
      products = products.filter((product: any) => {
        return product.collections?.nodes?.some((c: any) => c.handle === collectionHandle);
      });
      console.log(`Filtered to ${products.length} products for collection: ${collectionHandle}`);
    }

    totalProducts = products.length;
  } catch (error) {
    console.error('Search error:', error);
    // Return empty results on error
    products = [];
    collectionsResult = [];
    totalProducts = 0;
  }

  return {
    searchTerm,
    collectionHandle,
    products,
    collections: collectionsResult,
    totalProducts,
  };
}

/**
 * Renders the /search route - REPRESENT Design System
 */
export default function SearchPage() {
  const { searchTerm, collectionHandle, products, collections, totalProducts } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    collectionHandle === 'all' ? null : collectionHandle
  );
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Live search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (localSearchTerm.trim()) params.set('q', localSearchTerm.trim());
      if (selectedCollection) params.set('collection', selectedCollection);
      navigate(`/search?${params.toString()}`, { replace: true });
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [localSearchTerm, selectedCollection, navigate]);

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    const params = new URLSearchParams();
    if (selectedCollection) params.set('collection', selectedCollection);
    navigate(`/search?${params.toString()}`);
  };

  const handleCollectionToggle = (handle: string) => {
    const updatedCollection = selectedCollection === handle ? null : handle;
    setSelectedCollection(updatedCollection);
    const params = new URLSearchParams();
    if (localSearchTerm.trim()) params.set('q', localSearchTerm.trim());
    if (updatedCollection) params.set('collection', updatedCollection);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white pt-[116px] md:pt-[116px]">
      {/* Search Bar */}
      <div className="sticky top-[116px] z-40 bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-3">
            <SearchIcon className="text-gray-600 flex-shrink-0" size={20} />
            <div className="relative flex-1">
              <input
                type="search"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="w-full px-5 py-3.5 border border-gray-300 text-[13px] font-normal focus:outline-none focus:border-black transition-colors"
                autoFocus
              />
              {localSearchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[11px] uppercase font-medium text-gray-500 hover:text-black transition-colors tracking-wider"
                >
                  clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Grid Layout */}
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="md:sticky md:top-[180px] md:self-start">
            <SidebarFilters
              collections={collections}
              selectedCollection={selectedCollection}
              onCollectionToggle={handleCollectionToggle}
            />
          </aside>

          {/* Right Content - Products Grid */}
          <div>
            {/* Results Header */}
            {searchTerm && (
              <div className="mb-6">
                <h2 className="text-[13px] font-medium text-gray-600">
                  {totalProducts} {totalProducts === 1 ? 'result' : 'results'} for "{searchTerm}"
                </h2>
              </div>
            )}

            {!searchTerm && (
              <div className="mb-6">
                <h2 className="text-[13px] font-medium text-gray-600">
                  All Products ({totalProducts})
                </h2>
              </div>
            )}

            {/* Products Grid */}
            {totalProducts === 0 ? (
              <div className="text-center py-20">
                <p className="text-sm text-gray-500">No products found. Try a different search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-1 gap-y-10">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Analytics.SearchView
        data={{
          searchTerm,
          searchResults: {
            nodes: products,
            pageInfo: {hasNextPage: false, hasPreviousPage: false},
          },
        }}
      />
    </div>
  );
}


/**
 * Sidebar Filters Component
 */
function SidebarFilters({
  collections,
  selectedCollection,
  onCollectionToggle,
}: {
  collections: any[];
  selectedCollection: string | null;
  onCollectionToggle: (handle: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Collections Filter Accordion (Mobile) / Expanded (Desktop) */}
      <div className="border-b border-gray-200 md:border-none pb-4 md:pb-0">
        <button
          className="w-full flex items-center justify-between text-left md:cursor-default"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <h3 className="text-[11px] uppercase tracking-wider font-semibold text-black">
            Collections {selectedCollection && '(1)'}
          </h3>
          <span className="md:hidden text-[16px] font-light leading-none">
            {isOpen ? '−' : '+'}
          </span>
        </button>

        <div className={`mt-4 space-y-3 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px]' : 'max-h-0 md:max-h-[none]'}`}>
          {collections.map((collection) => (
            <FilterToggle
              key={collection.id}
              label={collection.title}
              checked={selectedCollection === collection.handle}
              onChange={() => onCollectionToggle(collection.handle)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Custom Checkbox Filter Toggle
 */
function FilterToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="appearance-none w-4 h-4 border border-gray-300 checked:bg-black checked:border-black transition-colors cursor-pointer"
        />
        {checked && (
          <svg
            className="absolute inset-0 w-4 h-4 text-white pointer-events-none"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M3 8L6.5 11.5L13 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="text-[13px] font-medium text-gray-700 group-hover:text-black transition-colors">
        {label}
      </span>
    </label>
  );
}

/**
 * GraphQL Query to fetch all products and collections
 */
const ALL_PRODUCTS_AND_COLLECTIONS_QUERY = `#graphql
  query SearchProductsAndCollections($first: Int!) {
    collections(first: 20) {
      nodes {
        id
        handle
        title
      }
    }
    products(first: $first) {
      nodes {
        id
        title
        handle
        description
        vendor
        productType
        tags
        collections(first: 5) {
          nodes {
            handle
          }
        }
        selectedOrFirstAvailableVariant: variants(first: 1) {
          nodes {
            id
            title
            image {
              url
              altText
              width
              height
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
        variants(first: 20) {
          nodes {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
        images(first: 1) {
          nodes {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
` as const;
