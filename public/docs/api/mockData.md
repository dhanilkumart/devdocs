# mockData.ts

## 1. What this file is for

### What `mockData.ts` contains
`src/api/mockData.ts` contains the TypeScript interface definition `PredefinedDiscount` and the initial array `predefinedDiscounts` of three pre-configured automatic discount seed objects.

### Why this file exists
In a real production environment, predefined discounts are stored in a database server and fetched over a network API. For this front-end assignment, `mockData.ts` serves as the initial seed dataset for the application.

### Why seed data is needed
Seed data provides initial records so developers and evaluators can immediately test and demonstrate the discount system—including enabling/disabling automatic discounts on the Admin page, editing discount values, and calculating cart totals—without manually creating data from scratch.

### Relationship to `discountsApi.ts`
- `discountsApi.ts` imports `predefinedDiscounts` and `PredefinedDiscount` from `mockData.ts`.
- When `discountsApi.ts` runs for the first time and finds no saved data in browser `localStorage`, it falls back to using `predefinedDiscounts` as the initial baseline dataset.

### Execution characteristics
- `mockData.ts` is purely a static data declaration and TypeScript type definition file.
- It contains no function calls, side effects, API endpoints, network requests, or dynamic state updates.

---

## 2. Imports and Interface Definition

```ts
import type { Discount } from '../types/discount'

export interface PredefinedDiscount extends Discount {
  enabled: boolean
}
```

### Explanation of imports

1. **`type { Discount }` (Type-Only Import)**
   - **What it is:** The base TypeScript `Discount` interface imported from `src/types/discount.ts`.
   - **Where it comes from:** `../types/discount`.
   - **Why it is needed:** Defines the standard structure for all discounts in the system (`id`, `name`, `source`, `target`, `type`, `value`, `durationMonths`, `description`).
   - **Type vs Value:** This is a type-only import (`import type`), meaning TypeScript strips it during compilation so zero JavaScript code is generated.

### Explanation of `PredefinedDiscount` Interface

- **What it is:** An interface extending the base `Discount` type.
- **Added Property (`enabled: boolean`):** Predefined automatic discounts include an `enabled` boolean flag controlled by administrators.
- **Why it is needed:** Allows the Admin panel (`AdminPage.tsx`) to toggle whether an automatic discount is currently available to customers without deleting the discount definition.

---

## 3. Predefined Discount Data Structure

```ts
export const predefinedDiscounts: PredefinedDiscount[] = [
  {
    id: 'predefined-1',
    name: 'Discount name',
    source: 'automatic',
    target: 'one-time',
    type: 'fixed',
    value: 250,
    description: 'Sample discount',
    enabled: true,
  },
  {
    id: 'predefined-2',
    name: 'Discount name',
    source: 'automatic',
    target: 'one-time',
    type: 'percentage',
    value: 5,
    description: 'Sample discount',
    enabled: false,
  },
  {
    id: 'predefined-3',
    name: 'Discount name',
    source: 'automatic',
    target: 'monthly',
    type: 'percentage',
    value: 25,
    durationMonths: 3,
    description: 'Sample discount',
    enabled: false,
  },
]
```

### Property Explanation

Every `PredefinedDiscount` object in `predefinedDiscounts` includes the following properties:

1. **`id: string`**
   - **Meaning:** Unique string identifier (e.g. `'predefined-1'`).
   - **Why needed:** Uniquely identifies each discount for React rendering (`key`), state tracking (`activeDiscountIds`), and API storage queries.
   - **Where used:** Used in `discountsApi.ts`, `App.tsx`, `AdminPage.tsx`, `DiscountList.tsx`, `DiscountRow.tsx`, and unit tests.

2. **`name: string`**
   - **Meaning:** Human-readable display label for the discount (e.g. `'Discount name'`).
   - **Why needed:** Displays the title of the discount in administrative and customer UI views.
   - **Where used:** Rendered in `AdminPage.tsx`, `DiscountRow.tsx`, `DiscountModal.tsx`, and `SideCart.tsx`. Editable via Admin or Modal.

3. **`source: DiscountSource`**
   - **Meaning:** Discriminator string with literal type `'automatic' | 'manual'`. For all items in `mockData.ts`, this is set to `'automatic'`.
   - **Why needed:** Distinguishes predefined system-wide discounts (`'automatic'`) from user-created manual discounts (`'manual'`).
   - **Where used:** Evaluated in `DiscountRow.tsx` (to render toggle vs edit/delete buttons) and `predefinedDiscounts.ts` (for synchronization logic).

4. **`target: DiscountTarget`**
   - **Meaning:** Literal type `'one-time' | 'monthly'`.
   - **Why needed:** Specifies whether the discount reduces the product's upfront one-time price or recurring monthly price.
   - **Where used:** Used in `discountCalculator.ts` and `SideCart.tsx` to group and apply discounts to the correct price total.

5. **`type: DiscountType`**
   - **Meaning:** Literal type `'fixed' | 'percentage'`.
   - **Why needed:** Defines how the discount deduction is calculated (direct euro subtraction vs percentage reduction).
   - **Where used:** Used in `discountCalculator.ts` (`calculateDiscountedPrice`) and rendered in `DiscountRow.tsx` and `AdminPage.tsx`.

6. **`value: number`**
   - **Meaning:** Numerical value of the discount (e.g. `250` for €250 off, or `5` for 5% off).
   - **Why needed:** Stores the mathematical magnitude of the discount.
   - **Where used:** Used in `discountCalculator.ts` to compute discounted prices and rendered in UI components.

7. **`durationMonths?: number`**
   - **Meaning:** Optional number property indicating how many months a monthly discount remains active.
   - **Why needed:** Required for monthly recurring discounts with limited term durations (e.g. 3 months).
   - **Where used:** Evaluated in `discountCalculator.ts` (`calculateMonthlyTotals`) and displayed in `DiscountRow.tsx` and `SideCart.tsx`.

8. **`description: string`**
   - **Meaning:** Descriptive notes or details about the discount (e.g. `'Sample discount'`).
   - **Why needed:** Holds supplementary information about the discount offer.
   - **Where used:** Populated in forms and modal inputs.

9. **`enabled: boolean`**
   - **Meaning:** Boolean flag indicating whether an automatic discount is active/enabled (`true`) or inactive/disabled (`false`).
   - **Why needed:** Allows administrators to toggle automatic discount availability on or off.
   - **Where used:** Evaluated by `getAvailableDiscounts()` in `predefinedDiscounts.ts` and toggled in `AdminPage.tsx`.

---

## 4. Detailed Explanation of Each Predefined Discount

### Predefined Discount 1

```ts
{
  id: 'predefined-1',
  name: 'Discount name',
  source: 'automatic',
  target: 'one-time',
  type: 'fixed',
  value: 250,
  description: 'Sample discount',
  enabled: true,
}
```

- **ID:** `'predefined-1'`
- **Target Price:** One-time upfront price.
- **Discount Mechanism:** Fixed euro deduction of €250 (`type: 'fixed'`, `value: 250`).
- **Default Status:** Enabled by default (`enabled: true`).
- **Behavior:** When active, subtracts €250 directly from the baseline product one-time price (€1,000 $\rightarrow$ €750).

---

### Predefined Discount 2

```ts
{
  id: 'predefined-2',
  name: 'Discount name',
  source: 'automatic',
  target: 'one-time',
  type: 'percentage',
  value: 5,
  description: 'Sample discount',
  enabled: false,
}
```

- **ID:** `'predefined-2'`
- **Target Price:** One-time upfront price.
- **Discount Mechanism:** Percentage reduction of 5% (`type: 'percentage'`, `value: 5`).
- **Default Status:** Disabled by default (`enabled: false`).
- **Behavior:** This is the primary editable predefined automatic discount in the customer Discounts page. Users can click its pencil icon to open the edit modal, view the calculated **New price** (`€ 950,00`), and edit its value up to the 5% maximum limit.

---

### Predefined Discount 3

```ts
{
  id: 'predefined-3',
  name: 'Discount name',
  source: 'automatic',
  target: 'monthly',
  type: 'percentage',
  value: 25,
  durationMonths: 3,
  description: 'Sample discount',
  enabled: false,
}
```

- **ID:** `'predefined-3'`
- **Target Price:** Recurring monthly price.
- **Discount Mechanism:** Percentage reduction of 25% for a duration of 3 months (`durationMonths: 3`).
- **Default Status:** Disabled by default (`enabled: false`).
- **Behavior:** Demonstrates limited-duration monthly discount math. When active, it reduces the baseline monthly price (€10/mo $\rightarrow$ €7.50/mo) for the first 3 months and calculates initial 3-month vs remaining 9-month contract totals in `SideCart.tsx`.
