# root.tsx Changes for Dynamic Header Menu

## Option 1: Collection Metafields Approach (Recommended - Simpler)

### Step 1: Update Imports

Add these imports at the top of `app/root.tsx`:

```typescript
import {COLLECTION_MENU_QUERY} from '~/graphql/CollectionMenuQuery';
import {parseCollectionMenus} from '~/lib/collectionMenu';
```

Remove these imports (if using metaobject approach):
```typescript
// Remove these:
// import {HEADER_MENU_QUERY} from '~/graphql/HeaderMenuQuery';
// import {parseHeaderMenus} from '~/lib/headerMenu';
```

### Step 2: Update loadCriticalData Function

Replace the current implementation with:

```typescript
async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [header, collectionMenuData] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu',
      },
    }),
    // Fetch collections with menu metafields
    storefront.query(COLLECTION_MENU_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        first: 50, // Adjust if you have more collections
      },
    }).catch((error: Error) => {
      console.error('Error fetching collection menu data:', error);
      return null;
    }),
  ]);

  // Parse collection menu data or use fallback
  const menuConfigs = collectionMenuData 
    ? parseCollectionMenus(collectionMenuData, {
        man: menuManImage,
        women: menuWomanImage,
        blacmelo: menuManImage,
      })
    : null;

  return {header, menuConfigs};
}
```

---

## Option 2: Metaobject Approach (More Flexible)

### Step 1: Update Imports

Keep the existing imports:

```typescript
import {HEADER_MENU_QUERY} from '~/graphql/HeaderMenuQuery';
import {parseHeaderMenus} from '~/lib/headerMenu';
```

### Step 2: Update loadCriticalData Function

The current implementation should already work:

```typescript
async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [header, menuMetaobjects] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu',
      },
    }),
    // Fetch header menu metaobjects
    storefront.query(HEADER_MENU_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        menuKeys: ['man', 'women', 'blacmelo'],
      },
    }).catch((error: Error) => {
      console.error('Error fetching header menu metaobjects:', error);
      return null;
    }),
  ]);

  // Parse menu metaobjects or use fallback
  const menuConfigs = menuMetaobjects 
    ? parseHeaderMenus(menuMetaobjects)
    : null;

  return {header, menuConfigs};
}
```

---

## Complete root.tsx File (Collection Approach)

Here's what your complete `root.tsx` should look like with the collection approach:

```typescript
import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
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
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindCss from './styles/tailwind.css?url';
import filterPanelStyles from './styles/filter-panel.css?url';
import {PageLayout} from './components/PageLayout';
import {LenisProvider} from '~/components/smooth-scroll/LenisProvider';
import {COLLECTION_MENU_QUERY} from '~/graphql/CollectionMenuQuery';
import {parseCollectionMenus} from '~/lib/collectionMenu';
import menuManImage from '~/assets/menu/menu_man.jpeg';
import menuWomanImage from '~/assets/menu/menu_woman.jpeg';

export type RootLoader = typeof loader;

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return false;
};

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
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [header, collectionMenuData] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu',
      },
    }),
    storefront.query(COLLECTION_MENU_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        first: 50,
      },
    }).catch((error: Error) => {
      console.error('Error fetching collection menu data:', error);
      return null;
    }),
  ]);

  const menuConfigs = collectionMenuData 
    ? parseCollectionMenus(collectionMenuData, {
        man: menuManImage,
        women: menuWomanImage,
        blacmelo: menuManImage,
      })
    : null;

  return {header, menuConfigs};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const {storefront, customerAccount, cart} = context;

  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer',
      },
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });
    
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss}></link>
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <link rel="stylesheet" href={filterPanelStyles}></link>
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
```

---

## Verification

After making changes:

1. **Check for TypeScript errors:**
   ```bash
   npm run typecheck
   ```

2. **Restart dev server:**
   ```bash
   npm run dev
   ```

3. **Test the header:**
   - Navigate to your site
   - Hover over "Man", "Women", "Blacmelo+" links
   - Verify menus display correctly
   - Check that links work

4. **Check console:**
   - Open browser DevTools
   - Look for any errors
   - Verify menu data is loading

---

## Rollback

If you need to revert to hardcoded menus:

1. Remove the menu query from `loadCriticalData`
2. Remove `menuConfigs` from the return statement
3. The Header component will automatically use fallback menus

The system is designed to gracefully fall back to hardcoded menus if dynamic data isn't available.
