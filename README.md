# Fellough Apparel

A Christian meme and streetwear storefront built with Next.js and hosted on Vercel. Whop is the source of truth for the product catalog and checkout.

## Stack

- Next.js App Router + TypeScript
- Vercel hosting and scheduled catalog revalidation
- Whop Products API for published products
- Whop product webhooks for near-real-time cache invalidation
- Whop Checkout Configurations for purchases

## Local setup

1. Install Node.js 20.9+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add a Whop Company API key and Whop business ID.
5. Run `npm run dev`.

Required Whop API permissions:
- `access_pass:basic:read`
- `plan:basic:read`
- `checkout_configuration:create`
- `webhook_receive:products`

The product API key must be scoped to the Fellough business account. Do not expose it to browser code.

## Whop configuration

Create a Whop webhook pointing to:

`https://YOUR_DOMAIN/api/webhooks/whop`

Subscribe to:
- `product.created`
- `product.updated`
- `product.deleted`
- `product.published`
- `product.unpublished`

Choose webhook API version `v1`, then copy its signing secret into `WHOP_WEBHOOK_SECRET`.

The webhook handler verifies the signed raw request with Whop's SDK before invalidating the product cache. A Vercel Cron Job also revalidates the catalog every 15 minutes as a fallback.

## Vercel environment variables

Add all variables from `.env.example` in Vercel Project Settings → Environment Variables. Add `CRON_SECRET` as a long random secret. The cron route expects Vercel's `Authorization: Bearer <CRON_SECRET>` header.

## Product authenticity rules

- The storefront only renders products returned by the configured Whop account's API with `visibility: visible`.
- No demo products, placeholder listings, generated product names, stock product photos, fake reviews, or fabricated prices are included.
- If Whop is not configured or returns an error, the storefront shows a clear setup/error state, never invented products.
- A missing product image remains an honest image-unavailable state.
- American-made product claims should only be displayed after the individual product's manufacturing origin has been documented and verified against applicable FTC requirements. The brand's supplier standard is that every product must be entirely manufactured in the United States.

## Checkout

The server validates that a requested product and plan belong to the current published Whop catalog before creating a Whop checkout configuration. The browser never supplies prices or receives the API key.

## Notes

The first deployment needs Whop credentials and a webhook configured in the Whop dashboard. Product synchronization cannot be live-tested until those account-specific credentials and a real product catalog are available.