# DiscountModal.tsx

## 1. Overview & Responsibilities

`DiscountModal.tsx` is a modal dialog component used for adding manual discounts, editing manual discounts, and editing predefined automatic discounts.

### Responsibilities:
- Renders segmented control for selecting price target (**One time price** vs **Monthly price**).
- Renders discount magnitude controls (type dropdown `%` or `€` and numeric value input).
- Renders optional **Duration** input for monthly target discounts.
- Renders optional **Description** textarea.
- Renders read-only **New price** preview input when in `edit-predefined` mode.
- Validates maximum allowed percentage limit (`maxAllowedValue = 5`) and displays inline error state matching UI specifications.

---

## 2. Component Interface & Setup

```tsx
import type { DiscountTarget, DiscountType } from '../../types/discount'

interface DiscountModalProps {
  mode: 'add' | 'edit' | 'edit-predefined'
  target: DiscountTarget
  type: DiscountType
  value: number
  durationMonths: number
  description: string
  title?: string
  maxAllowedValue?: number
  newPriceFormatted?: string
  onTargetChange: (target: DiscountTarget) => void
  onTypeChange: (type: DiscountType) => void
  onValueChange: (value: number) => void
  onDurationChange: (duration: number) => void
  onDescriptionChange: (description: string) => void
  onCancel: () => void
  onSubmit: () => void
}
```

### What this code does
Defines the `DiscountModalProps` interface specifying all controlled inputs, mode discriminators, validation constraints, and callback handlers.

---

## 3. Validation Logic & Title Resolution

```tsx
function DiscountModal({
  mode,
  target,
  type,
  value,
  durationMonths,
  description,
  title,
  maxAllowedValue,
  newPriceFormatted,
  onTargetChange,
  onTypeChange,
  onValueChange,
  onDurationChange,
  onDescriptionChange,
  onCancel,
  onSubmit,
}: DiscountModalProps) {
  const isPredefinedEdit = mode === 'edit-predefined'
  const isExceedingMax =
    isPredefinedEdit &&
    maxAllowedValue !== undefined &&
    (value > maxAllowedValue || value < 0 || Number.isNaN(value))

  const modalTitle = isPredefinedEdit
    ? title || 'Discount name here'
    : mode === 'add'
      ? 'Add manual discount'
      : 'Edit manual discount'

  const handleSubmit = () => {
    if (isExceedingMax) {
      return
    }
    onSubmit()
  }
```

### How it works
- **`isPredefinedEdit`:** Boolean flag checking if `mode === 'edit-predefined'`.
- **`isExceedingMax`:** Evaluates if entered value exceeds `maxAllowedValue` (5%), is negative, or is `NaN`.
- **`modalTitle`:** Resolves modal header title based on mode and passed `title` prop.
- **`handleSubmit`:** Prevents submission if `isExceedingMax` is true.

---

## 4. Segmented Target Control & Discount Inputs JSX

```tsx
  return (
    <div className="discount-modal-backdrop">
      <div className="discount-modal">
        <div className="discount-modal-header">
          <h2>{modalTitle}</h2>
        </div>

        <div className="discount-modal-body">
          <div className="discount-field">
            <label>For which price do you calculate the discount?</label>

            <div className="discount-segmented-control">
              <button
                type="button"
                className={target === 'one-time' ? 'is-selected' : ''}
                disabled={isPredefinedEdit}
                onClick={() => !isPredefinedEdit && onTargetChange('one-time')}
              >
                One time price
                <span className="discount-radio" />
              </button>

              <button
                type="button"
                className={target === 'monthly' ? 'is-selected' : ''}
                disabled={isPredefinedEdit}
                onClick={() => !isPredefinedEdit && onTargetChange('monthly')}
              >
                Monthly price
                <span className="discount-radio" />
              </button>
            </div>
          </div>

          <div className={`discount-field ${isExceedingMax ? 'has-error' : ''}`}>
            <label>Discount</label>

            <div className="discount-value-row">
              <select
                value={type}
                disabled={isPredefinedEdit}
                onChange={(event) =>
                  onTypeChange(event.target.value as DiscountType)
                }
              >
                <option value="percentage">%</option>
                <option value="fixed">€</option>
              </select>

              <input
                type="number"
                min="0"
                max={maxAllowedValue}
                value={Number.isNaN(value) ? '' : value}
                onChange={(event) => onValueChange(Number(event.target.value))}
              />
            </div>

            {isPredefinedEdit && maxAllowedValue !== undefined && (
              isExceedingMax ? (
                <div className="discount-error-message">
                  Exceeds the max. of {maxAllowedValue}%
                </div>
              ) : (
                <div className="discount-helper-text">
                  The discount cannot exceed {maxAllowedValue}%
                </div>
              )
            )}
          </div>
```

### How it works
- **Disabled Segmented Buttons:** When `isPredefinedEdit` is true, buttons have `disabled` set, preventing target switching.
- **Error Styling (`.has-error`):** When `isExceedingMax` is true, `.has-error` class applies red border (`#e53935`) and pale red background (`#fcf2f2`) to the input field, and displays error text `"Exceeds the max. of 5%"`.

---

## 5. New Price Preview, Fields, and Footer JSX

```tsx
          {isPredefinedEdit && newPriceFormatted !== undefined && (
            <div className="discount-field">
              <label htmlFor="newPrice">New price</label>
              <input
                id="newPrice"
                type="text"
                readOnly
                value={newPriceFormatted}
              />
            </div>
          )}

          {!isPredefinedEdit && target === 'monthly' && (
            <div className="discount-field">
              <label htmlFor="durationMonths">Duration</label>
              <input
                id="durationMonths"
                type="number"
                min="1"
                max="12"
                placeholder="Number of months"
                value={durationMonths}
                onChange={(event) => onDurationChange(Number(event.target.value))}
              />
            </div>
          )}

          {!isPredefinedEdit && (
            <div className="discount-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => onDescriptionChange(event.target.value)}
                rows={1}
              />
            </div>
          )}
        </div>

        <div className="discount-modal-footer">
          <button type="button" className="discount-modal-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="discount-modal-submit" onClick={handleSubmit}>
            {mode === 'add' ? 'Add' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DiscountModal
```

### How it connects to other components
- **`DiscountList`:** Controls all state passed into `DiscountModalProps` and receives `onCancel` / `onSubmit` actions.
