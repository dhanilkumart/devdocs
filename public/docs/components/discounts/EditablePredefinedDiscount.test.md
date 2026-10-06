# EditablePredefinedDiscount.test.tsx

## 1. Overview & Test Suite Purpose

`EditablePredefinedDiscount.test.tsx` is an automated test suite verifying the UI states and validation logic for the predefined 5% one-time automatic discount edit feature.

### What it tests:
1. Verifies rendering of the edit pencil icon on editable predefined discount rows in `DiscountRow`.
2. Verifies that `DiscountModal` in `edit-predefined` mode displays disabled target controls, prefilled 5% value, and read-only **New price** (`€ 950,00`).
3. Verifies live **New price** update to `€ 960,00` when value is changed to 4%.
4. Verifies validation error state (red border class `.has-error` and error message `"Exceeds the max. of 5%"`) when input value exceeds 5%.

---

## 2. Test Setup & Fixture Data

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import DiscountModal from './DiscountModal'
import DiscountRow from './DiscountRow'
import type { Discount } from '../../types/discount'

const predefined5Percent: Discount = {
  id: 'predefined-2',
  name: 'Discount name',
  source: 'automatic',
  target: 'one-time',
  type: 'percentage',
  value: 5,
  description: 'Sample discount',
}
```

### What this code does
Imports test renderer, Vitest hooks, `DiscountModal`, `DiscountRow`, and defines fixture `predefined5Percent`.

---

## 3. Test Cases

```tsx
describe('EditablePredefinedDiscount UI', () => {
  it('renders pencil icon next to automatic discount details when editable', () => {
    const html = renderToStaticMarkup(
      <DiscountRow
        discount={predefined5Percent}
        enabled={false}
        onEdit={() => {}}
      />
    )

    expect(html).toContain('discount-details-edit')
    expect(html).toContain('aria-label="Edit Discount name"')
    expect(html).toContain('- 5 % one time')
    expect(html).toContain('role="switch"')
  })

  it('renders disabled target controls and title in edit-predefined modal', () => {
    const html = renderToStaticMarkup(
      <DiscountModal
        mode="edit-predefined"
        target="one-time"
        type="percentage"
        value={5}
        durationMonths={1}
        description=""
        title="Discount name"
        maxAllowedValue={5}
        newPriceFormatted="€ 950,00"
        onTargetChange={() => {}}
        onTypeChange={() => {}}
        onValueChange={() => {}}
        onDurationChange={() => {}}
        onDescriptionChange={() => {}}
        onCancel={() => {}}
        onSubmit={() => {}}
      />
    )

    expect(html).toContain('<h2>Discount name</h2>')
    expect(html).toContain('disabled=""')
    expect(html).toContain('One time price')
    expect(html).toContain('Monthly price')
    expect(html).toContain('The discount cannot exceed 5%')
    expect(html).toContain('value="5"')
    expect(html).toContain('value="€ 950,00"')
    expect(html).not.toContain('Duration')
    expect(html).not.toContain('Description')
  })

  it('renders updated New price when value is 4%', () => {
    const html = renderToStaticMarkup(
      <DiscountModal
        mode="edit-predefined"
        target="one-time"
        type="percentage"
        value={4}
        durationMonths={1}
        description=""
        title="Discount name"
        maxAllowedValue={5}
        newPriceFormatted="€ 960,00"
        onTargetChange={() => {}}
        onTypeChange={() => {}}
        onValueChange={() => {}}
        onDurationChange={() => {}}
        onDescriptionChange={() => {}}
        onCancel={() => {}}
        onSubmit={() => {}}
      />
    )

    expect(html).toContain('value="4"')
    expect(html).toContain('value="€ 960,00"')
    expect(html).toContain('The discount cannot exceed 5%')
  })

  it('renders error message and has-error class when value exceeds 5%', () => {
    const html = renderToStaticMarkup(
      <DiscountModal
        mode="edit-predefined"
        target="one-time"
        type="percentage"
        value={11}
        durationMonths={1}
        description=""
        title="Discount name"
        maxAllowedValue={5}
        newPriceFormatted="€ 890,00"
        onTargetChange={() => {}}
        onTypeChange={() => {}}
        onValueChange={() => {}}
        onDurationChange={() => {}}
        onDescriptionChange={() => {}}
        onCancel={() => {}}
        onSubmit={() => {}}
      />
    )

    expect(html).toContain('has-error')
    expect(html).toContain('Exceeds the max. of 5%')
    expect(html).not.toContain('The discount cannot exceed 5%')
  })
})
```

### How it works
- **Test 1:** Asserts `DiscountRow` renders pencil edit button for `predefined-2` alongside `- 5 % one time`.
- **Test 2:** Asserts `DiscountModal` in `edit-predefined` mode displays disabled target controls, title `Discount name`, prefilled `5%`, `€ 950,00` price preview, and hides `Duration`/`Description`.
- **Test 3:** Asserts updating value to `4%` displays `€ 960,00`.
- **Test 4:** Asserts value `11%` (> 5%) triggers `.has-error` class and error text `"Exceeds the max. of 5%"`.
