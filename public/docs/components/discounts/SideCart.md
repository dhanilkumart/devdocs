# SideCart.tsx

## 1. Overview & Responsibilities

`SideCart.tsx` is the checkout summary sidebar component displayed on the right side of the main layout (`App.tsx`).

### Responsibilities:
- Holds fixed product baseline fixture data (`name: 'Webasto Pure II laadpaal type 2'`, `oneTimePrice: 1000`, `monthlyPrice: 10`).
- Filters applied discounts into `one-time` and `monthly` targets.
- Invokes calculation utility functions (`calculateDiscountedPrice`, `calculateMonthlyTotals`) to compute net prices.
- Renders itemized deduction lines for one-time discounts.
- Renders promotional period totals vs remaining contract period totals for monthly discounts.
- Formats currency output values using Dutch locale formatting (`€ 1.000,00`).

---

## 2. Baseline Fixtures & Helpers

```tsx
import type { Discount } from '../../types/discount'
import {
  calculateDiscountedPrice,
  calculateMonthlyTotals,
} from '../../utils/discountCalculator'

interface SideCartProps {
  discounts: Discount[]
}

const product = {
  name: 'Webasto Pure II laadpaal type 2',
  oneTimePrice: 1000,
  monthlyPrice: 10,
}

const formatPrice = (amount: number) =>
  `€ ${new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`
```

### What this code does
Declares product baseline fixture object (`product`), currency formatter (`formatPrice`), and imports math calculation functions.

---

## 3. Discount Filtering & Price Calculation

```tsx
export function SideCart({ discounts }: SideCartProps) {
  const oneTimeDiscounts = discounts.filter(
    (discount) => discount.target === 'one-time'
  )
  const monthlyDiscounts = discounts.filter(
    (discount) => discount.target === 'monthly'
  )

  const monthlyDiscountTotals = monthlyDiscounts.map((discount) => ({
    discount,
    discountedMonthlyPrice: calculateDiscountedPrice(
      product.monthlyPrice,
      discount
    ),
    totals: calculateMonthlyTotals(product.monthlyPrice, discount),
  }))

  let runningPrice = product.oneTimePrice
  const oneTimeLines = oneTimeDiscounts.map((discount) => {
    const discountedPrice = calculateDiscountedPrice(runningPrice, discount)
    const amount = runningPrice - discountedPrice
    runningPrice = discountedPrice
    return { id: discount.id, name: discount.name, amount }
  })
```

### How it works
1. **Filtering:** Separates `discounts` prop into `oneTimeDiscounts` and `monthlyDiscounts`.
2. **Monthly Calculations:** Maps `monthlyDiscounts` to calculate reduced monthly subscription fee and total amounts for initial promo months (`discountedTotal`) vs remaining standard contract months (`remainingTotal`).
3. **Sequential One-Time Deductions:** Iterates through `oneTimeDiscounts` using `runningPrice` to apply compound discount deductions sequentially.

---

## 4. Sidebar JSX Rendering

```tsx
  return (
    <aside className="side-cart">
      <div className="side-cart-image">
        <svg viewBox="0 0 40 70" width="40" height="70" aria-hidden="true">
          <rect x="12" y="2" width="16" height="26" rx="4" fill="#2b2f38" />
          <rect x="17" y="8" width="6" height="3" fill="#27b3c7" />
          <path d="M20 28 C20 50 8 46 8 66" fill="none" stroke="#2b2f38" strokeWidth="2" />
        </svg>
      </div>

      <h2>Overview</h2>

      <div className="side-cart-line">
        <span>{product.name}</span>
        <span>{formatPrice(product.oneTimePrice)}</span>
      </div>

      <div className="side-cart-line is-italic">
        <span>Maandelijkse prijs</span>
        <span>{formatPrice(product.monthlyPrice)}</span>
      </div>

      {monthlyDiscountTotals.map(
        ({ discount, discountedMonthlyPrice, totals }) => (
          <div key={discount.id}>
            <div className="side-cart-line is-italic">
              <span>{discount.name} ({discount.durationMonths} months)</span>
              <span>{formatPrice(discountedMonthlyPrice)}</span>
            </div>

            <div className="side-cart-line is-italic">
              <span>First {discount.durationMonths} months</span>
              <span>{formatPrice(totals.discountedTotal)}</span>
            </div>

            <div className="side-cart-line is-italic">
              <span>Remaining {12 - (discount.durationMonths || 0)} months</span>
              <span>{formatPrice(totals.remainingTotal)}</span>
            </div>
          </div>
        )
      )}

      <button type="button" className="side-cart-edit">Edit</button>

      <div className="side-cart-summary side-cart-summary-monthly">
        <div className="side-cart-line is-bold">
          <span>Eventually per month excl. btw</span>
          <span>{formatPrice(product.monthlyPrice)}</span>
        </div>
      </div>

      <div className="side-cart-summary side-cart-summary-onetime">
        <div className="side-cart-line">
          <span>Subtotal onetime costs excl. btw</span>
          <span>{formatPrice(product.oneTimePrice)}</span>
        </div>

        {oneTimeLines.map((line) => (
          <div key={line.id} className="side-cart-line is-italic">
            <span>{line.name}</span>
            <span>- {formatPrice(line.amount)}</span>
          </div>
        ))}

        <div className="side-cart-line is-bold">
          <span>Onetime costs excl. btw</span>
          <span>{formatPrice(runningPrice)}</span>
        </div>
      </div>
    </aside>
  )
}
```

### How it connects to other components
- **`App.tsx`:** Passes filtered `appliedDiscounts` to `SideCart`.
- **`discountCalculator.ts`:** Executes mathematical calculation functions (`calculateDiscountedPrice`, `calculateMonthlyTotals`).
