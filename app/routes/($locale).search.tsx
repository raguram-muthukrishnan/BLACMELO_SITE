import {
  useLoaderData,
  useNavigate,
  useSearchParams,
} from 'react-router';
import {useState, useRef, useEffect} from 'react';
import type {Route} from './+types/search';
import {Analytics, Image, Money} from '@shopify/hydrogen';
import {Search as SearchIcon, Plus, X} from 'lucide-react';
import searchStyles from '~/styles/pages/search.css?url';

export const links = () => [
  {rel: 'stylesheet', href: searchStyles},
];

export const meta: Route.MetaFunction = () => {
  return [{title: `BLACMELO | Search`}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('q') || '';
  const gender = url.searchParams.get('gender') || 'all';
  const {storefront} = context;

  let products: any[] = [];
  let totalProducts = 0;

  try {
    // Fetch all products
    const {products: productConnection} = await storefront.query(ALL_PRODUCTS_QUERY, {
      variables: {
        first: 250,
      },
    });

    products = productConnection?.nodes || [];
    
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
    
    // Apply gender filter
    if (gender !== 'all') {
      products = products.filter((product: any) => {
        return matchesGenderFilter(product, gender);
      });
      console.log(`Filtered to ${products.length} products for gender: ${gender}`);
    }
    
    totalProducts = products.length;
  } catch (error) {
    console.error('Search error:', error);
    // Return empty results on error
    products = [];
    totalProducts = 0;
  }

  return {
    searchTerm,
    gender,
    products,
    totalProducts,
  };
}

/**
 * Check if product matches gender filter (for collection results)
 */
function matchesGenderFilter(product: any, gender: string): boolean {
  const tags = product.tags?.map((tag: string) => tag.toLowerCase()) || [];
  const title = product.title?.toLowerCase() || '';
  const productType = product.productType?.toLowerCase() || '';
  
  if (gender === 'male') {
    return tags.includes('men') || tags.includes('man') || tags.includes('male') ||
           title.includes('men') || title.includes('man') ||
           productType.includes('men') || productType.includes('man');
  } else if (gender === 'female') {
    return tags.includes('women') || tags.includes('woman') || tags.includes('female') ||
           title.includes('women') || title.includes('woman') ||
           productType.includes('women') || productType.includes('woman');
  }
  
  return true;
}

/**
 * Renders the /search route - REPRESENT Design System
 */
export default function SearchPage() {
  const {searchTerm, gender, products, totalProducts} = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(
    gender === 'male' ? 'male' : gender === 'female' ? 'female' : null
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
      if (selectedGender) params.set('gender', selectedGender);
      navigate(`/search?${params.toString()}`, { replace: true });
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [localSearchTerm, selectedGender, navigate]);

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    const params = new URLSearchParams();
    if (selectedGender) params.set('gender', selectedGender);
    navigate(`/search?${params.toString()}`);
  };

  const handleGenderToggle = (newGender: 'male' | 'female') => {
    const updatedGender = selectedGender === newGender ? null : newGender;
    setSelectedGender(updatedGender);
    const params = new URLSearchParams();
    if (localSearchTerm.trim()) params.set('q', localSearchTerm.trim());
    if (updatedGender) params.set('gender', updatedGender);
    navigate(`/search?${params.toString()}`);
  };

  const popularSearches = [
    '247',
    'T-Shirt',
    'Hoodie',
    'Jeans',
    'Jacket',
    'Sneakers',
    'Cap',
    'Shorts'
  ];

  return (
    <div className="min-h-screen bg-white pt-[63px] md:pt-[46px]">
      {/* Search Bar */}
      <div className="sticky top-[63px] md:top-[46px] z-40 bg-white border-b border-gray-200">
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
          <aside className="md:sticky md:top-[130px] md:self-start">
            <SidebarFilters
              selectedGender={selectedGender}
              onGenderToggle={handleGenderToggle}
              popularSearches={popularSearches}
              onSearchClick={(term) => setLocalSearchTerm(term)}
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

      <Analytics.SearchView data={{searchTerm, searchResults: {total: totalProducts}}} />
    </div>
  );
}

function ProductCard({product, searchTerm}: {product: any; searchTerm: string}) {
  const variant = product.selectedOrFirstAvailableVariant?.nodes?.[0];
  const image = variant?.image || product.images?.nodes?.[0];
  const price = variant?.price;
  const [isHovered, setIsHovered] = useState(false);
  
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
  
  return (
    <a
      href={`/products/${product.handle}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        
        {/* Quick Add Button */}
        <button
          className="absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center border border-black/5 bg-white hover:bg-black hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            // Add to cart logic here
          }}
        >
          <Plus size={16} />
        </button>
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
          
          {colorCount > 0 && (
            <p className="text-[10px] text-gray-500 font-medium">
              • {colorCount} {colorCount === 1 ? 'Color' : 'Colors'}
            </p>
          )}
        </div>
        
        {product.vendor && (
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
            {product.vendor}
          </p>
        )}
      </div>
    </a>
  );
}

/**
 * Sidebar Filters Component
 */
function SidebarFilters({
  selectedGender,
  onGenderToggle,
  popularSearches,
  onSearchClick,
}: {
  selectedGender: 'male' | 'female' | null;
  onGenderToggle: (gender: 'male' | 'female') => void;
  popularSearches: string[];
  onSearchClick: (term: string) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Gender Filter */}
      <div>
        <h3 className="text-[11px] uppercase tracking-wider font-semibold mb-4 text-black">
          Gender
        </h3>
        <div className="space-y-3">
          <FilterToggle
            label="Male"
            checked={selectedGender === 'male'}
            onChange={() => onGenderToggle('male')}
          />
          <FilterToggle
            label="Female"
            checked={selectedGender === 'female'}
            onChange={() => onGenderToggle('female')}
          />
        </div>
      </div>

      {/* Popular Searches */}
      <div>
        <h3 className="text-[11px] uppercase tracking-wider font-semibold mb-4 text-black">
          Popular Searches
        </h3>
        <div className="space-y-2">
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => onSearchClick(term)}
              className="block text-[12px] font-medium text-gray-700 border-b border-transparent hover:border-black transition-all py-1 text-left w-full"
            >
              {term}
            </button>
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
 * GraphQL Query to fetch all products
 */
const ALL_PRODUCTS_QUERY = `#graphql
  query SearchProducts($first: Int!) {
    products(first: $first) {
      nodes {
        id
        title
        handle
        description
        vendor
        productType
        tags
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
        variants(first: 10) {
          nodes {
            id
            title
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
