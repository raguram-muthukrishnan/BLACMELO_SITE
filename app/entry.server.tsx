import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    // The Lottie animation (Scene-1.json) embeds images as data:image/png
    // base64 URIs.  Without "data:" here the browser's CSP blocks them,
    // leaving a blank white rectangle instead of the logo.
    imgSrc: [
      "'self'",
      "data:",
      "https://cdn.shopify.com",
    ],
    // Fonts are embedded as base64 data URIs in CSS (Neue Haas Grotesk).
    // Without "data:" here the browser blocks them via the default-src fallback.
    fontSrc: [
      "'self'",
      "data:",
    ],
    // Judge.me widget fetches its preloader and widget scripts from cdn.judge.me.
    connectSrc: [
      "https://cdn.judge.me",
      "https://judge.me",
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
