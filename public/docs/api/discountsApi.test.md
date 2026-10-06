# discountsApi.test.ts

## 1. What this file is for

### What this file is
`src/api/discountsApi.test.ts` is an automated unit and integration test file written using **Vitest**, a fast Vite-native testing framework.

### Why this test file exists
It verifies that the mock API module (`src/api/discountsApi.ts`) correctly reads, updates, persists, and broadcasts changes to predefined automatic discounts. By testing these operations in isolation with a mocked browser environment, the test suite ensures that data persistence and subscription notifications work reliably without relying on a live browser or server backend.

### What part of the application it tests
This file tests the fake backend layer (`src/api/discountsApi.ts`), which acts as the data service for both:
1. **The Admin Page (`AdminPage.tsx`):** Where administrators enable/disable discounts or update discount metadata.
2. **The Discounts Customer View (`App.tsx` / `DiscountList.tsx`):** Which listens for changes to predefined discounts and updates available discounts in real time.

### What `discountsApi.ts` is responsible for
Based on the project codebase, `discountsApi.ts` provides an asynchronous API interface that:
- Reads predefined discounts from browser `localStorage` (falling back to initial seed data in `src/api/mockData.ts`).
- Updates specific discount fields (`name`, `enabled`, `value`) in `localStorage`.
- Manages subscription listeners (`subscribeToPredefinedDiscounts`) to notify UI components whenever predefined discount data changes across browser tabs or component states.

---

## 2. Imports

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
```

### What this code does
This line imports essential test utilities and mock functions from the `vitest` library.

### Why it is used
It provides the core test runner building blocks (`describe`, `it`, `beforeEach`, `expect`) and test double capabilities (`vi`) required to structure unit test suites and mock browser APIs in a Node.js test environment.

### How it works
- `describe`: Groups related test cases into a labeled suite (`'discountsApi'`).
- `it`: Defines an individual test case with a specific description and assertion steps.
- `beforeEach`: Registers a setup hook that executes before each test case in the suite.
- `expect`: Provides assertion utilities to check if received runtime values match expected test outcomes.
- `vi`: The Vitest utility object used for mocking global APIs (`vi.stubGlobal`), creating spy functions (`vi.fn()`), and resetting module registries (`vi.resetModules()`).

### Important concepts
- **Module Imports:** ESM (ECMAScript Module) syntax importing named exports from the `vitest` package.
- **Test Runner API:** Standard modern JavaScript testing pattern compatible with Vitest and Jest syntax.

### Connection to the application
These imports connect the test runner runtime (Vitest) to the mock API module under test.

---

## 3. Browser Environment Mocking (`stubBrowser`)

```ts
function stubBrowser() {
  const store: Record<string, string> = {}

  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
  })
  vi.stubGlobal('window', {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })
}
```

### What this code does
`stubBrowser` is a helper function that creates a simulated in-memory browser environment for Vitest. It mocks two global browser mechanisms:
1. `window.localStorage` (`getItem` and `setItem`).
2. `window.addEventListener` and `window.removeEventListener`.

### Why it is used
Vitest runs in a Node.js environment where native browser APIs like `window.localStorage` and DOM event listeners do not exist by default. `stubBrowser` provides an in-memory key-value store (`store`) and fake event listener functions so `discountsApi.ts` can execute without crashing.

### How it works
- `const store: Record<string, string> = {}`: Creates a clean JavaScript dictionary object to mimic browser storage memory.
- `vi.stubGlobal('localStorage', { ... })`: Replaces the global `localStorage` object with a custom implementation. When `getItem(key)` is called, it returns `store[key]` or `null`. When `setItem(key, value)` is called, it writes `value` into `store[key]`.
- `vi.stubGlobal('window', { ... })`: Replaces the global `window` object with fake event registration methods created using `vi.fn()`.

### Important concepts & methods
- **`vi.stubGlobal(name, value)`:** Replaces global properties (such as `window` or `localStorage`) during test execution.
- **`vi.fn()`:** Creates a mock/spy function that tracks how many times it was called and with what arguments.
- **`Record<string, string>`:** TypeScript utility type representing an object with string keys and string values.
- **Nullish Coalescing Operator (`??`):** `store[key] ?? null` returns `store[key]` if present, or `null` if `undefined` (matching standard `localStorage.getItem` behavior).

### Connection to the application
`discountsApi.ts` interacts directly with `localStorage.getItem('predefined-discounts')`, `localStorage.setItem(...)`, and `window.addEventListener('storage', ...)`. `stubBrowser` simulates these browser features so the test suite can test persistence and event subscription logic accurately.

---

## 4. Test Suite Setup (`describe` & `beforeEach`)

```ts
describe('discountsApi', () => {
  beforeEach(() => {
    vi.resetModules()
    stubBrowser()
  })
```

### What this code does
`describe` creates the main test suite named `'discountsApi'`. `beforeEach` runs a reset routine before every single test case inside the suite.

### Why it is used
To isolate tests from one another (test isolation). Without resetting modules and re-stubbing `localStorage`, state modified in one test could leak into subsequent tests and cause false passes or unpredictable test failures.

### How it works
- `vi.resetModules()`: Clears the module registry cache. This forces `import('./discountsApi')` in each test to load a fresh instance of the file with clean in-memory module-level variables (such as `listeners = new Set()`).
- `stubBrowser()`: Re-initializes the in-memory `store` object to `{}` and replaces global browser stubs before each test runs.

### Important concepts & methods
- **`vi.resetModules()`:** Essential Vitest API for clearing cached module state between test runs.
- **Test Isolation:** Best practice in testing ensuring each test executes in a clean state independently of others.

### Connection to the application
Ensures that each test starts with default predefined discounts from `src/api/mockData.ts` and an empty `localStorage`.

---

## 5. Test Case 1: Updating Enabled Flag & Persistence

```ts
  it('updates the enabled flag and persists it', async () => {
    const api = await import('./discountsApi')

    await api.setPredefinedDiscountEnabled('predefined-2', true)
    const discounts = await api.getPredefinedDiscounts()

    expect(discounts.find((d) => d.id === 'predefined-2')?.enabled).toBe(true)
  })
```

### What this code does
Tests that calling `setPredefinedDiscountEnabled('predefined-2', true)` changes the `enabled` property of discount `'predefined-2'` from `false` to `true` and saves it to storage.

### Why it is used
To verify that Admin status toggles in `AdminPage.tsx` successfully persist and update discount state.

### How it works
1. Dynamically imports the clean `discountsApi` module instance.
2. Calls `setPredefinedDiscountEnabled('predefined-2', true)` asynchronously.
3. Retrieves the current list of discounts using `getPredefinedDiscounts()`.
4. Uses Array `.find()` and optional chaining (`?.`) to assert that the target discount's `enabled` property is `true`.

### Important concepts & methods
- **Dynamic `import()`:** `await import('./discountsApi')` dynamically loads the module after `vi.resetModules()` has executed.
- **`async/await`:** Handles asynchronous Promise resolution from API methods.
- **Array `.find()`:** Locates the discount object matching `id === 'predefined-2'`.
- **`expect(...).toBe(true)`:** Assertion verifying strict boolean equality.

### Connection to the application
When an admin toggles a discount switch in `AdminPage.tsx`, it invokes `setPredefinedDiscountEnabled`. This test verifies that the API persists that toggle change so customer views reflect the updated discount availability.

---

## 6. Test Case 2: Listener Subscription & Notification

```ts
  it('notifies subscribers when Admin changes a discount', async () => {
    const api = await import('./discountsApi')
    const listener = vi.fn()

    const unsubscribe = api.subscribeToPredefinedDiscounts(listener)
    await api.setPredefinedDiscountEnabled('predefined-1', false)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0][0].enabled).toBe(false)

    unsubscribe()
    await api.setPredefinedDiscountEnabled('predefined-1', true)

    expect(listener).toHaveBeenCalledTimes(1)
  })
```

### What this code does
Verifies the Pub/Sub (Publisher/Subscriber) pattern implemented in `discountsApi.ts`:
1. Subscribes a listener function to API changes.
2. Asserts that updates trigger the listener with updated discount data.
3. Asserts that calling the returned `unsubscribe` cleanup function stops future notifications.

### Why it is used
To guarantee that real-time updates reach subscribed components (such as `App.tsx`) when discount statuses change, and that memory leaks are prevented via proper unsubscribing.

### How it works
1. Creates a mock spy listener (`listener = vi.fn()`).
2. Registers `listener` with `subscribeToPredefinedDiscounts` and receives an `unsubscribe` callback.
3. Calls `setPredefinedDiscountEnabled('predefined-1', false)`.
4. Asserts `listener` was invoked once (`toHaveBeenCalledTimes(1)`).
5. Inspects `listener.mock.calls` to verify the payload passed to `listener` contains `enabled: false` for the first discount (`calls[0][0][0]`).
6. Executes `unsubscribe()`.
7. Calls `setPredefinedDiscountEnabled('predefined-1', true)` again and verifies `listener` was **not** called a second time (count remains 1).

### Important concepts & methods
- **`vi.fn()` Spy Inspection:** `listener.mock.calls[0][0][0]` accesses:
  - `calls[0]`: The 1st invocation of the spy.
  - `[0]`: The 1st argument passed to that invocation (the discounts array).
  - `[0]`: The 1st element in that discounts array.
- **Unsubscribe Cleanup Pattern:** Returning a cleanup function from a subscription method is standard in React hooks (`useEffect`) to prevent memory leaks.

### Connection to the application
`App.tsx` subscribes to predefined discounts inside a `useEffect` hook (`subscribeToPredefinedDiscounts(syncPredefinedDiscounts)`). This test confirms that subscription and unsubscription mechanisms function correctly.

---

## 7. Test Case 3: Selective Property Updates (Renaming)

```ts
  it('updates only the name and keeps every other property', async () => {
    const api = await import('./discountsApi')
    const before = (await api.getPredefinedDiscounts()).find(
      (d) => d.id === 'predefined-3'
    )

    const updated = await api.updatePredefinedDiscount('predefined-3', {
      name: 'Summer Special Discount',
    })
    const after = updated.find((d) => d.id === 'predefined-3')

    expect(after?.name).toBe('Summer Special Discount')
    expect(after).toEqual({ ...before, name: 'Summer Special Discount' })
    expect(after?.id).toBe('predefined-3')
    expect(after?.enabled).toBe(before?.enabled)
  })
```

### What this code does
Verifies that updating a specific field (such as `name`) via `updatePredefinedDiscount` modifies only that target field while preserving all other existing properties (such as `id`, `target`, `type`, `value`, `durationMonths`, `enabled`, and `description`).

### Why it is used
To prevent regression bugs where updating one field (e.g. renaming a discount in Admin) accidentally resets or overwrites unedited fields (e.g. disabling the discount or losing its percentage value).

### How it works
1. Fetches the initial snapshot of discount `'predefined-3'` into `before`.
2. Updates `'predefined-3'` with `{ name: 'Summer Special Discount' }`.
3. Finds the updated object `after`.
4. Asserts that `after.name` equals `'Summer Special Discount'`.
5. Compares `after` object equality against `{ ...before, name: 'Summer Special Discount' }` using `toEqual`.
6. Explicitly verifies `id` and `enabled` remain unchanged.

### Important concepts & methods
- **`expect(...).toEqual(...)`:** Performs deep object equality comparison (unlike `toBe`, which checks reference identity).
- **Spread Syntax (`{ ...before, name: '...' }`):** Creates an expected object snapshot representing partial property replacement.

### Connection to the application
In `AdminPage.tsx`, administrators can inline-edit the title of predefined discounts. This test ensures that saving a new title does not mutate other discount metadata or disable the discount.

---

## 8. Test Case 4: Renaming Persistence & Listener Broadcasting

```ts
  it('persists the new name and notifies subscribers', async () => {
    const api = await import('./discountsApi')
    const listener = vi.fn()

    api.subscribeToPredefinedDiscounts(listener)
    await api.updatePredefinedDiscount('predefined-1', { name: 'New name' })

    expect(listener.mock.calls[0][0][0].name).toBe('New name')
    expect((await api.getPredefinedDiscounts())[0].name).toBe('New name')
  })
})
```

### What this code does
Verifies that renaming a predefined discount triggers subscription notifications and persists the updated name for subsequent queries.

### Why it is used
To ensure that when an admin renames a discount in the Admin interface, the new name is immediately broadcasted to active subscribers and stored permanently in `localStorage`.

### How it works
1. Subscribes `listener` to discount updates.
2. Updates discount `'predefined-1'` with `{ name: 'New name' }`.
3. Inspects `listener.mock.calls` to verify the payload received by subscribers contains the updated name.
4. Queries `getPredefinedDiscounts()` and verifies the first discount's `name` property equals `'New name'`.

### Important concepts & assertions
- **Combined Behavior Verification:** Tests both real-time notification (`listener.mock.calls`) and persistent read storage (`getPredefinedDiscounts()`) in a single workflow.
- **Closing Bracket `})`:** Formally closes the `describe('discountsApi', ...)` test suite block.

### Connection to the application
Connects the Admin editing workflow in `AdminPage.tsx` with the customer view in `DiscountList.tsx` and `SideCart.tsx`. When a predefined discount is renamed in Admin, this behavior ensures the customer view immediately displays the new title in the discount list and cart overview.
