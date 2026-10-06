# predefinedDiscounts.ts

## 1. What this file is for

### Why this file exists
`src/utils/predefinedDiscounts.ts` is a utility module for array transformation and state synchronization. It filters, synchronizes, and cleans discount collections between Admin settings, user manual discounts, and active applied cart states.

### What problem it solves
Managing discount lists involves several state synchronization rules:
- Only Admin-enabled predefined discounts should appear on the customer Discounts page.
- When Admin renames or updates a predefined discount, existing customer manual discounts must be preserved.
- When Admin disables a predefined discount, any active toggle state for that discount must be automatically dropped.
- Manual discounts do not have toggle switches; they are always active when added.

`predefinedDiscounts.ts` centralizes these business rules into pure helper functions.

### Which part of the application uses it
- **[`App.tsx`](../../src/App.tsx):** Uses `syncDiscounts`, `syncActiveIds`, and `getAppliedDiscounts` to synchronize state when API notifications fire.
- **[`DiscountList.tsx`](../components/discounts/DiscountList.md):** Uses `removeDiscount` when deleting manual discounts.
- **[`predefinedDiscounts.test.ts`](./predefinedDiscounts.test.md):** Automated unit test suite verifying list transformation logic.

---

## 2. Imports

```ts
import type { PredefinedDiscount } from '../api/mockData'
import type { Discount } from '../types/discount'
```

### Explanation
- **`type { PredefinedDiscount }`:** Type-only import of predefined discount interface containing `enabled: boolean`.
- **`type { Discount }`:** Type-only import of base discount interface without `enabled`.

---

## 3. Main Code & Function Documentation

---

### `getAvailableDiscounts`

```ts
export function getAvailableDiscounts(
  predefinedDiscounts: PredefinedDiscount[]
): Discount[] {
  return predefinedDiscounts
    .filter((discount) => discount.enabled)
    .map(({ enabled: _enabled, ...discount }) => discount)
}
```

#### What it does
Filters predefined automatic discounts to return only those enabled by Admin (`enabled === true`), and strips the Admin-specific `enabled` property from the returned objects.

#### Parameters
- **`predefinedDiscounts: PredefinedDiscount[]`:** Array of predefined discount objects from API/storage.

#### Return value
- **`Discount[]`:** Array of available discount objects (without `enabled` property).

#### How it works step by step
1. `.filter((discount) => discount.enabled)` keeps only items where `enabled` is `true`.
2. `.map(({ enabled: _enabled, ...discount }) => discount)` uses object destructuring rest syntax (`...discount`) to strip `enabled` so public discount state does not leak internal Admin flags.

#### Where used in the application
Internal helper used inside `syncDiscounts` and `syncActiveIds`.

---

### `syncDiscounts`

```ts
export function syncDiscounts(
  currentDiscounts: Discount[],
  predefinedDiscounts: PredefinedDiscount[]
): Discount[] {
  return [
    ...getAvailableDiscounts(predefinedDiscounts),
    ...currentDiscounts.filter((discount) => discount.source === 'manual'),
  ]
}
```

#### What it does
Combines currently available Admin-enabled predefined discounts with existing user-created manual discounts into a single array.

#### Parameters
- **`currentDiscounts: Discount[]`:** Current discounts array in checkout state.
- **`predefinedDiscounts: PredefinedDiscount[]`:** Latest predefined discounts from API/storage.

#### Return value
- **`Discount[]`:** Synchronized array with predefined automatic discounts first, followed by manual discounts.

#### How it works step by step
1. Calls `getAvailableDiscounts(predefinedDiscounts)` to extract all enabled predefined discounts.
2. Filters `currentDiscounts` for manual discounts (`discount.source === 'manual'`).
3. Uses array spread syntax `[...]` to combine both lists.

#### Where used in the application
Called in `App.tsx` inside the `subscribeToPredefinedDiscounts` listener hook to keep customer discount lists up to date when Admin settings change.

---

### `syncActiveIds`

```ts
export function syncActiveIds(
  currentIds: string[],
  predefinedDiscounts: PredefinedDiscount[]
): string[] {
  const availableIds = getAvailableDiscounts(predefinedDiscounts).map(
    (discount) => discount.id
  )

  return currentIds.filter((id) => availableIds.includes(id))
}
```

#### What it does
Cleans up the array of active/toggled predefined discount IDs (`currentIds`) by dropping any ID that is no longer enabled by Admin.

#### Parameters
- **`currentIds: string[]`:** Array of currently active/toggled predefined discount IDs.
- **`predefinedDiscounts: PredefinedDiscount[]`:** Latest predefined discounts from API/storage.

#### Return value
- **`string[]`:** Array of active IDs containing only IDs that remain enabled by Admin.

#### How it works step by step
1. Extracts `availableIds` by calling `getAvailableDiscounts(predefinedDiscounts).map(d => d.id)`.
2. Filters `currentIds` using `.filter(id => availableIds.includes(id))`.
3. If an admin disables a discount while a customer has it toggled ON, its ID is removed from active state. If the admin later re-enables the discount, it starts in the OFF state until the customer toggles it ON again.

#### Where used in the application
Called in `App.tsx` inside `subscribeToPredefinedDiscounts`.

---

### `getAppliedDiscounts`

```ts
export function getAppliedDiscounts(
  discounts: Discount[],
  activeIds: string[]
): Discount[] {
  return discounts.filter(
    (discount) => discount.source === 'manual' || activeIds.includes(discount.id)
  )
}
```

#### What it does
Determines which discounts should actually be applied to cart price calculations in `SideCart.tsx`.

#### Parameters
- **`discounts: Discount[]`:** Current discounts list in state.
- **`activeIds: string[]`:** Array of active/toggled predefined discount IDs.

#### Return value
- **`Discount[]`:** Array of discounts currently applied to cart calculations.

#### How it works step by step
1. Filters `discounts` array.
2. Includes a discount if `discount.source === 'manual'` (manual discounts are always active without toggles) OR `activeIds.includes(discount.id)` (predefined discount is toggled ON).

#### Where used in the application
Called in `App.tsx` (`const appliedDiscounts = getAppliedDiscounts(discounts, activeDiscountIds)`) and passed as a prop into `<SideCart discounts={appliedDiscounts} />`.

---

### `removeDiscount`

```ts
export function removeDiscount(discounts: Discount[], id: string): Discount[] {
  return discounts.filter((discount) => discount.id !== id)
}
```

#### What it does
Removes a discount object with a specific `id` from a discount array.

#### Parameters
- **`discounts: Discount[]`:** Current discounts array.
- **`id: string`:** ID of discount to remove.

#### Return value
- **`Discount[]`:** New array with target discount removed.

#### How it works step by step
1. Executes `.filter((discount) => discount.id !== id)`.
2. Returns new array containing all discounts except the matching ID.

#### Where used in the application
Called in `DiscountList.tsx` when confirming deletion of a manual discount (`handleConfirmDelete`).
