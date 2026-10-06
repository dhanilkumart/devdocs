# discountCalculator.ts

## 1. What this file is for

### Why this file exists
`src/utils/discountCalculator.ts` is the central pricing calculation module for the application. It contains pure, deterministic mathematical functions that calculate price deductions for individual discounts, sequential compound reductions for multiple discounts, and promotional term totals for recurring monthly subscription discounts.

### What problem it solves
In e-commerce and checkout applications, discount calculation logic can easily become scattered across various UI views, resulting in code duplication, inconsistent rounding errors, and buggy state updates. `discountCalculator.ts` centralizes all discount calculation math into reusable pure functions.

### Which part of the application uses it
- **[`SideCart.tsx`](../components/discounts/SideCart.md):** Calls `calculateDiscountedPrice` and `calculateMonthlyTotals` to calculate net subtotals and promotional totals for the cart overview sidebar.
- **[`DiscountList.tsx`](../components/discounts/DiscountList.md):** Uses percentage deduction formulas to format live **New price** previews in the discount edit modal.
- **[`discountCalculator.test.ts`](./discountCalculator.test.md):** Runs automated Vitest unit tests against all calculation routines.

### Why this logic is kept here instead of directly inside a React component
- **Separation of Concerns:** Keeps presentation code (React JSX, layout, modal rendering) completely decoupled from calculation math.
- **Pure Functional Math:** These functions take arguments and return calculated numbers without modifying outside state (zero side effects).
- **Testability:** Can be tested in milliseconds using unit tests without needing a DOM renderer.

---

## 2. Imports

```ts
import type { Discount } from '../types/discount'
```

### Explanation
- **`type { Discount }` (Type-Only Import):** Imports the TypeScript `Discount` interface from `src/types/discount.ts`.
- **Why it is used:** Provides type safety for discount parameters passed into calculation functions (`target`, `type`, `value`, `durationMonths`).
- **TypeScript Concept:** `import type` is erased during compilation, generating zero JavaScript bundle overhead.

---

## 3. Main Code

---

### `calculateDiscountedPrice`

```ts
export function calculateDiscountedPrice(
    price: number,
    discount: Discount,
) : number {
    if (discount.type === 'percentage' ){

        const discountAmount = (price * discount.value) / 100
        return price - discountAmount
    }

    return price - discount.value
}
```

#### What it does
Calculates the final discounted price after applying a single discount (either percentage or fixed euro amount) to an initial price.

#### Parameters
- **`price: number`:** The original or starting price before discount application (e.g. `1000`).
- **`discount: Discount`:** A discount object containing `type` (`'percentage'` or `'fixed'`) and numeric `value`.

#### Return value
- **`number`:** The net discounted price after subtracting the discount amount.

#### Step-by-step execution

1. Evaluates `if (discount.type === 'percentage')`.
2. **If Percentage Discount:**
   - Computes `discountAmount = (price * discount.value) / 100`.
   - Returns `price - discountAmount`.
3. **If Fixed Discount:**
   - Skips the `if` block.
   - Subtracts `discount.value` directly from `price`: `return price - discount.value`.

#### Why it is needed
Serves as the foundation for all single discount deductions across the checkout experience.

#### Where it is used
- Called inside `calculatePriceWithDiscounts` for sequential multiple discounts.
- Called inside `calculateMonthlyTotals` for monthly discount reductions.
- Called in `SideCart.tsx` to compute itemized line item deductions.

#### Detailed Price Calculation Mechanics

##### Percentage Discount Logic

When `discount.type` is `'percentage'`:
- **Formula:** `discountAmount = (price * discount.value) / 100`
- **Final Price Formula:** `finalPrice = price - discountAmount`

**Concrete Example 1: €1,000 with 3% discount**
```text
price = 1000
discount = { type: 'percentage', value: 3 }

1. discountAmount = (1000 * 3) / 100 = 3000 / 100 = 30
2. finalPrice = 1000 - 30 = 970
Result = 970 (€ 970,00)
```

**Concrete Example 2: €1,000 with 5% discount**
```text
price = 1000
discount = { type: 'percentage', value: 5 }

1. discountAmount = (1000 * 5) / 100 = 5000 / 100 = 50
2. finalPrice = 1000 - 50 = 950
Result = 950 (€ 950,00)
```

##### Fixed Discount Logic

When `discount.type` is `'fixed'`:
- **Formula:** `finalPrice = price - discount.value`

**Concrete Example 3: €1,000 with €250 fixed discount**
```text
price = 1000
discount = { type: 'fixed', value: 250 }

finalPrice = 1000 - 250 = 750
Result = 750 (€ 750,00)
```

---

### `calculatePriceWithDiscounts`

```ts
export function calculatePriceWithDiscounts(
  price: number,
  discounts: Discount[]
): number {
  let discountedPrice = price

  discounts.forEach((discount) => {
    discountedPrice = calculateDiscountedPrice(discountedPrice, discount)
  })

  return discountedPrice
}
```

#### What it does
Applies an array of discounts **sequentially** (one after another) to an initial price, returning the final compound discounted price.

#### Parameters
- **`price: number`:** The starting base price (e.g. `1000`).
- **`discounts: Discount[]`:** An array of discounts to apply sequentially.

#### Return value
- **`number`:** The final net price after all discounts have been applied sequentially.

#### How it works step by step

1. **Starting price:** Initializes local variable `discountedPrice` with the initial `price`.
2. **Sequential Loop:** Iterates through `discounts` using `.forEach()`.
3. **Compound Reassignment:** For each discount in the array, it calls `calculateDiscountedPrice(discountedPrice, discount)` using the **current accumulator value** `discountedPrice` as input, and reassigns `discountedPrice` to the result.
4. **Final Return:** Returns the final accumulated `discountedPrice`.

#### What `discountedPrice` represents
`discountedPrice` represents the running, intermediate price after each discount in the array has taken effect.

#### Sequential Discount Application Explained

The implementation applies discounts **sequentially** (compound calculation), NOT additively.

For example, applying a **10% percentage discount** followed by a **5% percentage discount** on a **€1,000 baseline price**:

```text
Starting price = 1000

Pass 1 (10% discount):
  discountAmount = (1000 * 10) / 100 = 100
  discountedPrice = 1000 - 100 = 900

Pass 2 (5% discount):
  discountAmount = (900 * 5) / 100 = 45
  discountedPrice = 900 - 45 = 855

Final Returned Value = 855
```

**Sequential Compound Deduction vs Additive Deduction:**
- **Sequential (Implemented):** €1,000 $\rightarrow$ €900 $\rightarrow$ €855.
- **Additive (NOT Implemented):** (10% + 5% = 15% off €1,000 $\rightarrow$ €850).

#### Concrete Example from Test Suite: 10% percentage discount followed by €50 fixed discount
```text
Starting price = 1000

Pass 1 (10% discount):
  discountedPrice = calculateDiscountedPrice(1000, 10%) = 900

Pass 2 (€50 fixed discount):
  discountedPrice = calculateDiscountedPrice(900, 50) = 850

Final Result = 850
```

---

### `calculateMonthlyTotals`

```ts
export function calculateMonthlyTotals(
  monthlyPrice: number,
  discount: Discount
): {
  discountedTotal: number
  remainingTotal: number
} {
  const discountedMonthlyPrice = calculateDiscountedPrice(
    monthlyPrice,
    discount
  )

  const durationMonths = discount.durationMonths || 0
  const remainingMonths = 12 - durationMonths

  const discountedTotal = discountedMonthlyPrice * durationMonths
  const remainingTotal = monthlyPrice * remainingMonths

  return {
    discountedTotal,
    remainingTotal,
  }
}
```

#### What it does
Calculates total costs for a recurring monthly price under a promotional discount over a standard 12-month annual contract period.

#### Parameters
- **`monthlyPrice: number`:** The baseline monthly recurring subscription price (e.g. `10`).
- **`discount: Discount`:** A monthly discount object containing `type`, `value`, and optional `durationMonths`.

#### Return value
An object containing:
- **`discountedTotal: number`:** Total cost paid during the initial promotional discount months.
- **`remainingTotal: number`:** Total cost paid during the remaining standard contract months.

#### How it works step by step

1. **Calculate Reduced Monthly Price:** Calls `calculateDiscountedPrice(monthlyPrice, discount)` to get `discountedMonthlyPrice`.
2. **Determine Duration:** Extracts `durationMonths = discount.durationMonths || 0`. If `durationMonths` is missing or `undefined`, it defaults to `0`.
3. **Calculate Remaining Months:** Computes `remainingMonths = 12 - durationMonths` (based on standard 12-month contract).
4. **Calculate First-Period Total:** `discountedTotal = discountedMonthlyPrice * durationMonths`.
5. **Calculate Remaining-Period Total:** `remainingTotal = monthlyPrice * remainingMonths`.
6. **Return Result Object:** Returns `{ discountedTotal, remainingTotal }`.

#### Concrete Assignment Scenario Walkthrough

- **Baseline Monthly Price:** €10 (`monthlyPrice = 10`)
- **Discount:** 25% off for 3 months (`discount = { type: 'percentage', value: 25, durationMonths: 3 }`)

```text
1. discountedMonthlyPrice = calculateDiscountedPrice(10, 25%) 
                          = 10 - (10 * 25 / 100) 
                          = 10 - 2.50 
                          = 7.50 (€7.50/month)

2. durationMonths = 3
3. remainingMonths = 12 - 3 = 9

4. discountedTotal = 7.50 * 3 = 22.50 (€22.50 for first 3 months)
5. remainingTotal = 10.00 * 9 = 90.00 (€90.00 for remaining 9 months)

Result Object:
{
  discountedTotal: 22.5,
  remainingTotal: 90
}
```

#### Handling Missing or Zero `durationMonths`

According to the actual implementation:
- `const durationMonths = discount.durationMonths || 0`
- If `durationMonths` is `undefined`, `null`, or `0`:
  - `durationMonths` evaluates to `0`.
  - `remainingMonths` evaluates to `12 - 0 = 12`.
  - `discountedTotal` evaluates to `discountedMonthlyPrice * 0 = 0`.
  - `remainingTotal` evaluates to `monthlyPrice * 12`.
