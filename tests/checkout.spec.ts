/**
 * Playwright test for the checkout flow.
 *
 * Generated from the prompt:
 *   "Write a Playwright test for the checkout flow: user adds item to cart,
 *    enters payment details, submits order, sees confirmation page."
 *
 * Run with:
 *   npx playwright test tests/checkout.spec.ts
 *
 * The PLAYWRIGHT_BASE_URL env var controls the target environment
 * (local dev, Vercel preview, staging). Set it in CI or via .env.
 *
 * ---------------------------------------------------------------------------
 * Corner cases this prompt did NOT generate
 * ---------------------------------------------------------------------------
 * The single-sentence prompt above produced a clean happy-path test, but it
 * silently skipped two failure modes that matter in production. A human
 * reviewer should add these before shipping:
 *
 * 1. Soft payment decline
 *    The card is valid (Luhn-passes, expiry in the future) but the issuer
 *    rejects the transaction. Two Stripe test cards exercise this:
 *      - 4000 0000 0000 0002  -> generic decline
 *      - 4000 0000 0000 9995  -> insufficient funds
 *    Expected behavior: the checkout page stays mounted, the inline error
 *    surfaces the decline reason, the cart is preserved, and the user can
 *    retry with a different card. The prompt-generated test never enters
 *    this branch — it only asserts the happy path lands on /order/confirmation.
 *
 * 2. Session expiry between cart and checkout
 *    The user adds items, takes a phone call, comes back 30 minutes later,
 *    and submits payment. Either the cart cookie expired or the auth token
 *    expired while the payment form was open. Expected behavior: graceful
 *    redirect to /login with the cart preserved server-side, so after
 *    re-auth the user lands back on /checkout with the same line items.
 *    The prompt-generated test runs entirely within a single fresh session
 *    and never exercises the expiry path.
 *
 * Both corner cases are common in real traffic and both are invisible to a
 * happy-path-only test. They are exactly the kind of coverage gap a coding
 * agent will not invent unless you prompt for it explicitly.
 * ---------------------------------------------------------------------------
 */

import { test, expect } from "@playwright/test";

test("checkout happy path: add to cart, pay, see confirmation", async ({
  page,
}) => {
  // 1. Land on a product page and add the item to the cart.
  await page.goto("/products/example-widget");
  await page.getByRole("button", { name: /add to cart/i }).click();

  // The Add-to-cart button typically updates a header badge or opens a
  // mini-cart. We don't assert on that here — the next step (visiting
  // /checkout) proves the item was persisted into the cart.

  // 2. Go to checkout.
  await page.goto("/checkout");
  await expect(page).toHaveURL(/\/checkout$/);

  // 3. Fill payment details with Stripe's canonical success test card.
  //    Card:    4242 4242 4242 4242
  //    Expiry:  12/30
  //    CVC:     123
  //    Postal:  12345
  await page.getByLabel(/card number/i).fill("4242 4242 4242 4242");
  await page.getByLabel(/expiry|expiration/i).fill("12/30");
  await page.getByLabel(/cvc|cvv|security code/i).fill("123");
  await page.getByLabel(/postal|zip/i).fill("12345");

  // 4. Submit the order.
  await page.getByRole("button", { name: /place order/i }).click();

  // 5. Confirmation page renders an order ID. We assert on the URL shape
  //    and on the presence of an order-id node, not on the exact ID value
  //    (it's generated server-side).
  await page.waitForURL(/\/order\/confirmation/);
  await expect(page).toHaveURL(/\/order\/confirmation/);

  const orderId = page.getByTestId("order-id");
  await expect(orderId).toBeVisible();
  await expect(orderId).not.toBeEmpty();
});
