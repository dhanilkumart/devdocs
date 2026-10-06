# predefinedDiscounts.test.ts

## 1. What this file is for

### Why this file exists
`src/utils/predefinedDiscounts.test.ts` is an automated Vitest unit test suite for `src/utils/predefinedDiscounts.ts`. It verifies discount list synchronization, toggle state tracking, Admin availability changes, manual discount preservation, title renaming stability, and discount removal functions.

---

## 2. Imports & Test Helpers

```ts
import { describe, expect, it } from 'vitest'
import type { PredefinedDiscount } from '../api/mockData'
import type { Discount } from '../types/discount'
import {
  getAppliedDiscounts,
  removeDiscount,
  syncActiveIds,
  syncDiscounts,
} from './predefinedDiscounts'

const predefined = (enabled: boolean): PredefinedDiscount[] => [
  {
    id: 'predefined-1',
    name: 'Discount A',
    source: 'automatic',
    target: 'one-time',
    type: 'fixed',
    value: 250,
    description: '',
    enabled,
  },
]

const manualDiscount: Discount = {
  id: 'manual-1',
  name: 'Manual discount',
  source: 'manual',
  target: 'one-time',
  type: 'percentage',
  value: 10,
  description: '',
}
```

---

## 3. Comprehensive Test Documentation

---

### Suite 1: Admin availability (`syncDiscounts`)

#### Test 1: `makes an Admin-enabled discount available`
```ts
  it('makes an Admin-enabled discount available', () => {
    const discounts = syncDiscounts([], predefined(true))
    expect(discounts.map((discount) => discount.id)).toEqual(['predefined-1'])
  })
```
- **What is tested:** Verifies that when Admin sets `enabled: true`, `syncDiscounts` makes the predefined discount available on the customer page.

#### Test 2: `does not make an Admin-disabled discount available`
```ts
  it('does not make an Admin-disabled discount available', () => {
    expect(syncDiscounts([], predefined(false))).toEqual([])
  })
```
- **What is tested:** Verifies that when Admin sets `enabled: false`, `syncDiscounts` filters out the discount so it does not appear on the customer page.

#### Test 3: `does not leak the Admin enabled flag into the discount`
```ts
  it('does not leak the Admin enabled flag into the discount', () => {
    expect(syncDiscounts([], predefined(true))[0]).not.toHaveProperty('enabled')
  })
```
- **What is tested:** Verifies that internal Admin property `enabled` is stripped from output `Discount` objects.

---

### Suite 2: Applied state (`syncActiveIds` & `getAppliedDiscounts`)

#### Test 4: `does not apply an available discount initially`
```ts
  it('does not apply an available discount initially', () => {
    const discounts = syncDiscounts([], predefined(true))
    expect(getAppliedDiscounts(discounts, [])).toEqual([])
  })
```
- **What is tested:** Verifies that when an automatic discount first becomes available, it starts in the OFF state (`activeIds = []`).

#### Test 5: `applies the discount when its id is active and stops when removed`
```ts
  it('applies the discount when its id is active and stops when removed', () => {
    const discounts = syncDiscounts([], predefined(true))
    expect(getAppliedDiscounts(discounts, ['predefined-1'])).toHaveLength(1)
    expect(getAppliedDiscounts(discounts, [])).toHaveLength(0)
  })
```
- **What is tested:** Verifies that `getAppliedDiscounts` includes discount when ID is in `activeIds` and excludes it when removed.

#### Test 6: `drops the applied state when Admin disables the discount`
```ts
  it('drops the applied state when Admin disables the discount', () => {
    const activeIds = syncActiveIds(['predefined-1'], predefined(false))
    const discounts = syncDiscounts([], predefined(false))

    expect(activeIds).toEqual([])
    expect(getAppliedDiscounts(discounts, activeIds)).toEqual([])
  })
```
- **What is tested:** Verifies that if Admin disables a discount, `syncActiveIds` removes its ID from `activeIds`.

#### Test 7: `starts OFF again when Admin re-enables the discount`
```ts
  it('starts OFF again when Admin re-enables the discount', () => {
    const activeIds = syncActiveIds(['predefined-1'], predefined(false))
    const discounts = syncDiscounts([], predefined(true))

    expect(discounts).toHaveLength(1)
    expect(getAppliedDiscounts(discounts, activeIds)).toEqual([])
  })
```
- **What is tested:** Verifies that when Admin re-enables a previously disabled discount, it starts in the OFF state until toggled ON again.

#### Test 8: `keeps an active discount active while Admin keeps it enabled`
```ts
  it('keeps an active discount active while Admin keeps it enabled', () => {
    expect(syncActiveIds(['predefined-1'], predefined(true))).toEqual([
      'predefined-1',
    ])
  })
```
- **What is tested:** Verifies active ID persists across syncs as long as Admin keeps discount enabled.

---

### Suite 3: Manual discounts

#### Test 9: `keeps manual discounts regardless of Admin changes`
```ts
  it('keeps manual discounts regardless of Admin changes', () => {
    const enabled = syncDiscounts([manualDiscount], predefined(true))
    const disabled = syncDiscounts(enabled, predefined(false))

    expect(disabled).toEqual([manualDiscount])
  })
```
- **What is tested:** Verifies user-created manual discounts are preserved when predefined discounts are updated.

#### Test 10: `always applies manual discounts without a toggle`
```ts
  it('always applies manual discounts without a toggle', () => {
    expect(getAppliedDiscounts([manualDiscount], [])).toEqual([manualDiscount])
  })
```
- **What is tested:** Verifies manual discounts are always included in `getAppliedDiscounts` even when `activeIds` is empty.

---

### Suite 4: Renaming a predefined discount

#### Test 11: `shows the new name on the Discounts page and keeps the id`
```ts
  it('shows the new name on the Discounts page and keeps the id', () => {
    const discounts = syncDiscounts([], renamed(true))

    expect(discounts[0].name).toBe('Summer Special Discount')
    expect(discounts[0].id).toBe('predefined-1')
  })
```
- **What is tested:** Verifies renaming discount in Admin updates display name while maintaining identical ID.

#### Test 12: `keeps the applied state when only the name changes`
```ts
  it('keeps the applied state when only the name changes', () => {
    const activeIds = syncActiveIds(['predefined-1'], renamed(true))
    const discounts = syncDiscounts([], renamed(true))

    expect(activeIds).toEqual(['predefined-1'])
    expect(getAppliedDiscounts(discounts, activeIds)[0].name).toBe(
      'Summer Special Discount'
    )
  })
```
- **What is tested:** Verifies active applied toggle state remains intact when Admin renames a discount.

#### Test 13: `keeps an inactive discount inactive when renamed`
```ts
  it('keeps an inactive discount inactive when renamed', () => {
    const discounts = syncDiscounts([], renamed(true))

    expect(getAppliedDiscounts(discounts, [])).toEqual([])
  })
```
- **What is tested:** Verifies renaming does not activate an inactive discount.

#### Test 14: `does not make a disabled discount available when renamed`
```ts
  it('does not make a disabled discount available when renamed', () => {
    expect(syncDiscounts([], renamed(false))).toEqual([])
  })
```
- **What is tested:** Verifies renaming a disabled discount does not make it available.

---

### Suite 5: `removeDiscount`

#### Test 15: `removes only the discount with the given id`
```ts
  it('removes only the discount with the given id', () => {
    const other = { ...manualDiscount, id: 'manual-2' }

    expect(removeDiscount([manualDiscount, other], 'manual-1')).toEqual([other])
  })
```
- **What is tested:** Verifies `removeDiscount` filters out target discount while keeping others.

#### Test 16: `leaves the list unchanged when the id does not exist`
```ts
  it('leaves the list unchanged when the id does not exist', () => {
    expect(removeDiscount([manualDiscount], 'missing')).toEqual([manualDiscount])
  })
```
- **What is tested:** Verifies list remains unchanged if target ID is not found.
