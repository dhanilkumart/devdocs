# discountsApi.ts

## 1. What this file is for

### What `discountsApi.ts` does
`src/api/discountsApi.ts` is the mock API service module for the application. It manages reading, updating, persisting, and subscribing to predefined automatic discounts.

### Why this file exists
In a real-world production application, discount data would be stored in a remote database and accessed via a REST or GraphQL API server. Because this take-home project is a client-side frontend application without a live backend server, `discountsApi.ts` acts as a local data service layer. It provides an asynchronous, Promise-based API interface using browser `localStorage` as its database.

### Why the application has an API service layer
Separating data access logic into an API layer provides clean architectural decoupling:
- **Separation of Concerns:** React UI components (`AdminPage.tsx`, `DiscountList.tsx`, `App.tsx`) do not directly deal with `localStorage` keys or event listeners; they simply call async API methods like `getPredefinedDiscounts()` and `updatePredefinedDiscount()`.
- **Production Readiness:** If a real backend server is introduced in the future, only `discountsApi.ts` needs to be updated to make HTTP requests (e.g. via `fetch`). No changes would be required in the React UI components.

### How it simulates and persists predefined discount data
- **Persistence:** It serializes predefined discount objects into JSON format and stores them in browser `localStorage` under the key `'predefined-discounts'`.
- **Real-Time Synchronization:** It implements a Publisher/Subscriber (Pub/Sub) pattern and listens to browser `storage` events. When an administrator toggles or renames a discount in one tab (or in the Admin view), all open tabs and active UI subscribers are immediately notified and updated.

### Relationship to other files
- **`mockData.ts`:** `discountsApi.ts` imports initial seed data (`predefinedDiscounts`) and type definitions (`PredefinedDiscount`) from `mockData.ts`. It uses this seed data as an initial fallback when `localStorage` is empty.
- **`AdminPage.tsx`:** The Admin management page calls `getPredefinedDiscounts()` to fetch current predefined discounts, `setPredefinedDiscountEnabled()` to toggle availability, and `updatePredefinedDiscount()` to edit names.
- **`App.tsx` / Discounts Page:** The customer Discounts page calls `getPredefinedDiscounts()` on mount and subscribes via `subscribeToPredefinedDiscounts()` to dynamically update available discounts whenever Admin settings change.

---

## 2. Imports

```ts
import { predefinedDiscounts } from './mockData'
import type { PredefinedDiscount } from './mockData'
```

### Explanation of imported items

1. **`predefinedDiscounts` (Value Import)**
   - **What it is:** The default array of seed discount objects.
   - **Where it comes from:** `./mockData` (`src/api/mockData.ts`).
   - **Why it is needed:** Acts as the initial fallback dataset when the application is loaded for the first time before any data has been written to `localStorage`.
   - **Where it is used:** Inside `readDiscounts()`.

2. **`type { PredefinedDiscount }` (Type-Only Import)**
   - **What it is:** TypeScript type interface representing a predefined discount object (which extends `Discount` with an `enabled: boolean` property).
   - **Where it comes from:** `./mockData` (`src/api/mockData.ts`).
   - **Why it is needed:** Provides static type safety and autocompletion for function return types, parameters, and storage serialization.
   - **Where it is used:** Used as type annotations for `readDiscounts()`, `Listener`, `getPredefinedDiscounts()`, `updatePredefinedDiscount()`, and `setPredefinedDiscountEnabled()`.

---

## 3. Constants and Storage Key

```ts
const STORAGE_KEY = 'predefined-discounts'
```

### Explanation

- **`STORAGE_KEY`:** A module-scoped constant string value `'predefined-discounts'`.
- **Why `localStorage` is used:** `localStorage` persists data across browser reloads and tab sessions without requiring a database server.
- **What the storage key means:** It defines the unique key under which the JSON stringified array of predefined discounts is saved in the browser's key-value storage (`window.localStorage.getItem('predefined-discounts')`).
- **How the application uses this stored data:** Every read and write operation in `discountsApi.ts` accesses this key. Furthermore, browser `storage` events check `event.key === STORAGE_KEY` to sync state across browser windows and tabs.

---

## 4. Predefined Discount Storage / Initialization (`readDiscounts`)

```ts
function readDiscounts(): PredefinedDiscount[] {
  const stored = localStorage.getItem(STORAGE_KEY)

  return stored ? JSON.parse(stored) : predefinedDiscounts
}
```

### Step-by-Step Explanation

1. **Where initial data comes from:** If no data exists in `localStorage`, it returns `predefinedDiscounts` imported from `mockData.ts`.
2. **How data is retrieved:** `localStorage.getItem(STORAGE_KEY)` retrieves the raw JSON string stored under `'predefined-discounts'`.
3. **When data exists:** `stored` evaluates to a non-null string, so `JSON.parse(stored)` parses the string back into an array of JavaScript `PredefinedDiscount` objects.
4. **When data does not exist:** `stored` evaluates to `null`. The ternary operator `stored ? ... : predefinedDiscounts` returns the default seed array `predefinedDiscounts`.
5. **How this behaves like a mock database read:** Functions as a private synchronous database getter that abstract storage parsing from the rest of the application.

---

## 5. `getPredefinedDiscounts`

```ts
export function getPredefinedDiscounts(): Promise<PredefinedDiscount[]> {
  return Promise.resolve(readDiscounts())
}
```

### Explanation

- **What it does:** Returns a Promise that resolves to the current array of `PredefinedDiscount` objects.
- **Why it is needed:** Exposes a standard asynchronous API contract. In real applications, fetching data from an endpoint returns a Promise. Wrapping `readDiscounts()` in `Promise.resolve()` allows UI components to consume it asynchronously using `await` or `.then()`.
- **How it works:** `Promise.resolve(value)` creates an immediately resolved Promise wrapping the array returned by `readDiscounts()`.
- **Connection to application:** Called during component initialization in both `App.tsx` (`useEffect`) and `AdminPage.tsx` (`useEffect`).

---

## 6. Event Subscription & Listener Management

```ts
type Listener = (discounts: PredefinedDiscount[]) => void

const listeners = new Set<Listener>()

function notifyListeners() {
  const discounts = readDiscounts()

  listeners.forEach((listener) => listener(discounts))
}

export function subscribeToPredefinedDiscounts(listener: Listener) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      listener(readDiscounts())
    }
  }

  listeners.add(listener)
  window.addEventListener('storage', handleStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', handleStorage)
  }
}
```

### Step-by-Step Explanation

1. **`type Listener`:** Type alias for a callback function that receives the latest `PredefinedDiscount[]` array and returns `void`.
2. **`const listeners = new Set<Listener>()`:** A JavaScript `Set` storing all active callback functions subscribed to discount changes within the current runtime tab. Using a `Set` ensures each listener function is registered only once.
3. **`notifyListeners()`:** Called whenever a discount is updated in the current tab. It reads the latest discounts via `readDiscounts()` and executes every registered `listener(discounts)` callback.
4. **`subscribeToPredefinedDiscounts(listener)`:**
   - **Local Tab Registration:** Adds `listener` to the in-memory `listeners` Set.
   - **Cross-Tab Synchronization (`handleStorage`):** Registers an event listener on `window.addEventListener('storage', handleStorage)`. If an admin modifies `localStorage` in another open browser window or tab, a native `StorageEvent` fires. If `event.key === STORAGE_KEY`, it reads the fresh data and invokes `listener`.
   - **Unsubscribe Cleanup Function:** Returns an anonymous function `() => { listeners.delete(listener); window.removeEventListener('storage', handleStorage); }`. When called (e.g. when a React component unmounts), it removes the listener from the `Set` and unbinds the window event listener to prevent memory leaks.

### Connection to application
`App.tsx` registers its state synchronizer inside `useEffect`:
```ts
useEffect(() => {
  getPredefinedDiscounts().then(syncPredefinedDiscounts)
  return subscribeToPredefinedDiscounts(syncPredefinedDiscounts)
}, [])
```
This enables real-time reactivity whenever an admin toggles or edits a discount.

---

## 7. Updating Predefined Discounts (`updatePredefinedDiscount` & `setPredefinedDiscountEnabled`)

```ts
export function updatePredefinedDiscount(
  id: string,
  updates: Partial<Pick<PredefinedDiscount, 'name' | 'enabled' | 'value'>>
): Promise<PredefinedDiscount[]> {
  const updatedDiscounts = readDiscounts().map((discount) =>
    discount.id === id ? { ...discount, ...updates, id } : discount
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDiscounts))
  notifyListeners()

  return Promise.resolve(updatedDiscounts)
}

export function setPredefinedDiscountEnabled(
  id: string,
  enabled: boolean
): Promise<PredefinedDiscount[]> {
  return updatePredefinedDiscount(id, { enabled })
}
```

### Step-by-Step Explanation

1. **`updatePredefinedDiscount(id, updates)`:**
   - **TypeScript Types:** `updates` uses `Partial<Pick<PredefinedDiscount, 'name' | 'enabled' | 'value'>>`, meaning the caller can pass any combination of `name`, `enabled`, or `value` without having to supply the full discount object.
   - **Immutable Array Mapping:** Reads current discounts and uses `.map()` to return a new array. When `discount.id === id`, it merges existing discount fields with `updates` (`{ ...discount, ...updates, id }`). Other discounts remain unmodified.
   - **Persistence:** Writes the updated array to `localStorage` using `JSON.stringify(updatedDiscounts)`.
   - **Broadcasting:** Calls `notifyListeners()` to update all subscribed React components in the current tab.
   - **Promise Resolution:** Returns `Promise.resolve(updatedDiscounts)`.

2. **`setPredefinedDiscountEnabled(id, enabled)`:**
   - **Convenience Wrapper:** Simplifies toggling the `enabled` boolean by delegating directly to `updatePredefinedDiscount(id, { enabled })`.

### Connection to application
- **`AdminPage.tsx`:** Calls `setPredefinedDiscountEnabled` when an admin toggles a discount switch, and calls `updatePredefinedDiscount` when an admin renames a discount.
- **`DiscountList.tsx`:** Calls `updatePredefinedDiscount` when a user edits the value of an automatic predefined discount.
