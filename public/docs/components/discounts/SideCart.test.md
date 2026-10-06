# SideCart.test.tsx

## 1. Overview & Test Suite Purpose

`SideCart.test.tsx` is an automated component test file for `SideCart.tsx` using **Vitest** and Server-Side Rendering static markup generator (`renderToStaticMarkup` from `'react-dom/server'`).

### What it tests:
1. Verifies that `SideCart` displays the full baseline one-time price (€1.000,00) when no discounts are applied.
2. Verifies that applied discounts correctly update the net one-time total (€750,00).
3. Verifies that renaming an applied discount immediately updates the rendered title in the cart summary.

---

## 2. Test Setup & Fixture Data

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Discount } from '../../types/discount'
import { SideCart } from './SideCart'

const discount: Discount = {
  id: 'predefined-1',
  name: 'Discount A',
  source: 'automatic',
  target: 'one-time',
  type: 'fixed',
  value: 250,
  description: '',
}
```

### What this code does
Imports static markup renderer, Vitest test utilities, `Discount` type, `SideCart` component, and defines a test fixture object (`discount`).

---

## 3. Test Cases

```tsx
describe('SideCart', () => {
  it('shows the full one-time price without discounts', () => {
    const html = renderToStaticMarkup(<SideCart discounts={[]} />)

    expect(html).not.toContain('Discount A')
    expect(html).toContain('€ 1.000,00')
  })

  it('reflects an applied discount in the total', () => {
    const html = renderToStaticMarkup(<SideCart discounts={[discount]} />)

    expect(html).toContain('Discount A')
    expect(html).toContain('€ 750,00')
  })

  it('shows the updated name of an applied discount', () => {
    const html = renderToStaticMarkup(
      <SideCart discounts={[{ ...discount, name: 'Summer Special Discount' }]} />
    )

    expect(html).toContain('Summer Special Discount')
    expect(html).not.toContain('Discount A')
  })
})
```

### How it works
- **Test 1:** Renders `<SideCart discounts={[]} />` and asserts baseline price `€ 1.000,00` is displayed without discount labels.
- **Test 2:** Renders `<SideCart discounts={[discount]} />` with €250 fixed discount and asserts net total `€ 750,00` is displayed alongside label `'Discount A'`.
- **Test 3:** Renders `<SideCart>` with renamed discount (`Summer Special Discount`) and asserts updated label is present in HTML string.
