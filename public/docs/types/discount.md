# discount.ts

## 1. What this file is for

### Why this file exists
`src/types/discount.ts` is the central type definition file for the discount domain in the application. It defines the core data contracts, literal union types, and interface definitions that describe discounts, product pricing, and calculation results.

### What type definitions it contains
- **Literal Union Types:**
  - `DiscountTarget` (`'one-time' | 'monthly'`)
  - `DiscountType` (`'percentage' | 'fixed'`)
  - `DiscountSource` (`'automatic' | 'manual'`)
- **Interfaces:**
  - `Discount` (Base discount object shape)
  - `ProductPrice` (Product price structure)
  - `DiscountResult` (Calculated output price structure)

### Why these types are separated from components
Separating types into a dedicated `types/` folder enforces clean software architecture:
- **Single Source of Truth:** Every component, utility function, and API service uses the exact same interface definitions.
- **Decoupling:** Presentation components (like `DiscountRow.tsx`) do not own data types, preventing circular dependencies.
- **Compile-Time Type Safety:** Ensures that invalid targets (e.g. `'yearly'`) or types (e.g. `'cash'`) are caught at build time by the TypeScript compiler.

### Which parts of the application use these types
These types are imported and consumed across the entire codebase:
- **API Layer:** `mockData.ts`, `discountsApi.ts`
- **React Components:** `App.tsx`, `AdminPage.tsx`, `DiscountList.tsx`, `DiscountRow.tsx`, `DiscountModal.tsx`, `SideCart.tsx`
- **Utilities:** `discountCalculator.ts`, `predefinedDiscounts.ts`
- **Test Suites:** `discountCalculator.test.ts`, `predefinedDiscounts.test.ts`, `SideCart.test.tsx`, `EditablePredefinedDiscount.test.tsx`

---

## 2. Imports

`src/types/discount.ts` contains **no import statements**.

### Explanation
It is a self-contained domain model file that relies entirely on TypeScript built-in primitive types (`string`, `number`, `boolean`).

---

## 3. DiscountTarget

```ts
export type DiscountTarget = 'one-time' | 'monthly'
```

### Explanation

- **What it is:** A TypeScript string literal union type.
- **Allowed values:**
  - `'one-time'`: Indicates that the discount applies to the product's upfront one-time price.
  - `'monthly'`: Indicates that the discount applies to the product's recurring monthly price.
- **Why it is needed:** Controls which price component is reduced during calculation and determines where the discount appears in `SideCart.tsx` (Subtotal one-time costs vs Monthly breakdown).
- **Where used:** Used in `Discount` interface, `DiscountModal.tsx` (segmented control toggle), `discountCalculator.ts`, and `SideCart.tsx`.

---

## 4. DiscountType

```ts
export type DiscountType = 'percentage' | 'fixed'
```

### Explanation

- **What it is:** A TypeScript string literal union type.
- **Allowed values:**
  - `'percentage'`: The discount `value` represents a percentage reduction (e.g. `5` for 5% off).
  - `'fixed'`: The discount `value` represents a direct fixed euro reduction (e.g. `250` for €250 off).
- **Why it is needed:** Instructs `calculateDiscountedPrice()` in `discountCalculator.ts` which mathematical formula to execute:
  - Percentage: `price - (price * value) / 100`
  - Fixed: `price - value`
- **Where used:** Used in `Discount` interface, `DiscountModal.tsx` (dropdown select), `DiscountRow.tsx`, `AdminPage.tsx`, and `discountCalculator.ts`.

---

## 5. DiscountSource

```ts
export type DiscountSource = 'automatic' | 'manual'
```

### Explanation

- **What it is:** A TypeScript string literal union type.
- **Allowed values:**
  - `'automatic'`: Predefined system discounts created and managed via Admin.
  - `'manual'`: Custom discounts added on-the-fly by users during checkout.
- **Why it is needed:** Distinguishes predefined automatic discounts from user-created manual discounts.
- **Where used:** 
  - `DiscountRow.tsx`: Evaluates `source === 'manual'` to render edit/delete action buttons instead of the Admin availability toggle switch.
  - `predefinedDiscounts.ts`: `syncDiscounts()` preserves manual discounts when updating predefined discounts from Admin.

---

## 6. Discount Interface

```ts
export interface Discount {
  id: string
  name: string
  source: DiscountSource
  target: DiscountTarget
  type: DiscountType
  value: number
  durationMonths?: number
  description: string
}
```

### Explanation of Properties

1. **`id: string`**
   - **Meaning:** Unique string identifier for the discount (e.g. `'predefined-1'`, `'discount-1710000000000'`).
   - **Why needed:** Used as React `key` prop and state tracking identifier.

2. **`name: string`**
   - **Meaning:** Display title of the discount (e.g. `'Discount name'`).
   - **Why needed:** Renders the discount label in UI rows and summary breakdowns.

3. **`source: DiscountSource`**
   - **Meaning:** Origin discriminator (`'automatic'` vs `'manual'`).
   - **Why needed:** Controls UI actions and synchronization behavior.

4. **`target: DiscountTarget`**
   - **Meaning:** Price target discriminator (`'one-time'` vs `'monthly'`).
   - **Why needed:** Directs calculations to upfront or recurring prices.

5. **`type: DiscountType`**
   - **Meaning:** Calculation mode discriminator (`'percentage'` vs `'fixed'`).
   - **Why needed:** Determines calculation math formula and currency/percentage symbol formatting.

6. **`value: number`**
   - **Meaning:** Numerical magnitude of the discount.
   - **Why needed:** Supplies the number used in price reduction calculations.

7. **`durationMonths?: number`**
   - **Meaning:** Optional property for monthly discounts indicating how many months the discount applies.
   - **Why needed:** Required for limited-term monthly promotional discounts (e.g. 25% off for 3 months).

8. **`description: string`**
   - **Meaning:** Descriptive notes or explanation of the discount.
   - **Why needed:** Populated in creation/editing forms.

---

## 7. ProductPrice Interface

```ts
export interface ProductPrice {
  oneTime: number
  monthly: number
}
```

### Explanation

- **What it is:** An interface representing the baseline pricing structure of a product.
- **Properties:**
  - `oneTime: number`: Upfront purchase price in euros (e.g. `1000`).
  - `monthly: number`: Recurring monthly subscription price in euros (e.g. `10`).
- **Why it is needed:** Defines a standardized contract for product price inputs in calculation utility functions.

---

## 8. DiscountResult Interface

```ts
export interface DiscountResult {
  oneTime: number
  monthly: number
  monthlyDiscountedTotal: number
  monthlyRemainingTotal: number
}
```

### Explanation

- **What it is:** An interface representing the computed price results output by calculation utilities.
- **Properties:**
  - `oneTime: number`: Final discounted one-time upfront cost.
  - `monthly: number`: Final discounted monthly cost.
  - `monthlyDiscountedTotal: number`: Total cost paid during the initial promotional discount months.
  - `monthlyRemainingTotal: number`: Total cost paid during the remaining standard contract months.
- **Why it is needed:** Defines the return type shape for full cart discount calculation routines.
