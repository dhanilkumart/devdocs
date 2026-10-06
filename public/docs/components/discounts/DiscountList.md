# DiscountList.tsx

## 1. Overview & Responsibilities

`DiscountList.tsx` is the primary container component for the customer Discounts workflow on the main checkout page (`App.tsx`).

### Responsibilities:
- Renders the list of automatic and manual discounts.
- Manages state for opening, editing, and closing the discount creation/edit modal (`DiscountModal`).
- Manages state for deletion confirmation dialog (`ConfirmModal`).
- Calculates dynamic live price previews (`newPriceFormatted`) for predefined discount edits against the €1,000 product baseline.
- Handles creation of new manual discounts, editing existing manual/predefined discounts, and deletion of manual discounts.

---

## 2. Imports and Helper Utilities

```tsx
import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Discount, DiscountTarget, DiscountType } from '../../types/discount'
import ConfirmModal from '../ConfirmModal'
import DiscountModal from './DiscountModal'
import DiscountRow from './DiscountRow'
import { removeDiscount } from '../../utils/predefinedDiscounts'
import { updatePredefinedDiscount } from '../../api/discountsApi'

const PRODUCT_ONE_TIME_PRICE = 1000

const formatPrice = (amount: number) =>
  `€ ${new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`
```

### What this code does
Imports React state hooks, TypeScript interfaces, modal and row child components, utility functions, and defines product price baseline and currency formatting helpers.

### Why it is needed
- **`useState` / `Dispatch`:** Used for local modal form inputs and state updates.
- **`DiscountRow`, `DiscountModal`, `ConfirmModal`:** Child UI components rendered inside `DiscountList`.
- **`removeDiscount` / `updatePredefinedDiscount`:** Helper utilities and API methods to update state and sync persistence.
- **`PRODUCT_ONE_TIME_PRICE` / `formatPrice`:** Product price constant (€1,000) and Dutch locale currency formatter (`€ 950,00`).

### How it works
- `formatPrice(amount)` formats numbers using Dutch locale (`nl-NL`) with two decimal places and a leading `€ ` symbol.

---

## 3. Component Interface & State Hooks

```tsx
interface DiscountListProps {
  discounts: Discount[]
  setDiscounts: Dispatch<SetStateAction<Discount[]>>
  activeDiscountIds: string[]
  onToggleDiscount: (id: string) => void
}

export function DiscountList({
  discounts,
  setDiscounts,
  activeDiscountIds,
  onToggleDiscount,
}: DiscountListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'edit-predefined'>('add')

  const [target, setTarget] = useState<DiscountTarget>('one-time')
  const [type, setType] = useState<DiscountType>('percentage')
  const [value, setValue] = useState(0)
  const [durationMonths, setDurationMonths] = useState(1)
  const [description, setDescription] = useState('')

  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null)
  const [maxAllowedValue, setMaxAllowedValue] = useState<number | undefined>(undefined)
  const [discountToDelete, setDiscountToDelete] = useState<string | null>(null)
```

### What this code does
Defines the `DiscountListProps` interface and initializes component state hooks.

### Why it is needed
To control modal visibility (`isModalOpen`), modal operational mode (`modalMode`), form field values (`target`, `type`, `value`, `durationMonths`, `description`), active edit target (`editingDiscount`), max validation limit (`maxAllowedValue`), and delete target ID (`discountToDelete`).

---

## 4. Modal Triggers & Form Handlers

```tsx
  const resetForm = () => {
    setTarget('one-time')
    setType('percentage')
    setValue(0)
    setDurationMonths(1)
    setDescription('')
    setEditingDiscount(null)
    setMaxAllowedValue(undefined)
    setModalMode('add')
  }

  const handleOpenAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (discount: Discount) => {
    setEditingDiscount(discount)
    setTarget(discount.target)
    setType(discount.type)
    setValue(discount.value)
    setDurationMonths(discount.durationMonths ?? 1)
    setDescription(discount.description)
    setMaxAllowedValue(undefined)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleOpenEditPredefinedModal = (discount: Discount) => {
    setEditingDiscount(discount)
    setTarget(discount.target)
    setType(discount.type)
    setValue(discount.value)
    setMaxAllowedValue(5)
    setModalMode('edit-predefined')
    setIsModalOpen(true)
  }
```

### What this code does
Provides form reset logic and modal opening handlers for adding manual discounts, editing manual discounts, and editing predefined discounts.

### How it works
- **`handleOpenAddModal`:** Resets state to default empty values and sets `modalMode` to `'add'`.
- **`handleOpenEditModal`:** Prefills form fields from an existing manual discount and sets `modalMode` to `'edit'`.
- **`handleOpenEditPredefinedModal`:** Prefills form fields from predefined discount `predefined-2`, sets `maxAllowedValue` to `5`, and sets `modalMode` to `'edit-predefined'`.

---

## 5. Add, Update, and Delete Handlers

```tsx
  const handleAddDiscount = () => {
    const newDiscount: Discount = {
      id: `discount-${Date.now()}`,
      name: 'Manual discount',
      source: 'manual',
      target,
      type,
      value,
      durationMonths: target === 'monthly' ? durationMonths : undefined,
      description,
    }

    setDiscounts((currentDiscounts) => [
      ...currentDiscounts,
      newDiscount,
    ])

    setIsModalOpen(false)
  }

  const handleConfirmDelete = () => {
    if (!discountToDelete) return

    setDiscounts((currentDiscounts) =>
      removeDiscount(currentDiscounts, discountToDelete)
    )
    setDiscountToDelete(null)
  }

  const handleUpdateDiscount = () => {
    if (!editingDiscount) return

    if (modalMode === 'edit-predefined') {
      if (
        maxAllowedValue !== undefined &&
        (value > maxAllowedValue || value < 0 || Number.isNaN(value))
      ) {
        return
      }

      setDiscounts((currentDiscounts) =>
        currentDiscounts.map((discount) =>
          discount.id === editingDiscount.id
            ? { ...discount, value }
            : discount
        )
      )

      updatePredefinedDiscount(editingDiscount.id, { value })
    } else {
      setDiscounts((currentDiscounts) =>
        currentDiscounts.map((discount) =>
          discount.id === editingDiscount.id
            ? {
                ...discount,
                target,
                type,
                value,
                durationMonths:
                  target === 'monthly' ? durationMonths : undefined,
                description,
              }
            : discount
        )
      )
    }

    setIsModalOpen(false)
    setEditingDiscount(null)
  }
```

### What this code does
Handles saving new manual discounts, deleting manual discounts, and updating existing manual or predefined discounts.

### How it works
- **`handleAddDiscount`:** Creates a new discount object with timestamp ID `discount-${Date.now()}` and appends it to `discounts` state.
- **`handleConfirmDelete`:** Filters out `discountToDelete` using `removeDiscount` utility.
- **`handleUpdateDiscount`:**
  - For `'edit-predefined'`: Validates `value <= maxAllowedValue` (5%). Updates local state and calls `updatePredefinedDiscount` to persist change to `localStorage`.
  - For `'edit'`: Updates target, type, value, duration, and description fields of target discount in local state.

---

## 6. Price Calculation & JSX Rendering

```tsx
  const newPrice = Math.max(
    0,
    PRODUCT_ONE_TIME_PRICE -
      (PRODUCT_ONE_TIME_PRICE * (Number.isNaN(value) ? 0 : value)) / 100
  )
  const newPriceFormatted = formatPrice(newPrice)

  return (
    <section className="discount-content">
      <div className="discount-list">
        <h2>Discounts</h2>

        <div className="discount-header">
          <button type="button" onClick={handleOpenAddModal}>
            Add manual discount
          </button>
        </div>

        {discounts.map((discount) => {
          const isPredefinedEditable =
            discount.id === 'predefined-2' ||
            (discount.source === 'automatic' &&
              discount.target === 'one-time' &&
              discount.type === 'percentage')

          return (
            <DiscountRow
              key={discount.id}
              discount={discount}
              enabled={activeDiscountIds.includes(discount.id)}
              onToggle={() => onToggleDiscount(discount.id)}
              onEdit={
                discount.source === 'manual'
                  ? () => handleOpenEditModal(discount)
                  : isPredefinedEditable
                    ? () => handleOpenEditPredefinedModal(discount)
                    : undefined
              }
              onDelete={
                discount.source === 'manual'
                  ? () => setDiscountToDelete(discount.id)
                  : undefined
              }
            />
          )
        })}
      </div>

      {/* Navigation, Footer, ConfirmModal, and DiscountModal rendering */}
    </section>
  )
}
```

### How it connects to other components
- **`DiscountRow`:** Renders each discount item and passes appropriate edit/delete/toggle handlers depending on whether the discount is manual or automatic.
- **`DiscountModal`:** Renders modal overlay for creating/editing manual discounts or editing predefined discounts.
- **`ConfirmModal`:** Renders confirmation dialog before deleting a manual discount.
- **`App.tsx`:** Passes down `discounts`, `setDiscounts`, `activeDiscountIds`, and `onToggleDiscount` props.
