import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {useJudgeme} from '@judgeme/shopify-hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import type {Route} from './+types/root';
import favicon from '~/assets/favicon.png';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
// Core styles (loaded globally)
import resetStyles from '~/styles/reset.css?url';
import fontsStyles from '~/styles/core/fonts.css?url';
import themeStyles from '~/styles/core/theme.css?url';
import tailwindCss from '~/styles/core/tailwind.css?url';
import globalsStyles from '~/styles/core/globals.css?url';

// Utility styles (loaded globally)
import animationsStyles from '~/styles/utilities/animations.css?url';
import responsiveStyles from '~/styles/utilities/responsive.css?url';
import typographyStyles from '~/styles/utilities/typography.css?url';
import customSpacingStyles from '~/styles/utilities/custom-spacing.css?url';

// Layout styles (loaded globally since layout appears on all pages)
import headerStyles from '~/styles/layout/header.css?url';
import footerStyles from '~/styles/layout/footer.css?url';
import overlayStyles from '~/styles/layout/overlay.css?url';
import announcementBarStyles from '~/styles/layout/announcement-bar.css?url';
import scrollbarStyles from '~/styles/components/scrollbar.css?url';
import hoverMenuStyles from '~/styles/components/menus/hover-menu.css?url';
import mobileMenuStyles from '~/styles/components/menus/mobile-menu.css?url';
import cartStyles from '~/styles/components/cart/cart.css?url';

// Component-specific and page-specific styles are now imported in their respective components/routes
import {PageLayout} from './components/PageLayout';
import {LenisProvider} from '~/components/smooth-scroll/LenisProvider';
import {DYNAMIC_HEADER_MENU_QUERY} from '~/graphql/DynamicHeaderMenuQuery';
import {ANNOUNCEMENT_BAR_QUERY} from '~/graphql/AnnouncementBarQuery';
import {parseDynamicHeaderMenu} from '~/lib/dynamicHeaderMenu';
import {parseAnnouncementBar, getFallbackAnnouncements} from '~/lib/announcementBar';
import menuManImage from '~/assets/menu/menu_man.jpeg';
import menuWomanImage from '~/assets/menu/menu_woman.jpeg';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/png', href: favicon},
    // Core styles (loaded globally)
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: fontsStyles},
    {rel: 'stylesheet', href: themeStyles},
    {rel: 'stylesheet', href: tailwindCss},
    {rel: 'stylesheet', href: globalsStyles},
    // Utility styles (loaded globally)
    {rel: 'stylesheet', href: animationsStyles},
    {rel: 'stylesheet', href: responsiveStyles},
    {rel: 'stylesheet', href: typographyStyles},
    {rel: 'stylesheet', href: customSpacingStyles},
    // Layout styles (loaded globally since layout appears on all pages)
    {rel: 'stylesheet', href: headerStyles},
    {rel: 'stylesheet', href: footerStyles},
    {rel: 'stylesheet', href: overlayStyles},
    {rel: 'stylesheet', href: announcementBarStyles},
    {rel: 'stylesheet', href: scrollbarStyles},
    {rel: 'stylesheet', href: hoverMenuStyles},
    {rel: 'stylesheet', href: mobileMenuStyles},
    {rel: 'stylesheet', href: cartStyles},
  ];
}

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN!,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID!,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN!,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN!,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [header, dynamicMenuData, announcementData] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu',
      },
    }),
    // Fetch collections for dynamic header menu
    storefront.query(DYNAMIC_HEADER_MENU_QUERY, {
      cache: storefront.CacheNone(), // Temporarily disable cache for testing
      variables: {
        first: 50,
      },
    }).catch((error: Error) => {
      console.error('Error fetching dynamic menu data:', error);
      return null;
    }),
    // Fetch announcement bar data
    storefront.query(ANNOUNCEMENT_BAR_QUERY, {
      cache: storefront.CacheNone(), // Temporarily disable cache for testing
    }).catch((error: Error) => {
      console.error('Error fetching announcement data:', error);
      return null;
    }),
  ]);

  // Parse dynamic menu data
  const menMenuConfig = parseDynamicHeaderMenu(dynamicMenuData, menuManImage, 'men');
  const womenMenuConfig = parseDynamicHeaderMenu(dynamicMenuData, menuWomanImage, 'women');
  console.log('✅ Men menu config built with', menMenuConfig.sections.length, 'sections');
  console.log('✅ Women menu config built with', womenMenuConfig.sections.length, 'sections');

  // Parse announcement data
  const announcements = announcementData 
    ? parseAnnouncementBar(announcementData)
    : getFallbackAnnouncements();
  console.log('📢 Announcements loaded:', announcements.length);

  return {header, menMenuConfig, womenMenuConfig, announcements};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
    judgeme: {
      shopDomain: (context.env as any).JUDGEME_SHOP_DOMAIN || '',
      publicToken: (context.env as any).JUDGEME_PUBLIC_TOKEN || '',
      cdnHost: (context.env as any).JUDGEME_CDN_HOST || 'https://cdn.judge.me',
      delay: 500,
    },
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) {
    return <Outlet />;
  }

  useJudgeme(data.judgeme);

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <LenisProvider>
        <PageLayout {...data}>
          <Outlet />
        </PageLayout>
      </LenisProvider>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}
