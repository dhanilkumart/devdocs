# App.tsx

## 1. What this file is for

### Responsibilities
`src/App.tsx` is the root component of the React application. It manages page routing, top-level discount state, API subscriptions, and data synchronization between the checkout view and the Admin panel.

### Page Rendering & Routing
Instead of using an external library like React Router, `App.tsx` inspects `window.location.pathname` directly:
- **`/admin` Route:** Renders the administrative management page (`<AdminPage />`).
- **Default Route (`/`):** Renders the customer/agent checkout discount page (`<DiscountsPage />`).

### Application State Structure
`App.tsx` defines `<DiscountsPage />`, which holds the central state for the checkout workspace:
1. **`discounts`:** The combined array of Admin-enabled predefined discounts and user-created manual discounts.
2. **`activeDiscountIds`:** An array of string IDs representing predefined automatic discounts currently toggled ON by the user.

---

## 2. Imports

```tsx
import { useEffect, useState } from 'react'
import './styles/discounts.css'
import type { Discount } from './types/discount'
import { DiscountList } from './components/discounts/DiscountList'
import { AdminPage } from './components/admin/AdminPage'
import {
  getPredefinedDiscounts,
  subscribeToPredefinedDiscounts,
} from './api/discountsApi'
import type { PredefinedDiscount } from './api/mockData'
import {
  getAppliedDiscounts,
  syncActiveIds,
  syncDiscounts,
} from './utils/predefinedDiscounts'
import { SideCart } from './components/discounts/SideCart'
```

### Explanation of Imports

1. **`useEffect`, `useState` (React Hooks):** Standard React hooks for managing state and subscription side-effects.
2. **`./styles/discounts.css` (CSS Stylesheet):** Imports global application styles for layouts, modals, rows, toggles, and side cart.
3. **`type { Discount }` (Type Import):** Base TypeScript interface for discounts.
4. **`DiscountList` (Component):** Main checkout section component rendering discount rows and modal triggers.
5. **`AdminPage` (Component):** Admin management page rendered when route is `/admin`.
6. **`getPredefinedDiscounts`, `subscribeToPredefinedDiscounts` (API Functions):** Fetches predefined discounts and registers real-time change listeners.
7. **`type { PredefinedDiscount }` (Type Import):** Interface for predefined discounts with `enabled: boolean`.
8. **`getAppliedDiscounts`, `syncActiveIds`, `syncDiscounts` (Utilities):** Pure helper functions for array merging, active ID cleaning, and cart discount filtering.
9. **`SideCart` (Component):** Sidebar cart overview component displaying computed price totals.

---

## 3. State Management

```tsx
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [activeDiscountIds, setActiveDiscountIds] = useState<string[]>([])
```

### State Table

| State | Initial Value | Purpose | Used By / Passed To |
|---|---|---|---|
| `discounts` | `[]` | Stores available predefined + manual discounts. | Passed to `<DiscountList discounts={discounts} setDiscounts={setDiscounts} />`. |
| `activeDiscountIds` | `[]` | Stores IDs of predefined discounts toggled ON. | Passed to `<DiscountList activeDiscountIds={activeDiscountIds} />` and evaluated in `getAppliedDiscounts`. |

---

## 4. Data Loading & Subscription

```tsx
  useEffect(() => {
    const syncPredefinedDiscounts = (
      predefinedDiscounts: PredefinedDiscount[]
    ) => {
      setDiscounts((currentDiscounts) =>
        syncDiscounts(currentDiscounts, predefinedDiscounts)
      )

      setActiveDiscountIds((currentIds) =>
        syncActiveIds(currentIds, predefinedDiscounts)
      )
    }

    getPredefinedDiscounts().then(syncPredefinedDiscounts)

    return subscribeToPredefinedDiscounts(syncPredefinedDiscounts)
  }, [])
```

### How it works
1. **Initial Fetch:** When `<DiscountsPage />` mounts, `getPredefinedDiscounts()` reads stored predefined discounts from `discountsApi.ts`.
2. **State Synchronization:** `syncDiscounts` merges Admin-enabled predefined discounts with any existing manual discounts. `syncActiveIds` ensures that if Admin disabled a discount, its ID is removed from `activeDiscountIds`.
3. **Real-Time Subscription:** `subscribeToPredefinedDiscounts(syncPredefinedDiscounts)` registers a listener. If an admin toggles or renames a discount in `/admin` or another browser tab, `syncPredefinedDiscounts` re-runs automatically.
4. **Cleanup:** The function returned by `useEffect` unsubscribes the listener when component unmounts.

---

## 5. Discount Toggle Handler

```tsx
  const handleToggleDiscount = (id: string) => {
    setActiveDiscountIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id]
    )
  }
```

### Execution Step-by-Step
- **Triggered By:** Clicking the `<Toggle>` switch on an automatic discount row in `<DiscountList />`.
- **Logic:** If `id` exists in `activeDiscountIds`, filters it out (toggles OFF). If absent, appends `id` to array (toggles ON).
- **UI Result:** Updates `<SideCart discounts={appliedDiscounts} />` to include or exclude the discount from cart calculation subtotals.

---

## 6. Predefined vs Manual Applied Calculation

```tsx
  const appliedDiscounts = getAppliedDiscounts(discounts, activeDiscountIds)
```

`getAppliedDiscounts` filters `discounts` to return:
- All manual discounts (`source === 'manual'`).
- Automatic discounts whose ID is in `activeDiscountIds`.

These `appliedDiscounts` are passed directly to `<SideCart discounts={appliedDiscounts} />`.

---

## 7. Admin Route Selection

```tsx
function App() {
  return window.location.pathname === '/admin' ? (
    <AdminPage />
  ) : (
    <DiscountsPage />
  )
}
```

### Explanation
- Inspects native browser property `window.location.pathname`.
- If URL is `http://localhost:5174/admin`, renders `<AdminPage />`.
- For all other paths (e.g. `http://localhost:5174/`), renders `<DiscountsPage />`.
- Eliminates the need for external router packages for simple two-view applications.

---

## 8. Component Tree Structure

```text
App
├── AdminPage (when path is /admin)
│   └── Toggle
│
└── DiscountsPage (default path /)
    ├── DiscountList
    │   ├── DiscountRow
    │   │   └── Toggle
    │   ├── ConfirmModal
    │   └── DiscountModal
    └── SideCart
```
