# Utils (`src/utils/`)

## What this folder is for

The `src/utils/` directory contains pure, deterministic business logic, calculation routines, and array transformation functions for the Salesdock Discounts application.

By separating core mathematical calculations and array synchronization logic from React presentation components, the codebase achieves:
- **Clean Architecture:** Presentation components focus solely on JSX layout and UI events, delegating mathematical computations and data transformation to utility functions.
- **Pure Function Determinism:** Utility functions take explicit parameters and return calculated outputs without side effects or outside state mutation.
- **High Testability:** Calculation algorithms and synchronization rules can be tested in milliseconds using unit test runners (Vitest) without mounting React DOM elements.

---

## Files in `src/utils/`

| File | Responsibility |
|---|---|
| [`discountCalculator.ts`](./discountCalculator.md) | Pure math engine for single discounts, sequential compound discounts, and 12-month contract promotional period calculations. |
| [`discountCalculator.test.ts`](./discountCalculator.test.md) | Vitest test suite verifying single percentage, fixed euro, multi-discount sequential, and monthly duration calculations. |
| [`predefinedDiscounts.ts`](./predefinedDiscounts.md) | Data transformation utilities for array filtering, merging Admin predefined discounts with user manual discounts, and managing active toggle IDs. |
| [`predefinedDiscounts.test.ts`](./predefinedDiscounts.test.md) | Vitest test suite verifying Admin availability toggles, active ID dropping, manual discount preservation, and title renaming stability. |

---

## Actual Project Usage Table

| Utility File | Used By | Purpose |
|---|---|---|
| `discountCalculator.ts` | [`SideCart.tsx`](../components/discounts/SideCart.md) | Computes itemized one-time price deductions, net subtotal, and 12-month promotional vs remaining contract period totals. |
| `discountCalculator.ts` | [`DiscountList.tsx`](../components/discounts/DiscountList.md) | Computes live **New price** preview values formatted for the predefined discount edit modal. |
| `discountCalculator.ts` | `discountCalculator.test.ts` | Unit tests mathematical calculation logic. |
| `predefinedDiscounts.ts` | [`App.tsx`](../../src/App.tsx) | Synchronizes Admin-enabled predefined discounts with customer manual discounts, cleans active IDs, and selects applied cart discounts. |
| `predefinedDiscounts.ts` | [`DiscountList.tsx`](../components/discounts/DiscountList.md) | Calls `removeDiscount` when deleting manual discounts. |
| `predefinedDiscounts.ts` | `predefinedDiscounts.test.ts` | Unit tests array synchronization and filter logic. |

---

## Business Logic Flow

```text
Discount Data (Admin / Manual)
        ↓
predefinedDiscounts.ts (Sync & Active ID Filtering)
        ↓
Applied Discounts List
        ↓
discountCalculator.ts (Math Engine: calculateDiscountedPrice / calculateMonthlyTotals)
        ↓
Calculated Price Totals (One-time net & Monthly totals)
        ↓
SideCart.tsx / UI Component
        ↓
Displayed Prices (€ 750,00 / € 950,00)
```

---

## Utility Relationships

- **Types (`src/types/discount.ts`):** All utilities consume type contracts (`Discount`, `DiscountTarget`, `DiscountType`, `PredefinedDiscount`).
- **API (`src/api/discountsApi.ts`):** `App.tsx` passes discounts fetched from `discountsApi.ts` into `predefinedDiscounts.ts` utility functions.
- **SideCart (`SideCart.tsx`):** Consumes `calculateDiscountedPrice` and `calculateMonthlyTotals` to compute net prices.
- **DiscountList (`DiscountList.tsx`):** Uses percentage calculation formulas for live modal previews and calls `removeDiscount` on deletion.

---

## SideCart Connection & Price Calculations

### Complete Data Flow to SideCart

```text
Product baseline fixture (€1,000 one-time / €10 monthly)
        ↓
Applied discounts prop (from App.tsx via getAppliedDiscounts)
        ↓
SideCart.tsx filters by target ('one-time' vs 'monthly')
        ↓
utility: calculateDiscountedPrice (sequential compound deductions for one-time)
utility: calculateMonthlyTotals (promo duration vs remaining months for monthly)
        ↓
Formatted Dutch currency (e.g. € 750,00)
        ↓
Rendered SideCart JSX
```

### Function Responsibilities in SideCart
- **One-time Costs:** `SideCart.tsx` calls `calculateDiscountedPrice(runningPrice, discount)` in a loop for each applied one-time discount, updating `runningPrice` sequentially.
- **Monthly Costs:** `SideCart.tsx` calls `calculateMonthlyTotals(product.monthlyPrice, discount)` to compute initial promo duration cost (`discountedTotal`) and remaining contract cost (`remainingTotal`).

### Difference between One-time Price and Monthly Price
- **One-time Price:** The upfront purchase price of the product (€1,000 baseline). Deductions reduce the subtotal directly. One-time product price is **never** converted into monthly installments.
- **Monthly Price:** The recurring subscription fee (€10/mo baseline). Discounts apply for a specific duration of months (e.g. 25% off for 3 months).

---

## DiscountModal Connection

- **Which function it uses:** `DiscountList.tsx` uses percentage calculation math matching `calculateDiscountedPrice` to compute `newPrice`.
- **Input passed:** `PRODUCT_ONE_TIME_PRICE = 1000` and the numerical input `value` typed by the user.
- **Result obtained:** `newPrice = 1000 - (1000 * value / 100)`. Formatted as `€ 950,00` (at 5%) or `€ 960,00` (at 4%).
- **UI Location:** Displayed inside the read-only **New price** input field when editing a predefined discount.

---

## Business Logic Implemented by Utils

### Implemented Logic
1. **Percentage Discounts:** Deducts percentage of price: `price - (price * value) / 100`.
2. **Fixed Discounts:** Subtracts fixed euro amount: `price - value`.
3. **Sequential Compound Discounts:** Multiple discounts apply one after another on the running reduced price (`€1,000` $\rightarrow$ `10%` $\rightarrow$ `€900` $\rightarrow$ `€50 fixed` $\rightarrow$ `€850`).
4. **Monthly Promotional Term Math:** Computes promotional monthly price and calculates total for initial promo months (`durationMonths`) and remaining standard contract months (`12 - durationMonths`).
5. **Admin Availability Sync:** Admin-disabled discounts are filtered out; when a discount is disabled, its active toggle state is automatically dropped.
6. **Manual Discount Immunity:** User-created manual discounts are preserved regardless of Admin changes to predefined discounts.

### NOT Implemented (Out of Scope)
- **Additive Discount Compounding:** Discounts do NOT add percentages together before deduction.
- **Automated Expire Timers:** Expiration dates are not implemented.

---

## Edge Cases Handled by Current Implementation

- **Zero Discount (`value = 0`):** `calculateDiscountedPrice(1000, 0%)` returns `1000` without errors.
- **Zero / Missing Duration (`durationMonths` is 0 or undefined):** `calculateMonthlyTotals` uses `discount.durationMonths || 0`. `durationMonths` becomes `0`, `remainingMonths` becomes `12`, `discountedTotal` becomes `0`, and `remainingTotal` becomes `monthlyPrice * 12`.
- **Fixed Discount Greater Than Price (`value > price`):** `price - value` yields a negative number (e.g., `100 - 150 = -50`). `SideCart` and calculation utilities do not crash.
- **Percentage Over 100%:** Evaluates mathematically (e.g. `150%` off `100` yields `-50`). In `DiscountList.tsx`, UI max validation limits predefined discount editing to 5%.

---

## TypeScript Concepts Used in Utils

- **Typed Parameters & Return Types:** Explicit annotations (`price: number, discount: Discount): number`).
- **Literal Union Types:** `DiscountTarget` (`'one-time' | 'monthly'`), `DiscountType` (`'percentage' | 'fixed'`), `DiscountSource` (`'automatic' | 'manual'`).
- **Optional Properties (`durationMonths?: number`):** Handled via default fallbacks (`discount.durationMonths || 0`).
- **Object Destructuring Rest Syntax:** `const { enabled: _enabled, ...discount } = item` used in `getAvailableDiscounts` to strip properties cleanly.

---

## Interview Explanation

> "The `utils` directory contains pure, functional business logic separated from React UI components. `discountCalculator.ts` acts as our pure math engine—handling single percentage/fixed discounts, sequential compound discount application for multiple cart discounts, and 12-month promotional subscription math. `predefinedDiscounts.ts` manages data transformations—synchronizing Admin-enabled discounts with customer manual discounts and cleaning active toggle states. Separating this logic makes the code modular, reusable, and easy to unit test using Vitest in milliseconds without needing to render React DOM elements."
