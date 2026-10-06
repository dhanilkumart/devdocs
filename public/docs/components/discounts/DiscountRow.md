# DiscountRow.tsx

## 1. Overview & Responsibilities

`DiscountRow.tsx` is a presentational component that renders an individual discount item inside `DiscountList.tsx`.

### Responsibilities:
- Formats and renders discount details (magnitude, target price type, and duration).
- Displays inline edit button (cyan pencil icon) for editable predefined automatic discounts (`source === 'automatic'`).
- Renders edit and delete action buttons for manual discounts (`source === 'manual'`).
- Renders the `<Toggle>` switch component for automatic discount availability toggling.

---

## 2. Component Interface & Details Formatter

```tsx
import type { Discount } from '../../types/discount'
import Toggle from '../Toggle'

interface DiscountRowProps {
  discount: Discount
  enabled: boolean
  onToggle?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

function DiscountRow({
  discount,
  enabled,
  onToggle,
  onEdit,
  onDelete,
}: DiscountRowProps) {
  const discountDetails = [
    discount.type === 'percentage'
      ? `${discount.value}%`
      : `€ ${discount.value}`,
    discount.target === 'one-time' ? 'One time' : 'Monthly',
  ]

  if (discount.target === 'monthly' && discount.durationMonths) {
    discountDetails.push(`${discount.durationMonths} months`)
  }
```

### What this code does
Defines props interface and constructs an array of formatted detail strings (`discountDetails`).

### How it works
- `discountDetails`: Formats magnitude (`250%` or `€ 250`) and price target (`One time` or `Monthly`). Appends `${durationMonths} months` for limited-term monthly discounts.

---

## 3. Row Layout & Action Controls JSX

```tsx
  return (
    <div className="discount-row">
      <span className="discount-name">{discount.name}</span>

      <span className="discount-details">
        {discount.source === 'automatic' && onEdit ? (
          <span className="discount-details-edit">
            <button
              type="button"
              className="discount-action"
              onClick={onEdit}
              aria-label={`Edit ${discount.name}`}
              title={`Edit ${discount.name}`}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </button>
            {`- ${discount.value} % ${discount.target === 'one-time' ? 'one time' : 'monthly'}`}
          </span>
        ) : (
          discountDetails.join(' · ')
        )}
      </span>

      {discount.source === 'manual' ? (
        <div className="discount-actions">
          <button
            type="button"
            className="discount-action"
            onClick={onEdit}
            aria-label={`Edit ${discount.name}`}
            title={`Edit ${discount.name}`}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>

          <button
            type="button"
            className="discount-action"
            onClick={onDelete}
            aria-label={`Delete ${discount.name}`}
            title={`Delete ${discount.name}`}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
      ) : (
        <Toggle
          checked={enabled}
          onChange={onToggle}
          label={enabled ? 'Discount enabled' : 'Discount disabled'}
        />
      )}
    </div>
  )
}

export default DiscountRow
```

### How it works
- **Automatic Editable Row:** Renders pencil edit button directly inside `.discount-details` formatted as `- 5 % one time`.
- **Manual Row:** Renders edit pencil and trash delete buttons inside `.discount-actions`.
- **Automatic Toggle:** Renders `<Toggle>` switch bound to `enabled` state.

### How it connects to other components
- **`DiscountList`:** Maps discounts and supplies `onToggle`, `onEdit`, and `onDelete` callbacks.
- **`Toggle`:** Reusable boolean switch component.
