export interface SalesdockQAItem {
  id: string;
  category: string;
  question: string;
  preview: string;
  answer: string;
  relatedFiles?: string[];
}

export const SALESDOCK_QA_ITEMS: SalesdockQAItem[] = [
  {
    id: "sqa-001",
    category: "Architecture & Approach",
    question: "How did you approach this assignment, and how did you structure the application?",
    preview:
      "When I started this assignment, my approach was to understand the requirements first and then break the application into smaller, manageable parts instead of putting everything into a single component.",
    answer: `When I started this assignment, my approach was to understand the requirements first and then break the application into smaller, manageable parts instead of putting everything into a single component.

First, I defined the data structure.

I created \`src/types/discount.ts\` to define the discount types and interfaces. This gave me a consistent structure for discounts, product prices, and discount results throughout the application.

Second, I separated the business logic from the UI.

I created \`src/utils/discountCalculator.ts\` for calculating percentage discounts, fixed discounts, and monthly discount totals. This keeps the pricing calculations independent of the React components and makes them easier to test.

Third, I prepared the predefined discount data and its management layer.

I used \`src/api/mockData.ts\` for the initial discount data and \`src/api/discountsApi.ts\` to handle retrieving, updating, and persisting discounts in local storage. I also added a subscription mechanism so that changes can be reflected in the other parts of the application.

Fourth, I connected the main application flow.

In \`src/App.tsx\`, I managed the applied discount IDs and connected the discount list with the side cart. The app also renders the admin page when the URL path is \`/admin\`.

Fifth, I separated the UI into reusable components.

I used \`src/components/discounts/DiscountList.tsx\` for the discount list, \`src/components/discounts/DiscountRow.tsx\` for individual discount rows, and \`src/components/discounts/SideCart.tsx\` for the price overview. I kept the admin functionality in \`src/components/admin/AdminPage.tsx\`.

Finally, I added tests and checked the production build.

I created tests for the discount calculations, discount data management, API behavior, and important UI interactions. The goal was to keep the implementation modular, easier to maintain, and easier to verify.

Overall, I separated the data model, business logic, data management, and UI components so that each part has a clear responsibility.`,
    relatedFiles: [
      "src/types/discount.ts",
      "src/utils/discountCalculator.ts",
      "src/api/mockData.ts",
      "src/api/discountsApi.ts",
      "src/App.tsx",
      "src/components/discounts/DiscountList.tsx",
      "src/components/discounts/DiscountRow.tsx",
      "src/components/discounts/SideCart.tsx",
      "src/components/admin/AdminPage.tsx",
    ],
  },
  {
    id: "sqa-002",
    category: "Tech Stack & Tooling",
    question: "Why did you choose this tech stack for the assignment?",
    preview:
      "I used React, TypeScript, and Vite because they allowed me to build the assignment with a clear structure while keeping the development process simple.",
    answer: `I used React, TypeScript, and Vite because they allowed me to build the assignment with a clear structure while keeping the development process simple.

I used **React** to divide the UI into reusable components. For example, the discount list, individual discount rows, side cart, and admin page each have their own responsibilities. This makes the code easier to maintain and update.

I used **TypeScript** to define the discount models and interfaces. Since the application handles different discount types, targets, and sources, explicit types help maintain a consistent data structure and catch certain errors during development.

I used **Vite** as the development server and build tool. A build tool basically prepares our application so that it can run efficiently during development and be deployed to production.

During development, Vite starts a local server so I can run the application in my browser. When I make changes to a component, it updates the page quickly without requiring a full reload in many cases. This makes the development process faster.

When the application is ready for deployment, Vite bundles the required JavaScript, CSS, and other assets, optimizes them, and generates the production files using the \`vite build\` command. These files can then be deployed to a web server.

So, I used Vite because it provides a fast development experience and a straightforward way to prepare the React application for production.

I kept the discount calculations in separate utility functions instead of mixing them with the React components. This keeps the business logic independent of the UI and makes it easier to test.

For predefined discount data, I used a mock API layer with \`localStorage\` persistence. This was suitable for the assignment because it allowed the application to manage discount data without requiring a separate backend service.

Finally, I used **Vitest** to run automated tests for the discount calculations, data management, and important application behavior. I also used ESLint to help maintain code quality.

Overall, I chose a stack that was appropriate for the assignment's scope: React for the UI, TypeScript for type safety, Vite for development and builds, and Vitest for automated testing.`,
    relatedFiles: [
      "vite.config.ts",
      "src/types/discount.ts",
      "src/utils/discountCalculator.ts",
      "src/api/discountsApi.ts",
      "src/utils/discountCalculator.test.ts",
      "eslint.config.js",
    ],
  },
  {
    id: "sqa-003",
    category: "System Flow & Lifecycle",
    question: "How does the application work from start to finish?",
    preview:
      "This application is a discount management and price calculation application where users select discounts for a product, see real-time price changes, and admins manage predefined offers.",
    answer: `So, basically, this application is a discount management and price calculation application. The user can select discounts for a product and immediately see how those discounts affect the price. There is also an admin section where predefined discounts can be managed.

When the application starts, the entry point is \`src/App.tsx\`. It determines which part of the application should be displayed based on the current URL. If the path is \`/admin\`, it renders the admin page; otherwise, it renders the customer checkout interface.

On the checkout side, the application loads the predefined discount data through the API layer. The initial data is defined in \`src/api/mockData.ts\`, and \`src/api/discountsApi.ts\` handles retrieving and updating that data using localStorage.

The discount list is displayed using \`src/components/discounts/DiscountList.tsx\`, and each individual discount is rendered by \`src/components/discounts/DiscountRow.tsx\`. When the user selects or deselects a discount, the application updates the selected discount state.

The selected discounts are then used by the pricing calculation functions in \`src/utils/discountCalculator.ts\`. I kept those calculations separate from the UI, so the components don't need to contain the actual pricing formulas.

The \`src/components/discounts/SideCart.tsx\` component displays the price breakdown. It shows the relevant totals, savings, and the effect of one-time and monthly discounts. When the selected discounts change, the calculations run again and the displayed totals update.

The admin flow works a little differently. The admin can manage predefined discounts, and changes are saved through the same data-management layer. The subscription mechanism helps other parts of the application respond to those changes, including the checkout interface.

So, the complete flow is: the application loads the data, the user selects discounts, the state is updated, the calculation functions calculate the new prices, and the side cart displays the result. The admin page provides another way to manage the predefined discount data.

The main thing I focused on was keeping the data, calculations, and UI separate, so each part has a clear responsibility.`,
    relatedFiles: [
      "src/App.tsx",
      "src/api/mockData.ts",
      "src/api/discountsApi.ts",
      "src/components/discounts/DiscountList.tsx",
      "src/components/discounts/DiscountRow.tsx",
      "src/utils/discountCalculator.ts",
      "src/components/discounts/SideCart.tsx",
      "src/components/admin/AdminPage.tsx",
    ],
  },
  {
    id: "sqa-004",
    category: "State Management",
    question: "How did you manage state in React, and how do components communicate with each other?",
    preview:
      "I managed the application state mainly at the top level in App.tsx to keep a single source of truth connecting the discount list with the side cart via props and callbacks.",
    answer: `I managed the application state mainly at the top level in \`src/App.tsx\`, because that component connects the discount list with the side cart.

For example, when a user selects a discount, I need to remember which discounts are selected. I keep track of the selected discount IDs, rather than treating each discount row as an independent source of truth. That way, the application has one place to determine which discounts are currently applied.

React components communicate through props and callback functions. The parent component passes the necessary data down to its child components, and when a child needs to notify the parent about an action, it calls a callback provided through props.

For example, the discount list displays the available discounts, and the individual discount row handles the interaction for a particular discount. When the user changes the selection, that action can be passed back to the parent. The parent updates the state, and React renders the components again using the updated values.

The side cart uses the selected discounts and product pricing information to display the updated calculation. This is important because I don't want the discount list and side cart to maintain separate, potentially conflicting versions of the selected discounts.

There is also a different kind of state for predefined discount data. That data is managed through the API layer and localStorage, with a subscription mechanism to notify interested parts of the application when it changes.

So, I use React state for the current UI and selection flow, and the API layer for the predefined discount data that needs to persist. I didn't introduce Redux or another global state library because the application was small enough to manage with the existing React architecture.`,
    relatedFiles: [
      "src/App.tsx",
      "src/components/discounts/DiscountList.tsx",
      "src/components/discounts/DiscountRow.tsx",
      "src/components/discounts/SideCart.tsx",
      "src/api/discountsApi.ts",
    ],
  },
  {
    id: "sqa-005",
    category: "Architecture & Design",
    question: "Why did you separate the business logic, API layer, and UI components?",
    preview:
      "I separated these parts because they solve different problems: pricing calculations, persistent data storage, and rendering UI components each have distinct responsibilities.",
    answer: `I separated these parts because they solve different problems, and I didn't want one component to be responsible for everything.

The business logic is in \`src/utils/discountCalculator.ts\`. Its responsibility is to calculate prices and discount totals. It shouldn't need to know whether the result is being displayed in a table, a modal, or a side cart.

The API layer is in \`src/api/discountsApi.ts\`. Its responsibility is to manage the predefined discount data, including retrieving, updating, and persisting it. In this assignment, it uses localStorage instead of communicating with a real backend.

The UI components are responsible for displaying the information and handling user interactions. For example, \`src/components/discounts/DiscountRow.tsx\` deals with an individual discount row, while \`src/components/discounts/SideCart.tsx\` displays the price summary.

The advantage is that I can change one part without unnecessarily changing the others. If I need to adjust the discount calculation, I can work in the utility functions. If I replace localStorage with a REST API later, I can focus on the data-management layer. And if I change the layout of the side cart, I shouldn't need to rewrite the calculation formulas.

It also makes testing easier. I can test the calculation functions independently of React, and I can test the UI separately to check whether it displays the expected information.

So, the main reason was separation of responsibilities. It makes the application easier to understand, maintain, and extend.`,
    relatedFiles: [
      "src/utils/discountCalculator.ts",
      "src/api/discountsApi.ts",
      "src/components/discounts/DiscountRow.tsx",
      "src/components/discounts/SideCart.tsx",
    ],
  },
  {
    id: "sqa-006",
    category: "Pricing & Calculation",
    question: "How does your discount calculation logic work?",
    preview:
      "Pricing logic in discountCalculator.ts checks discount types, computes deductions for fixed and percentage amounts, chains multiple discounts, and handles monthly durations.",
    answer: `I kept the discount calculation logic in \`src/utils/discountCalculator.ts\`, because pricing is one of the main business rules of this application.

The basic idea is that the application takes the original price, checks the discount type, calculates the discount amount, and then subtracts that amount from the price.

For a percentage discount, the discount amount is calculated as the price multiplied by the percentage divided by 100. For example, if the product price is €1,000 and the discount is 10%, the discount amount is €100, so the discounted price becomes €900.

For a fixed discount, the discount value represents an amount rather than a percentage. So, if the price is €1,000 and the fixed discount is €100, the result is €900.

I also have a function called \`calculatePriceWithDiscounts\`, which applies a collection of discounts to a price. This allows the application to calculate the combined effect of multiple discounts rather than handling only one discount at a time.

For monthly recurring discounts, I use \`calculateMonthlyTotals\`. That function considers the discount duration and calculates the promotional-period total and the remaining months in the year.

One important point is that I kept these functions independent of React. They receive the relevant data and return calculation results, so they can be reused wherever the application needs pricing information.

That also makes them easier to test. I can pass in a price and a discount, then verify whether the function returns the expected result without rendering the entire application.`,
    relatedFiles: [
      "src/utils/discountCalculator.ts",
      "src/utils/discountCalculator.test.ts",
      "src/types/discount.ts",
    ],
  },
  {
    id: "sqa-007",
    category: "Pricing & Calculation",
    question: "What happens when multiple discounts are applied to the same product?",
    preview:
      "Multiple discounts are applied sequentially, meaning each subsequent discount is calculated against the remaining price rather than summing raw percentage values together.",
    answer: `In my implementation, multiple discounts are applied sequentially. That means the next discount is calculated using the price remaining after the previous discount, rather than calculating every percentage from the original price.

For example, suppose the original price is €1,000 and the user applies a 10% discount first. The price becomes €900.

Now, if the user applies another 5% discount, that 5% is calculated on €900. So, the second discount is €45, and the final price becomes €855.

This is different from simply adding 10% and 5% together and applying a 15% discount to the original price. A 15% discount on €1,000 would result in €850, not €855.

The sequential approach is implemented in the discount calculation utility. It lets the application process the selected discounts one after another and update the running price.

The order matters because each percentage discount is applied to the price left by the previous calculation. In this implementation, the calculation follows the order in which the discounts are provided to the function.

So, when I explain this in an interview, I would emphasize that the application doesn't simply add the percentages together. It applies the discounts successively to calculate the final price.`,
    relatedFiles: [
      "src/utils/discountCalculator.ts",
      "src/utils/discountCalculator.test.ts",
      "src/types/discount.ts",
    ],
  },
  {
    id: "sqa-008",
    category: "Pricing & Calculation",
    question: "How do one-time discounts and monthly recurring discounts work differently?",
    preview:
      "One-time discounts deduct from the upfront product price, whereas monthly recurring discounts deduct from monthly subscription costs over a defined promotional duration.",
    answer: `The main difference is that a one-time discount affects the upfront product price, while a monthly discount affects the recurring monthly cost for a particular duration.

For a one-time discount, the application calculates the discount against the upfront price. For example, if the original price is €1,000 and the user applies a 3% one-time discount, the discount is €30, so the upfront price becomes €970.

A monthly recurring discount works on the monthly price instead. It can also have a duration, so the promotional discount applies only for a certain number of months.

For example, suppose the monthly price is €10 and a 25% monthly discount is available for three months. The discounted monthly amount is €7.50. For those three months, the total is €22.50.

After the promotional period, the monthly price returns to €10. If we're calculating the cost for a full 12-month period, the remaining nine months cost €90. That makes the first-year recurring total €112.50.

If the customer also applies the €30 one-time discount in our example, the combined first-year cost would be €970 plus €112.50, which is €1,082.50.

The application keeps these calculations separate because upfront savings and recurring savings represent different parts of the total cost.

In the code, \`calculateMonthlyTotals\` uses the discount duration to calculate the promotional months and the remaining months in the year. This allows the side cart to show the cost breakdown instead of just displaying one discounted number.`,
    relatedFiles: [
      "src/utils/discountCalculator.ts",
      "src/components/discounts/SideCart.tsx",
      "src/types/discount.ts",
    ],
  },
  {
    id: "sqa-009",
    category: "Edge Cases & Hardening",
    question: "How do you handle edge cases in discount calculations?",
    preview:
      "I evaluate non-standard inputs such as zero discounts, fixed values larger than price, and duration boundaries, identifying where production clamping and validation should be added.",
    answer: `When I think about edge cases, I look at what happens when the input values aren't the normal values we expect.

For example, a percentage discount could be zero, a fixed discount could be larger than the product price, or a monthly discount could have a duration that doesn't make sense. I also need to consider what happens when multiple discounts are applied one after another.

In the current implementation, I handle the supported discount types separately, and the monthly calculation uses the discount duration to determine the promotional period and the remaining months of the year.

However, I wouldn't claim that every possible edge case is already handled. For example, the current \`calculateDiscountedPrice\` implementation subtracts the calculated discount amount from the price without explicitly clamping the result to zero. So, if a fixed discount exceeds the remaining price, the result could become negative.

If I were hardening this for production, I would validate discount values before applying them, enforce valid duration and percentage ranges, and ensure that the final payable price cannot go below zero.

I would also add tests for those boundary cases, because testing only normal values isn't enough for pricing logic.

So, my approach is to identify the business rules, enforce them at the right layer, and cover both normal scenarios and boundary conditions with automated tests.`,
    relatedFiles: [
      "src/utils/discountCalculator.ts",
      "src/utils/discountCalculator.test.ts",
      "src/types/discount.ts",
    ],
  },
  {
    id: "sqa-010",
    category: "Data Modeling",
    question: "What is the difference between predefined discounts and manually created discounts?",
    preview:
      "Predefined discounts are system-configured offers managed in storage and admin, while manual discounts are custom values created directly by users during checkout.",
    answer: `In this application, I have two ways of working with discounts: predefined discounts and manually created discounts.

Predefined discounts are the discounts that are already available in the application. The initial data comes from \`src/api/mockData.ts\`, and the application manages those discounts through the API layer. They can also be managed from the admin page.

Manual discounts are created by the user directly through the checkout interface. Instead of selecting an existing predefined discount, the user can enter the discount details through the manual discount creation flow.

I kept the distinction in the data model using the discount source information. This helps the application identify where a discount came from and determine how it should be handled in the UI.

For example, the predefined discount flow supports administrative management, while the manual discount flow allows the user to create a discount for the current checkout scenario.

I also use TypeScript interfaces to keep the discount data consistent. The predefined discount type extends the common discount structure with additional information, such as whether the discount is enabled.

So, the main difference is the lifecycle: predefined discounts are managed as part of the application's available discount data, while manually created discounts come from the user's checkout interaction.`,
    relatedFiles: [
      "src/types/discount.ts",
      "src/api/mockData.ts",
      "src/api/discountsApi.ts",
      "src/components/admin/AdminPage.tsx",
    ],
  },
  {
    id: "sqa-011",
    category: "Admin & Synchronization",
    question: "How does the admin page update predefined discounts, and how do those changes reach checkout?",
    preview:
      "The admin page calls discountsApi.ts to update localStorage and trigger in-memory subscriptions, allowing checkout components to reflect changes without a full page reload.",
    answer: `The admin page is responsible for managing predefined discounts. I kept that functionality in \`src/components/admin/AdminPage.tsx\`, rather than mixing administrative controls into the checkout components.

When an admin makes a change, the admin interface calls the data-management functions in \`src/api/discountsApi.ts\`. That layer handles updating the predefined discount data and persisting it in localStorage.

I also implemented a subscription mechanism for predefined discount changes. The idea is that components interested in that data can subscribe to updates instead of having to reload the entire application whenever a discount changes.

When a change is published, the subscribed parts of the application can refresh their data and update their React state. React then renders the UI using the latest information.

For example, if an admin disables a predefined discount, the checkout interface can receive the updated predefined discount data and reflect the disabled state.

The important thing is that the admin page doesn't directly manipulate the internal state of the checkout components. Both parts communicate through the shared data-management layer.

That makes the implementation easier to maintain because the admin and checkout have separate UI responsibilities while sharing the same predefined discount data source.`,
    relatedFiles: [
      "src/components/admin/AdminPage.tsx",
      "src/api/discountsApi.ts",
      "src/App.tsx",
      "src/components/discounts/DiscountList.tsx",
    ],
  },
  {
    id: "sqa-012",
    category: "UI & Component Interactions",
    question: "How did you implement editing for the predefined 5% discount?",
    preview:
      "Editing allows modifying the percentage value up to a 5% cap, previews the calculation against a sample €1,000 price, and updates the record while preserving its stable ID.",
    answer: `I implemented the edit flow so that an existing predefined discount can be modified without treating it as a completely new discount.

The user can open the edit interface using the edit action associated with that discount. In this particular flow, I restricted editing to the percentage value, with a maximum value of 5%. This keeps the edit operation within the requirement instead of allowing every field to be changed.

I also included a price preview using a static €1,000 example. That allows the user to see how changing the percentage affects the discounted price before saving the change.

When the update is saved, the application updates the existing discount record rather than creating a new discount with a different identity. Preserving the same ID is important because other parts of the application can refer to the discount using that ID.

The update then goes through the predefined discount data-management layer, which persists the change and notifies subscribers.

So, the main things I considered were restricting the allowed edit, showing the user the pricing impact, and preserving the identity of the existing discount.`,
    relatedFiles: [
      "src/components/discounts/DiscountRow.tsx",
      "src/components/discounts/DiscountModal.tsx",
      "src/api/discountsApi.ts",
      "src/components/discounts/EditablePredefinedDiscount.test.tsx",
    ],
  },
  {
    id: "sqa-013",
    category: "Architecture & Storage",
    question: "Why did you use localStorage instead of a real backend?",
    preview:
      "localStorage provided client-side persistence across refreshes for the scope of the assignment, encapsulated behind an async API layer ready for future backend migration.",
    answer: `I used localStorage because the assignment needed a way to manage predefined discount data, but a separate backend service wasn't necessary for demonstrating the required functionality.

The initial discount data is defined in \`src/api/mockData.ts\`. The API layer in \`src/api/discountsApi.ts\` provides functions for retrieving and updating the data, while localStorage allows changes to persist in the browser across page reloads.

I kept this behind an API-like layer intentionally. The UI components don't need to know the low-level details of how the data is stored. They can call the data-management functions instead.

That also gives me a cleaner migration path. If I later replace localStorage with a REST API and database, I can change the implementation of the data-management layer while keeping much of the UI and calculation logic intact.

But localStorage has limitations. The data is stored in the user's browser, it isn't a central source of truth, and it doesn't provide server-side validation or access control. It also shouldn't be treated as a secure place to store sensitive information.

For a real application where discounts affect actual transactions, I would move authoritative discount management and pricing validation to a backend with a database.

So, I chose localStorage as a practical solution for the scope of the assignment, not as a replacement for a production backend.`,
    relatedFiles: [
      "src/api/mockData.ts",
      "src/api/discountsApi.ts",
      "src/utils/predefinedDiscounts.ts",
    ],
  },
  {
    id: "sqa-014",
    category: "Browser & Synchronization",
    question: "How does the application synchronize predefined discount changes across browser tabs?",
    preview:
      "Synchronization pairs an in-memory pub/sub listener for the active tab with the window 'storage' event to propagate localStorage modifications across separate tabs.",
    answer: `I used two related mechanisms to handle updates to predefined discounts: a subscription mechanism within the application and the browser's storage event for changes made in another tab.

The subscription mechanism allows parts of the same application to listen for changes. When the predefined discount data is updated through the API layer, subscribers can be notified and refresh their state.

For changes made in a different browser tab, the browser provides the \`storage\` event. When one tab updates localStorage, another tab on the same origin can receive that event and react to the updated value.

For example, if I open the checkout in one tab and the admin page in another tab, and then update a predefined discount from the admin tab, the checkout tab can detect the storage change and refresh its data.

One important browser detail is that the \`storage\` event is fired in other documents sharing that storage area, not in the same window that made the change. That's why the same-tab subscription mechanism and the cross-tab storage event solve different parts of the problem.

This approach helps keep the displayed predefined discount data synchronized without requiring a backend or continuously polling for changes.

However, this is browser-level synchronization. In a production application with multiple users and devices, I would use a backend as the authoritative source and fetch or subscribe to server-side updates.`,
    relatedFiles: [
      "src/api/discountsApi.ts",
      "src/api/discountsApi.test.ts",
      "src/App.tsx",
    ],
  },
  {
    id: "sqa-015",
    category: "Testing & Quality Assurance",
    question: "How did you test the application, and why did you use Vitest?",
    preview:
      "Vitest runs unit tests for pure pricing calculations, storage synchronization tests with mocked globals, and React Testing Library tests for critical UI components.",
    answer: `I used Vitest because the assignment uses Vite, and Vitest fits naturally into that development setup. It provides a test runner that works well with TypeScript and modern JavaScript projects.

I focused on testing the important parts of the application rather than relying only on manually checking the UI.

First, I tested the discount calculation logic. For example, I checked how percentage and fixed discounts affect the price, and how multiple discounts and monthly totals are calculated.

I also tested the data-management layer because it handles predefined discount updates and localStorage persistence. That part needs to behave correctly when discounts are retrieved or changed.

I added tests for important UI behavior as well, such as price rendering and interactions. The idea was to check not just whether a function returns the expected value, but also whether the application displays the expected result.

The project defines a \`test\` script in \`package.json\` that runs \`vitest run\`, so the tests can be executed from the command line without starting the development server.

I see testing as particularly important for a pricing application because a small calculation mistake can affect the final amount displayed to the user.

If I extended the project further, I would also add more explicit boundary tests for invalid discount values, discounts exceeding the price, and different monthly durations. I would include more end-to-end tests to verify the complete journey from selecting a discount to seeing the final total.

So, I used Vitest to make the important business rules and application behavior repeatably testable instead of relying only on manual verification.`,
    relatedFiles: [
      "src/utils/discountCalculator.test.ts",
      "src/api/discountsApi.test.ts",
      "src/components/discounts/SideCart.test.tsx",
      "src/components/discounts/EditablePredefinedDiscount.test.tsx",
      "vite.config.ts",
    ],
  },
];

export function getSalesdockQAItems(): SalesdockQAItem[] {
  return SALESDOCK_QA_ITEMS;
}
