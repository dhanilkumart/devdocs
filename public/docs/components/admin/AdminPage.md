# AdminPage.tsx

## 1. What this page is for

### What the Admin Page does
`src/components/admin/AdminPage.tsx` provides the administrative interface for managing predefined automatic discounts in the application.

### Why this page exists separately from the agent Discounts page
In a sales management system, sales agents during checkout should only toggle or apply available discounts; system-wide promotion rules and predefined discount definitions are controlled by administrators.
- **Admin Page (`/admin`):** Serves administrative tasks—enabling or disabling automatic discounts system-wide and renaming discount titles.
- **Customer/Agent Page (`/`):** Serves checkout workflow tasks—selecting available discounts, adding manual discounts, and viewing calculated cart totals.

### What an admin can do on this page
1. **View Predefined Discounts:** See a list of all predefined automatic discounts (`predefined-1`, `predefined-2`, `predefined-3`) with their magnitude (percentage vs fixed euro value), price target (one-time vs monthly), and duration.
2. **Toggle Availability:** Turn an automatic discount on or off using a toggle switch.
3. **Inline Rename Titles:** Click a pencil icon next to any discount name, edit the text inside an input field, and save the updated name using the Save button or `Enter` key (or cancel using `Escape`).

### What happens when an admin enables/disables a discount
1. The `<Toggle>` switch invokes `handleToggle(discount)`.
2. `handleToggle` calls `setPredefinedDiscountEnabled(id, !enabled)` in `discountsApi.ts`.
3. `discountsApi.ts` updates `localStorage` under key `'predefined-discounts'` and calls `notifyListeners()`.
4. The customer Discounts page (`App.tsx`), which subscribes to `discountsApi.ts`, immediately receives the updated list and synchronizes available discounts in real time across component states and open browser tabs.

### What happens when an admin edits a discount name
1. Clicking the edit icon triggers `handleStartEdit(discount)`, switching that specific row to inline edit mode (`editingId === discount.id`).
2. The admin edits the text in an `<input>` field bound to `editingName`.
3. Pressing `Enter` or clicking **Save** triggers `handleSaveName(id)`, which calls `updatePredefinedDiscount(id, { name: editingName })`.
4. The API updates `localStorage` and notifies subscribers, immediately reflecting the new name on both the Admin page and the customer checkout page.

### How the Admin Page communicates with the API layer
`AdminPage.tsx` relies exclusively on three functions imported from `src/api/discountsApi.ts`:
- `getPredefinedDiscounts()`: To fetch discounts on mount.
- `setPredefinedDiscountEnabled()`: To persist enable/disable toggle state.
- `updatePredefinedDiscount()`: To persist updated discount names.

---

## 2. Imports

```tsx
import { useEffect, useState } from 'react'
import {
  getPredefinedDiscounts,
  setPredefinedDiscountEnabled,
  updatePredefinedDiscount,
} from '../../api/discountsApi'
import Toggle from '../Toggle'
import type { PredefinedDiscount } from '../../api/mockData'
```

### Explanation of Imports

1. **`useEffect`, `useState` (React Hooks)**
   - **What they are:** Standard React Hooks imported from the `'react'` library.
   - **Why needed:** `useState` manages local component state (`discounts`, `editingId`, `editingName`). `useEffect` handles asynchronous initial data fetching when the page mounts.

2. **`getPredefinedDiscounts`, `setPredefinedDiscountEnabled`, `updatePredefinedDiscount` (API Functions)**
   - **What they are:** Asynchronous API functions imported from `../../api/discountsApi`.
   - **Why needed:** Provides data persistence and retrieval methods without direct `localStorage` manipulation inside the component.

3. **`Toggle` (UI Component)**
   - **What it is:** Default export component imported from `../Toggle`.
   - **Why needed:** Renders an accessible boolean switch control (`role="switch"`) for toggling discount `enabled` status.

4. **`type { PredefinedDiscount }` (Type Import)**
   - **What it is:** TypeScript type interface imported from `../../api/mockData`.
   - **Why needed:** Provides type safety for state declaration (`PredefinedDiscount[]`) and handler parameter type annotations.

---

## 3. Component Definition and State Hooks

```tsx
export function AdminPage() {
  const [discounts, setDiscounts] = useState<PredefinedDiscount[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
```

### Explanation

- **`AdminPage`:** Named functional React component representing the administrative view.
- **`discounts` State:** Holds the array of `PredefinedDiscount` objects loaded from `discountsApi.ts`. Initialized to an empty array `[]`.
- **`editingId` State:** Tracks which discount row is currently being inline-edited. Holds a string `id` when editing, or `null` when no row is being edited.
- **`editingName` State:** Controlled input text buffer holding the draft name being typed by the user.

---

## 4. Initial Data Fetching (`useEffect`)

```tsx
  useEffect(() => {
    getPredefinedDiscounts().then(setDiscounts)
  }, [])
```

### Step-by-Step Explanation

1. **Mount Hook:** `useEffect` executes after the component renders into the DOM.
2. **Empty Dependency Array (`[]`):** Ensures the effect runs exactly once when `AdminPage` mounts.
3. **Data Fetching:** Calls `getPredefinedDiscounts()`, which returns a Promise resolving to `PredefinedDiscount[]`.
4. **State Update:** `.then(setDiscounts)` updates the `discounts` state with the fetched array, triggering a re-render to display the discount list.

---

## 5. Event Handlers

```tsx
  const handleStartEdit = (discount: PredefinedDiscount) => {
    setEditingId(discount.id)
    setEditingName(discount.name)
  }

  const handleSaveName = (id: string) => {
    updatePredefinedDiscount(id, { name: editingName }).then(setDiscounts)
    setEditingId(null)
  }

  const handleToggle = (discount: PredefinedDiscount) => {
    setPredefinedDiscountEnabled(discount.id, !discount.enabled).then(
      setDiscounts
    )
  }
```

### Step-by-Step Explanation

1. **`handleStartEdit(discount)`:**
   - Triggered when the user clicks the edit pencil icon on a discount row.
   - Sets `editingId` to `discount.id` to activate inline edit UI mode for that row.
   - Prefills `editingName` with `discount.name`.

2. **`handleSaveName(id)`:**
   - Triggered when the user clicks the **Save** button or presses `Enter` inside the edit input.
   - Calls `updatePredefinedDiscount(id, { name: editingName })`.
   - Upon Promise resolution, `.then(setDiscounts)` updates local state with the returned updated discounts list.
   - Resets `editingId` to `null` to exit inline edit mode.

3. **`handleToggle(discount)`:**
   - Triggered when the user clicks the `<Toggle>` switch.
   - Inverts the current status (`!discount.enabled`) and calls `setPredefinedDiscountEnabled(discount.id, !discount.enabled)`.
   - `.then(setDiscounts)` updates local state with the new updated list.

---

## 6. JSX Rendering Structure

```tsx
  return (
    <main className="discount-page">
      <div className="discount-content">
        <div className="discount-list">
          <h2>Predefined discounts</h2>

          {discounts.map((discount) => (
            <div key={discount.id} className="discount-row">
              {editingId === discount.id ? (
                <span className="discount-name discount-name-edit">
                  <input
                    type="text"
                    value={editingName}
                    aria-label="Discount name"
                    onChange={(event) => setEditingName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleSaveName(discount.id)
                      if (event.key === 'Escape') setEditingId(null)
                    }}
                  />
                  <button type="button" onClick={() => handleSaveName(discount.id)}>
                    Save
                  </button>
                </span>
              ) : (
                <span className="discount-name">
                  {discount.name}
                  <button
                    type="button"
                    className="discount-action"
                    onClick={() => handleStartEdit(discount)}
                    aria-label={`Edit name of ${discount.name}`}
                    title={`Edit name of ${discount.name}`}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                  </button>
                </span>
              )}

              <span className="discount-details">
                {discount.type === 'percentage'
                  ? `${discount.value}%`
                  : `€ ${discount.value}`}
                {' · '}
                {discount.target === 'one-time' ? 'One time' : 'Monthly'}
                {discount.durationMonths
                  ? ` · ${discount.durationMonths} months`
                  : ''}
              </span>

              <Toggle
                checked={discount.enabled}
                onChange={() => handleToggle(discount)}
                label={discount.enabled ? 'Discount enabled' : 'Discount disabled'}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
```

### Detailed JSX Breakdown

1. **Page Container:** `<main className="discount-page">` provides the outer wrapper with white background container `.discount-content`.
2. **List Header:** `<h2>Predefined discounts</h2>` displays section title with teal banner styling.
3. **Discount Row Mapping (`discounts.map`):** Iterates over every predefined discount using `key={discount.id}`.
4. **Conditional Inline Name Editing (`editingId === discount.id`):**
   - **Active Editing (`true`):** Renders a controlled text `<input>` bound to `editingName`. Pressing `Enter` calls `handleSaveName`, pressing `Escape` cancels editing by calling `setEditingId(null)`. Renders a **Save** `<button>`.
   - **Read-Only (`false`):** Renders discount title `{discount.name}` and an edit pencil `<button>` with SVG icon.
5. **Formatted Discount Details:** Formats discount details into a single string:
   - Magnitude: `${discount.value}%` or `€ ${discount.value}`.
   - Price Target: `'One time'` or `'Monthly'`.
   - Optional Duration: ` · X months` if `durationMonths` exists.
6. **Toggle Switch:** Renders `<Toggle>` with `checked={discount.enabled}` and accessible `label`. Clicking invokes `handleToggle(discount)`.
