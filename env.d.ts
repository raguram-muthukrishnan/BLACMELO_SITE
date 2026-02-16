/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

import type {HydrogenEnv} from '@shopify/hydrogen';

// Extend the Env interface with environment variables
declare module '@shopify/hydrogen' {
  interface Env extends HydrogenEnv {
    // Shopify variables
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_ID: string;
    PUBLIC_CHECKOUT_DOMAIN: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    
    // Judge.me variables
    JUDGEME_SHOP_DOMAIN?: string;
    JUDGEME_PUBLIC_TOKEN?: string;
    JUDGEME_CDN_HOST?: string;
  }
}
