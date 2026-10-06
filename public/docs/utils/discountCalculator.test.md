# discountCalculator.test.ts

## 1. What this file is for

### Why this file exists
`src/utils/discountCalculator.test.ts` is an automated unit test file for `src/utils/discountCalculator.ts`. It verifies that percentage discounts, fixed discounts, sequential multiple discounts, and monthly promotional totals calculate mathematically correct results.

### What framework is used
Built with **Vitest**, utilizing standard test suite primitives (`describe`, `it`, `expect`).

---

## 2. Imports

```ts
import { describe, expect, it } from 'vitest'
import { calculateDiscountedPrice, calculatePriceWithDiscounts, calculateMonthlyTotals } from './discountCalculator'
```

### Explanation
- **`describe`:** Vitest function that creates a logical group/suite of related test cases.
- **`it`:** Vitest function that defines an individual test case.
- **`expect`:** Vitest assertion function that checks if a computed result matches an expected value.
- **`calculateDiscountedPrice`, `calculatePriceWithDiscounts`, `calculateMonthlyTotals`:** Target mathematical calculation functions imported from `./discountCalculator`.

---

## 3. Comprehensive Test Case Documentation

---

### Test 1: `should calculate percentage discount correctly`

```ts
  it('should calculate percentage discount correctly', () => {
    const discount = {
      id: '1',
      name: 'Test discount',
      source: 'manual' as const,
      target: 'one-time' as const,
      type: 'percentage' as const,
      value: 10,
      description: '10% discount',
    }

    const result = calculateDiscountedPrice(1000, discount)

    expect(result).toBe(900)
  })
```

#### What is being tested
Verifies that `calculateDiscountedPrice` correctly calculates a percentage discount (10% off €1,000).

#### Input
- `price`: `1000`
- `discount`: `{ type: 'percentage', value: 10 }`

#### Expected Result
- `900` (€ 900,00)

#### Step-by-step execution
1. Defines discount object with `type: 'percentage'` and `value: 10`.
2. Calls `calculateDiscountedPrice(1000, discount)`.
3. Inside function: `discountAmount = (1000 * 10) / 100 = 100`. Net price = `1000 - 100 = 900`.
4. `expect(result).toBe(900)` asserts that `900 === 900`.

#### Why this test is important
Ensures percentage calculation logic correctly reduces baseline prices without rounding errors.

---

### Test 2: `should calculate fixed discount correctly`

```ts
  it('should calculate fixed discount correctly', () => {
    const discount = {
      id: '2',
      name: 'Test discount',
      source: 'manual' as const,
      target: 'one-time' as const,
      type: 'fixed' as const,
      value: 100,
      description: '€100 discount',
    }

    const result = calculateDiscountedPrice(1000, discount)

    expect(result).toBe(900)
  })
```

#### What is being tested
Verifies that `calculateDiscountedPrice` correctly subtracts a fixed euro discount (€100 off €1,000).

#### Input
- `price`: `1000`
- `discount`: `{ type: 'fixed', value: 100 }`

#### Expected Result
- `900` (€ 900,00)

#### Step-by-step execution
1. Defines discount object with `type: 'fixed'` and `value: 100`.
2. Calls `calculateDiscountedPrice(1000, discount)`.
3. Inside function: returns `1000 - 100 = 900`.
4. `expect(result).toBe(900)` asserts equality.

#### Why this test is important
Ensures fixed amount deductions directly subtract the euro value from the price.

---

### Test 3: `should apply multiple discounts one after another`

```ts
  it('should apply multiple discounts one after another', () => {
    const discounts = [
      {
        id: '1',
        name: 'Percentage discount',
        source: 'manual' as const,
        target: 'one-time' as const,
        type: 'percentage' as const,
        value: 10,
        description: '10% discount',
      },
      {
        id: '2',
        name: 'Fixed discount',
        source: 'manual' as const,
        target: 'one-time' as const,
        type: 'fixed' as const,
        value: 50,
        description: '€50 discount',
      },
    ]

    const result = calculatePriceWithDiscounts(1000, discounts)

    expect(result).toBe(850)
  })
```

#### What is being tested
Verifies that `calculatePriceWithDiscounts` applies multiple discounts **sequentially** (compound deduction).

#### Input
- `price`: `1000`
- `discounts`: Array containing 10% percentage discount followed by €50 fixed discount.

#### Expected Result
- `850` (€ 850,00)

#### Step-by-step execution
1. `discountedPrice` starts at `1000`.
2. Pass 1 (10% discount): `calculateDiscountedPrice(1000, 10%) = 900`.
3. Pass 2 (€50 fixed discount): `calculateDiscountedPrice(900, 50) = 850`.
4. Returns `850`.
5. `expect(result).toBe(850)` asserts equality.

#### Why this test is important
Proves that multiple active discounts are calculated sequentially rather than additively.

---

### Test 4: `should calculate monthly totals for a limited discount duration`

```ts
  it('should calculate monthly totals for a limited discount duration', () => {
    const discount = {
      id: '3',
      name: 'Monthly discount',
      source: 'manual' as const,
      target: 'monthly' as const,
      type: 'percentage' as const,
      value: 20,
      durationMonths: 3,
      description: '20% monthly discount for 3 months',
    }

    const result = calculateMonthlyTotals(100, discount)

    expect(result.discountedTotal).toBe(240)
    expect(result.remainingTotal).toBe(900)
  })
```

#### What is being tested
Verifies `calculateMonthlyTotals` for a monthly discount with limited term duration (20% off €100/mo for 3 months).

#### Input
- `monthlyPrice`: `100`
- `discount`: `{ type: 'percentage', value: 20, durationMonths: 3 }`

#### Expected Result
- `discountedTotal`: `240` (€ 240,00 for first 3 months)
- `remainingTotal`: `900` (€ 900,00 for remaining 9 months)

#### Step-by-step execution
1. `discountedMonthlyPrice` = `100 - (100 * 20 / 100) = 80`.
2. `durationMonths = 3`.
3. `remainingMonths = 12 - 3 = 9`.
4. `discountedTotal = 80 * 3 = 240`.
5. `remainingTotal = 100 * 9 = 900`.
6. `expect(result.discountedTotal).toBe(240)` and `expect(result.remainingTotal).toBe(900)`.

#### Why this test is important
Guarantees accurate financial projections for promotional subscription pricing.
