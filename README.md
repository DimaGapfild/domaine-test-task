# Domaine Test Task — Custom Collection Page (Shopify Dawn)

A Shopify theme based on **Dawn 11.0.0** with a custom collection template and an
interactive product card built as a native web component.

## What was added on top of Dawn

| File | Purpose |
| --- | --- |
| [templates/collection.custom.json](templates/collection.custom.json) | Alternate collection template that renders the custom product grid |
| [sections/main-custom-collection-product-grid.liquid](sections/main-custom-collection-product-grid.liquid) | Collection grid section (filtering, sorting, pagination) that renders the custom card |
| [snippets/card-product-custom.liquid](snippets/card-product-custom.liquid) | Markup for the custom product card |
| [assets/product-card.js](assets/product-card.js) | `<product-card>` custom element: colour swatches, variant switching, add to cart |
| [layout/theme.liquid](layout/theme.liquid) | Loads Tailwind, the Roboto font and `product-card.js` only on the custom template; exposes `shop.money_format` on `<body>` |

Everything else is stock Dawn.

## Features

- **Colour swatches** — rendered from the product's `Color` option, coloured via the
  `custom.variants_swatch_colors` metafield (a JSON map of `option value → hex`).
- **Variant switching without a page reload** — clicking a swatch updates the image,
  title, price, compare-at price, sale badge and the button's `data-variant-id`.
- **Hover image** — the second image is picked up by naming convention: a media file
  whose filename contains `<option value>-secondary` (e.g. `blue-secondary.jpg`).
- **Sale badge** — shown when the variant has a compare-at price; its label comes from
  the `custom.sale_badge_title` metafield.
- **Add to cart** — posts the selected variant to the AJAX Cart API (`/cart/add.js`).
- **Prices formatted client-side** using the shop's money format read from
  `document.body.dataset.moneyFormat`.

## Required product setup

For a product to render correctly on the custom card it needs:

1. An option named **`Color`**.
2. Metafield `custom.variants_swatch_colors` (JSON) — e.g.
   ```json
   { "blue": "#0A4874", "beige": "#E8DCC8" }
   ```
   Keys are the lowercased option values.
3. Metafield `custom.sale_badge_title` (single line text) — e.g. `Sale`.
4. Per-variant featured images, plus optional hover images named
   `<option value>-secondary.<ext>`.

## Viewing the page

The template is an **alternate** collection template, so append the suffix to the
collection URL:

```
/collections/<collection-handle>?view=custom
```

Or assign it to a collection in the admin: *Products → Collections → <collection> →
Theme template → `collection.custom`*.

## Local development

```bash
# Shopify CLI 3.x
shopify theme dev --store <your-store>.myshopify.com
shopify theme push --unpublished   # upload as a new theme
```

## Notes / known limitations

- Tailwind is loaded from the CDN (`@tailwindcss/browser`) for the sake of the task.
  For production it should be compiled into a theme asset — the runtime build is slow
  and arbitrary values such as `bg-[{{color}}]` are not reliably generated at runtime.
- The add-to-cart request only logs its result; it does not update the cart drawer or
  the header cart count yet.
