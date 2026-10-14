export interface SalesdockQAItem {
  id: string;
  category: string;
  question: string;
  preview: string;
  answer: string;
  answerMl?: string;
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
    answerMl: `ഈ assignment തുടങ്ങിയപ്പോൾ, എല്ലാ കാര്യങ്ങളും ഒരൊറ്റ component-ൽ ചെയ്യുന്നതിന് പകരം, ആദ്യം requirements വ്യക്തമായി മനസ്സിലാക്കുകയും പിന്നീട് ആപ്ലിക്കേഷനെ ചെറിയ, manageable ഭാഗങ്ങളായി വിഭജിക്കുകയുമായിരുന്നു എന്റെ approach.

ആദ്യം, ഞാൻ data structure നിർവ്വചിച്ചു.

Discount types-ഉം interfaces-ഉം define ചെയ്യാൻ ഞാൻ \`src/types/discount.ts\` ഉണ്ടാക്കി. ഇത് ആപ്ലിക്കേഷനിലുടനീളം discounts, product prices, discount results എന്നിവയ്ക്ക് വ്യക്തവും കൃത്യവുമായ structure നൽകി.

രണ്ടാമതായി, business logic-നെ UI-ൽ നിന്ന് വേർതിരിച്ചു.

Percentage discounts, fixed discounts, monthly discount totals എന്നിവ കണക്കാക്കാൻ \`src/utils/discountCalculator.ts\` ഉണ്ടാക്കി. ഇത് pricing calculations-നെ React components-ൽ നിന്ന് സ്വതന്ത്രമായി നിർത്തുകയും അവ ടെസ്റ്റ് ചെയ്യുന്നത് എളുപ്പമാക്കുകയും ചെയ്യുന്നു.

മൂന്നാമതായി, predefined discount data-യും അതിന്റെ management layer-ഉം തയ്യാറാക്കി.

പ്രാരംഭ discount data-ക്കായി \`src/api/mockData.ts\` ഉപയോഗിച്ചു, local storage-ൽ നിന്ന് discounts എടുക്കാനും അപ്‌ഡേറ്റ് ചെയ്യാനും സൂക്ഷിക്കാനും \`src/api/discountsApi.ts\` ഉപയോഗിച്ചു. മാറ്റങ്ങൾ ആപ്ലിക്കേഷന്റെ മറ്റ് ഭാഗങ്ങളിൽ തത്സമയം പ്രതിഫലിക്കാൻ ഞാൻ ഒരു subscription mechanism-ഉം ചേർത്തു.

നാലാമതായി, പ്രധാന ആപ്ലിക്കേഷൻ flow ബന്ധിപ്പിച്ചു.

\`src/App.tsx\`-ൽ apply ചെയ്ത discount ID-കൾ കൈകാര്യം ചെയ്യുകയും discount list-നെ side cart-മായി കണക്ട് ചെയ്യുകയും ചെയ്തു. URL path \`/admin\` ആകുമ്പോൾ admin page render ചെയ്യാനും ഇത് സഹായിക്കുന്നു.

അഞ്ചാമതായി, UI-നെ reusable components ആയി വേർതിരിച്ചു.

Discount list-നായി \`src/components/discounts/DiscountList.tsx\`, ഓരോ discount row-വിനായി \`src/components/discounts/DiscountRow.tsx\`, price overview-വിനായി \`src/components/discounts/SideCart.tsx\` എന്നിവ ഉപയോഗിച്ചു. Admin functionality \`src/components/admin/AdminPage.tsx\`-ൽ വെച്ചു.

അവസാനമായി, ടെസ്റ്റുകൾ ചേർക്കുകയും production build പരിശോധിക്കുകയും ചെയ്തു.

Discount calculations, data management, API behavior, പ്രധാന UI interactions എന്നിവയ്ക്കായി ഞാൻ tests തയ്യാറാക്കി. കോഡ് modular ആയും, maintain ചെയ്യാനും verify ചെയ്യാനും എളുപ്പമാക്കുക എന്നതായിരുന്നു ഇതിന്റെ ലക്ഷ്യം.

മൊത്തത്തിൽ, data model, business logic, data management, UI components എന്നിവ വേർതിരിച്ചതിലൂടെ ഓരോ ഭാഗത്തിനും വ്യക്തമായ ഉത്തരവാദിത്തം നൽകാൻ സാധിച്ചു.`,
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
    answerMl: `ലളിതമായ development പ്രക്രിയ നിലനിർത്തിക്കൊണ്ടുതന്നെ വ്യക്തമായ ഒരു structure-ൽ ഈ assignment നിർമ്മിക്കാൻ സഹായിക്കും എന്നതിനാലാണ് ഞാൻ React, TypeScript, Vite എന്നിവ തിരഞ്ഞെടുത്തത്.

UI-നെ reusable components ആയി തിരിക്കാനാണ് ഞാൻ **React** ഉപയോഗിച്ചത്. ഉദാഹരണത്തിന് discount list, individual discount rows, side cart, admin page എന്നിവയ്ക്ക് അവരുടേതായ വ്യക്തമായ responsibilities ഉണ്ട്. ഇത് കോഡ് പരിപാലിക്കാനും അപ്‌ഡേറ്റ് ചെയ്യാനും എളുപ്പമാക്കുന്നു.

Discount models-ഉം interfaces-ഉം define ചെയ്യാൻ ഞാൻ **TypeScript** ഉപയോഗിച്ചു. ഈ ആപ്ലിക്കേഷനിൽ പലതരത്തിലുള്ള discount types, targets, sources എന്നിവ കൈകാര്യം ചെയ്യുന്നതിനാൽ, explicit types ഉപയോഗിക്കുന്നത് കൃത്യമായ data structure നിലനിർത്താനും development സമയത്ത് തെറ്റുകൾ കണ്ടെത്താനും സഹായിക്കുന്നു.

Development server ആയും build tool ആയും ഞാൻ **Vite** ഉപയോഗിച്ചു. ഒരു build tool അടിസ്ഥാനപരമായി നമ്മുടെ ആപ്ലിക്കേഷനെ development സമയത്ത് കാര്യക്ഷമമായി പ്രവർത്തിപ്പിക്കാനും production-ലേക്ക് deploy ചെയ്യാനും തയ്യാറാക്കുന്നു.

Development സമയത്ത്, ബ്രൗസറിൽ റൺ ചെയ്യാൻ Vite ഒരു local server ആരംഭിക്കുന്നു. ഒരു component-ൽ എന്തെങ്കിലും മാറ്റം വരുത്തുമ്പോൾ, പലപ്പോഴും full reload ആവശ്യമില്ലാതെ തന്നെ അത് പേജ് വളരെ വേഗത്തിൽ അപ്‌ഡേറ്റ് ചെയ്യുന്നു. ഇത് development വേഗത്തിലാക്കുന്നു.

Deployment-ന് തയ്യാറാകുമ്പോൾ, ആവശ്യമായ JavaScript, CSS, മറ്റ് assets എന്നിവ bundle ചെയ്യുകയും ഒപ്റ്റിമൈസ് ചെയ്യുകയും \`vite build\` കമാൻഡ് വഴി production files നിർമ്മിക്കുകയും ചെയ്യുന്നു. ഈ ഫയലുകൾ പിന്നീട് വെബ് സെർവറിൽ deploy ചെയ്യാൻ കഴിയും.

അതുകൊണ്ട്, വേഗതയേറിയ development അനുഭവവും production-നായി React ആപ്ലിക്കേഷൻ തയ്യാറാക്കാനുള്ള ലളിതമായ വഴിയും Vite നൽകുന്നു.

Discount calculations ഞാൻ React components-മായി കൂട്ടിക്കലർത്താതെ പ്രത്യേക utility functions-ൽ സൂക്ഷിച്ചു. ഇത് business logic-നെ UI-ൽ നിന്ന് വേർതിരിക്കാനും എളുപ്പത്തിൽ ടെസ്റ്റ് ചെയ്യാനും സഹായിക്കുന്നു.

Predefined discount data-ക്കായി, \`localStorage\` persistence ഉള്ള ഒരു mock API layer ആണ് ഉപയോഗിച്ചത്. ഒരു പ്രത്യേക backend service ആവശ്യമില്ലാതെ തന്നെ discount data കൈകാര്യം ചെയ്യാൻ സാധിച്ചതിനാൽ ഈ assignment-ന് ഇത് അനുയോജ്യമായിരുന്നു.

അവസാനമായി, discount calculations, data management, പ്രധാന application behavior എന്നിവ automated ആയി ടെസ്റ്റ് ചെയ്യാൻ **Vitest** ഉപയോഗിച്ചു. കോഡിന്റെ നിലവാരം നിലനിർത്താൻ ESLint-ഉം ഉപയോഗിച്ചു.

മൊത്തത്തിൽ, assignment-ന്റെ ആവശ്യങ്ങൾക്ക് തികച്ചും അനുയോജ്യമായ stack ആണ് ഞാൻ തിരഞ്ഞെടുത്തത്: UI-ക്കായി React, type safety-ക്കായി TypeScript, development-നും builds-നുമായി Vite, automated testing-നായി Vitest.`,
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
    answerMl: `അടിസ്ഥാനപരമായി ഈ ആപ്ലിക്കേഷൻ ഒരു discount management-ഉം price calculation-ഉം നടത്തുന്ന സംവിധാനമാണ്. ഉപയോക്താവിന് ഒരു ഉൽപ്പന്നത്തിനായി discounts തിരഞ്ഞെടുക്കാനും, അത് വിലയെ എങ്ങനെ ബാധിക്കുന്നുവെന്ന് തത്സമയം കാണാനും കഴിയും. കൂടാതെ predefined discounts കൈകാര്യം ചെയ്യാനുള്ള ഒരു admin വിഭാഗവുമുണ്ട്.

ആപ്ലിക്കേഷൻ ആരംഭിക്കുമ്പോൾ പ്രധാന entry point \`src/App.tsx\` ആണ്. നിലവിലെ URL അടിസ്ഥാനമാക്കി ഏത് ഭാഗമാണ് കാണിക്കേണ്ടതെന്ന് ഇത് തീരുമാനിക്കുന്നു. Path \`/admin\` ആണെങ്കിൽ admin page കാണിക്കുന്നു; അല്ലെങ്കിൽ സാധാരണ customer checkout interface കാണിക്കുന്നു.

Checkout ഭാഗത്ത്, API layer വഴി ആപ്ലിക്കേഷൻ predefined discount data ലോഡ് ചെയ്യുന്നു. പ്രാരംഭ ഡാറ്റ \`src/api/mockData.ts\`-ൽ നിർവ്വചിച്ചിരിക്കുന്നു, localStorage ഉപയോഗിച്ച് ആ ഡാറ്റ എടുക്കാനും അപ്‌ഡേറ്റ് ചെയ്യാനും \`src/api/discountsApi.ts\` കൈകാര്യം ചെയ്യുന്നു.

Discount list കാണിക്കുന്നത് \`src/components/discounts/DiscountList.tsx\` ഉപയോഗിച്ചാണ്, ഓരോ discount-ഉം render ചെയ്യുന്നത് \`src/components/discounts/DiscountRow.tsx\` ആണ്. ഉപയോക്താവ് ഒരു discount select ചെയ്യുകയോ deselect ചെയ്യുകയോ ചെയ്യുമ്പോൾ, ആപ്ലിക്കേഷൻ selected discount state അപ്‌ഡേറ്റ് ചെയ്യുന്നു.

തിരഞ്ഞെടുത്ത discounts പിന്നീട് \`src/utils/discountCalculator.ts\`-ലെ pricing calculation functions ഉപയോഗിച്ച് കണക്കാക്കുന്നു. ഞാൻ ഈ calculations UI-ൽ നിന്ന് മാറ്റി നിർത്തിയതിനാൽ components-ൽ pricing formulas എഴുതേണ്ടി വരുന്നില്ല.

\`src/components/discounts/SideCart.tsx\` component വിലയുടെ പൂർണ്ണമായ breakdown കാണിക്കുന്നു. ഇത് ആകെ തുക, ആകെ ലഭിച്ച savings, one-time ഒപ്പം monthly discounts ഉണ്ടാക്കുന്ന മാറ്റങ്ങൾ എന്നിവ വ്യക്തമാക്കുന്നു. തിരഞ്ഞെടുത്ത discounts മാറുമ്പോൾ calculations വീണ്ടും നടക്കുകയും പുതിയ തുകകൾ പ്രദർശിപ്പിക്കുകയും ചെയ്യുന്നു.

Admin flow അല്പം വ്യത്യസ്തമായാണ് പ്രവർത്തിക്കുന്നത്. Admin-ന് predefined discounts നിയന്ത്രിക്കാൻ കഴിയും, മാറ്റങ്ങൾ ഇതേ data-management layer വഴി സേവ് ചെയ്യുന്നു. Subscription mechanism വഴി ഈ മാറ്റങ്ങൾ checkout interface ഉൾപ്പെടെയുള്ള ആപ്ലിക്കേഷന്റെ മറ്റ് ഭാഗങ്ങളിലേക്ക് ഉടൻ എത്തിക്കുന്നു.

അതിനാൽ പൂർണ്ണമായ flow ഇതാണ്: ആപ്ലിക്കേഷൻ ഡാറ്റ ലോഡ് ചെയ്യുന്നു, ഉപയോക്താവ് discounts തിരഞ്ഞെടുക്കുന്നു, state അപ്‌ഡേറ്റ് ആകുന്നു, calculation functions പുതിയ വില കണക്കാക്കുന്നു, side cart ഫലം കാണിക്കുന്നു. Predefined discount data നിയന്ത്രിക്കാൻ admin page മറ്റൊരു വഴി നൽകുന്നു.

ഡാറ്റ, കണക്കുകൂട്ടലുകൾ, UI എന്നിവ വേർതിരിച്ചു നിർത്തുക എന്നതിലായിരുന്നു എന്റെ പ്രധാന ശ്രദ്ധ, അതിനാൽ ഓരോ ഭാഗത്തിനും വ്യക്തമായ ഉത്തരവാദിത്തമുണ്ട്.`,
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
    answerMl: `Discount list-നെ side cart-മായി ബന്ധിപ്പിക്കുന്ന component ആയതിനാൽ, ഞാൻ പ്രധാനമായും \`src/App.tsx\` എന്ന top level component-ലാണ് application state കൈകാര്യം ചെയ്തത്.

ഉദാഹരണത്തിന്, ഒരു ഉപയോക്താവ് ഒരു discount തിരഞ്ഞെടുക്കുമ്പോൾ ഏതൊക്കെ discounts ആണ് തിരഞ്ഞെടുത്തതെന്ന് ഓർമ്മിക്കേണ്ടതുണ്ട്. ഓരോ discount row-വിനെയും സ്വതന്ത്രമായ source of truth ആയി കാണുന്നതിന് പകരം, തിരഞ്ഞെടുത്ത discount ID-കൾ മാത്രമാണ് ഞാൻ ട്രാക്ക് ചെയ്യുന്നത്. അതുവഴി നിലവിൽ ഏതൊക്കെ discounts apply ചെയ്തിട്ടുണ്ടെന്ന് കണ്ടെത്താൻ ആപ്ലിക്കേഷനിൽ ഒരൊറ്റ കേന്ദ്രീകൃത ഇടം ഉണ്ടാകുന്നു.

React components പരസ്പരം communicate ചെയ്യുന്നത് props വഴിയും callback functions വഴിയുമാണ്. Parent component ആവശ്യമായ ഡാറ്റ child components-ലേക്ക് താഴേക്ക് അയക്കുന്നു, ഒരു child-ന് എന്തെങ്കിലും മാറ്റം parent-നെ അറിയിക്കണമെങ്കിൽ props വഴി ലഭിച്ച callback വിളിക്കുന്നു.

ഉദാഹരണത്തിന്, discount list ലഭ്യമായ discounts കാണിക്കുന്നു, individual discount row ഓരോ discount-ന്റെയും interaction കൈകാര്യം ചെയ്യുന്നു. ഉപയോക്താവ് ഒരു discount തിരഞ്ഞെടുക്കുമ്പോൾ ആ വിവരം parent-ലേക്ക് തിരികെ നൽകുന്നു. Parent ആ state അപ്‌ഡേറ്റ് ചെയ്യുകയും, മാറിയ മൂല്യങ്ങൾക്കനുസരിച്ച് React വീണ്ടും components render ചെയ്യുകയും ചെയ്യുന്നു.

Side cart തിരഞ്ഞെടുത്ത discounts-ഉം product pricing വിവരങ്ങളും ഉപയോഗിച്ച് അപ്‌ഡേറ്റ് ചെയ്ത തുക കാണിക്കുന്നു. Discount list-ഉം side cart-ഉം പരസ്പരം തെറ്റാനിടയുള്ള രണ്ട് വ്യത്യസ്ത വിവരങ്ങൾ സൂക്ഷിക്കുന്നത് ഒഴിവാക്കാൻ ഇത് വളരെ അത്യാവശ്യമാണ്.

Predefined discount data-ക്കായി മറ്റൊരു തരത്തിലുള്ള state കൂടിയുണ്ട്. ആ ഡാറ്റ API layer വഴിയും localStorage വഴിയുമാണ് കൈകാര്യം ചെയ്യുന്നത്, അതിൽ മാറ്റം വരുമ്പോൾ ആപ്ലിക്കേഷനെ അറിയിക്കാൻ subscription mechanism സഹായിക്കുന്നു.

അതുകൊണ്ട്, നിലവിലെ UI-ക്കും selection flow-വിനുമായി ഞാൻ React state ഉപയോഗിച്ചു, നിലനിൽക്കേണ്ട predefined discount data-ക്കായി API layer ഉപയോഗിച്ചു. നിലവിലെ React architecture കൊണ്ടുതന്നെ ആപ്ലിക്കേഷൻ ഭംഗിയായി നിയന്ത്രിക്കാൻ കഴിഞ്ഞതിനാൽ Redux പോലെയുള്ള മറ്റൊരു global state library ചേർക്കേണ്ടി വന്നില്ല.`,
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
    answerMl: `ഈ ഭാഗങ്ങളെല്ലാം വ്യത്യസ്ത പ്രശ്നങ്ങൾ പരിഹരിക്കുന്നതിനാലും, ഒരൊറ്റ component എല്ലാ കാര്യങ്ങളും കൈകാര്യം ചെയ്യുന്നത് ഒഴിവാക്കാനുമാണ് ഞാൻ ഇവയെ വേർതിരിച്ചത്.

Business logic സ്ഥിതി ചെയ്യുന്നത് \`src/utils/discountCalculator.ts\`-ലാണ്. വിലകളും discount totals-ഉം കൃത്യമായി കണക്കാക്കുക എന്നതാണ് ഇതിന്റെ ഉത്തരവാദിത്തം. ഫലം ഒരു table-ലാണോ, modal-ലാണോ അതോ side cart-ലാണോ കാണിക്കുന്നത് എന്ന് ഈ calculation logic അറിയേണ്ട ആവശ്യമില്ല.

API layer സ്ഥിതി ചെയ്യുന്നത് \`src/api/discountsApi.ts\`-ലാണ്. Predefined discount data എടുക്കുക, അപ്‌ഡേറ്റ് ചെയ്യുക, സൂക്ഷിക്കുക എന്നിവയാണ് ഇതിന്റെ ഉത്തരവാദിത്തം. ഈ assignment-ൽ ഒരു real backend-ന് പകരം ഇത് localStorage ആണ് ഉപയോഗിക്കുന്നത്.

UI components വിവരങ്ങൾ പ്രദർശിപ്പിക്കുന്നതിനും user interactions കൈകാര്യം ചെയ്യുന്നതിനും ഉത്തരവാദികളാണ്. ഉദാഹരണത്തിന് \`src/components/discounts/DiscountRow.tsx\` ഓരോ discount row കൈകാര്യം ചെയ്യുമ്പോൾ, \`src/components/discounts/SideCart.tsx\` വില വിവരങ്ങളുടെ സംഗ്രഹം കാണിക്കുന്നു.

ഒരു ഭാഗത്ത് മാറ്റം വരുത്തുമ്പോൾ അത് ആവശ്യമില്ലാതെ മറ്റ് ഭാഗങ്ങളെ ബാധിക്കില്ല എന്നതാണ് ഇതിന്റെ ഏറ്റവും വലിയ നേട്ടം. Discount കണക്കുകൂട്ടലുകളിൽ മാറ്റം വരുത്തണമെങ്കിൽ utility functions-ൽ മാത്രം ജോലി ചെയ്താൽ മതി. പിന്നീട് localStorage-ന് പകരം ഒരു REST API കൊണ്ടുവരുമ്പോൾ data-management layer-ൽ മാത്രം ശ്രദ്ധിക്കാം. ഇനി side cart-ന്റെ ഡിസൈൻ മാറ്റിയാൽ calculation formulas വീണ്ടും എഴുതേണ്ടതില്ല.

ഇത് ടെസ്റ്റിംഗ് വളരെ എളുപ്പമാക്കുന്നു. React-ൽ നിന്ന് സ്വതന്ത്രമായി calculation functions ടെസ്റ്റ് ചെയ്യാം, കൂടാതെ UI പ്രതീക്ഷിച്ച രീതിയിൽ വിവരങ്ങൾ കാണിക്കുന്നുണ്ടോ എന്ന് പ്രത്യേകമായി ടെസ്റ്റ് ചെയ്യാം.

അതുകൊണ്ട്, separation of responsibilities (ഉത്തരവാദിത്തങ്ങളുടെ വേർതിരിവ്) ആയിരുന്നു പ്രധാന കാരണം. ഇത് ആപ്ലിക്കേഷനെ മനസ്സിലാക്കാനും, പരിപാലിക്കാനും, ഭാവിയിൽ വികസിപ്പിക്കാനും വളരെ എളുപ്പമാക്കുന്നു.`,
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
    answerMl: `Pricing എന്നത് ഈ ആപ്ലിക്കേഷന്റെ പ്രധാനപ്പെട്ട ഒരു business rule ആയതിനാൽ, discount calculation logic ഞാൻ \`src/utils/discountCalculator.ts\`-ലാണ് സൂക്ഷിച്ചിരിക്കുന്നത്.

യഥാർത്ഥ വില എടുക്കുക, discount type പരിശോധിക്കുക, discount തുക കണ്ടെത്തുക, തുടർന്ന് ആ തുക യഥാർത്ഥ വിലയിൽ നിന്ന് കുറയ്ക്കുക എന്നതാണ് ഇതിന്റെ അടിസ്ഥാന ആശയം.

Percentage discount-ൽ, discount amount കണക്കാക്കുന്നത് വിലയെ percentage കൊണ്ട് ഗുണിച്ച് 100 കൊണ്ട് ഹരിച്ചാണ്. ഉദാഹരണത്തിന്, ഉൽപ്പന്ന വില €1,000-ഉം discount 10%-ഉം ആണെങ്കിൽ, discount തുക €100 ആയിരിക്കും, അതിനാൽ പുതിയ വില €900 ആകും.

Fixed discount-ൽ, discount value എന്നത് percentage-ന് പകരം നേരിട്ടുള്ള ഒരു തുകയായിരിക്കും. ഉദാഹരണത്തിന്, വില €1,000-ഉം fixed discount €100-ഉം ആണെങ്കിൽ ഫലം €900 ആയിരിക്കും.

ഒന്നിലധികം discounts ഒരുമിച്ച് apply ചെയ്യാൻ സഹായിക്കുന്ന \`calculatePriceWithDiscounts\` എന്നൊരു function-ഉം ഞാൻ നിർമ്മിച്ചിട്ടുണ്ട്. ഇത് ഓരോ discount മാത്രമായി കൈകാര്യം ചെയ്യുന്നതിന് പകരം പല discounts ചേരുമ്പോഴുണ്ടാകുന്ന ആകെ ഫലം കണക്കാക്കാൻ സഹായിക്കുന്നു.

Monthly recurring discounts-നായി ഞാൻ \`calculateMonthlyTotals\` ഉപയോഗിക്കുന്നു. ഈ function discount-ന്റെ duration കണക്കിലെടുത്ത് promotional കാലയളവിലെ തുകയും വർഷത്തിലെ ബാക്കി മാസങ്ങളിലെ തുകയും കണക്കാക്കുന്നു.

ഏറ്റവും പ്രധാനപ്പെട്ട കാര്യം, ഈ functions-നെ ഞാൻ React-ൽ നിന്ന് സ്വതന്ത്രമായി നിർത്തി എന്നതാണ്. അവ ആവശ്യമായ ഡാറ്റ സ്വീകരിച്ച് കണക്കുകൂട്ടൽ ഫലങ്ങൾ തിരികെ നൽകുന്നു, അതിനാൽ ആപ്ലിക്കേഷനിൽ വില വിവരങ്ങൾ ആവശ്യമുള്ള എവിടെയും ഇവ പുനരുപയോഗിക്കാം.

ഇത് ടെസ്റ്റിംഗ് വളരെ എളുപ്പമാക്കുന്നു. മുഴുവൻ ആപ്ലിക്കേഷനും render ചെയ്യാതെ തന്നെ ഒരു വിലയും discount-ഉം നൽകി function പ്രതീക്ഷിച്ച ഫലം തരുന്നുണ്ടോ എന്ന് വേഗത്തിൽ പരിശോധിക്കാൻ സാധിക്കും.`,
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
    answerMl: `എന്റെ implementation-ൽ ഒന്നിലധികം discounts അടുത്തടുത്തായി sequential ആയാണ് apply ചെയ്യുന്നത്. അതായത്, എല്ലാ percentages-ഉം ആദ്യത്തെ വിലയിൽ നിന്ന് നേരിട്ട് കണക്കാക്കുന്നതിന് പകരം, തൊട്ടുമുമ്പുള്ള discount കുറച്ചതിന് ശേഷം ബാക്കി വരുന്ന തുകയിലാണ് അടുത്ത discount കണക്കാക്കുന്നത്.

ഉദാഹരണത്തിന്, യഥാർത്ഥ വില €1,000 ആണെന്ന് കരുതുക, ഉപയോക്താവ് ആദ്യം 10% discount പ്രയോഗിക്കുന്നു. അപ്പോൾ വില €900 ആയി മാറുന്നു.

ഇനി ഉപയോക്താവ് അടുത്തതായി 5% discount പ്രയോഗിക്കുകയാണെങ്കിൽ, ആ 5% കണക്കാക്കുന്നത് ഈ €900-ലാണ്. അതിനാൽ രണ്ടാമത്തെ discount €45 ആയിരിക്കും, അന്തിമ വില €855 ആയി മാറുന്നു.

ഇത് 10%-ഉം 5%-ഉം ഒരുമിച്ച് കൂട്ടി 15% ആക്കി യഥാർത്ഥ വിലയിൽ നിന്ന് കുറയ്ക്കുന്നതിൽ നിന്ന് വ്യത്യസ്തമാണ്. കാരണം €1,000-ൽ 15% discount വന്നാൽ വില €850 ആയിരിക്കും, €855 ആകില്ല.

ഈ sequential രീതി discount calculation utility-ൽ നടപ്പിലാക്കിയിട്ടുണ്ട്. ഇത് തിരഞ്ഞെടുത്ത discounts ഓരോന്നായി പരിശോധിച്ച് നിലവിലെ തുകയെ നിരന്തരം അപ്‌ഡേറ്റ് ചെയ്യാൻ ആപ്ലിക്കേഷനെ സഹായിക്കുന്നു.

ഓരോ percentage discount-ഉം തൊട്ടുമുമ്പത്തെ തുകയിലാണ് ബാധകമാക്കുന്നത് എന്നതിനാൽ discounts നൽകുന്ന ക്രമം (order) പ്രധാനമാണ്. ഈ implementation-ൽ function-ലേക്ക് discounts നൽകുന്ന അതേ ക്രമത്തിലാണ് കണക്കുകൂട്ടലുകൾ നടക്കുന്നത്.

അതുകൊണ്ട്, ഒരു interview-ൽ ഇത് പറയുമ്പോൾ ആപ്ലിക്കേഷൻ വെറുതെ percentages കൂട്ടിച്ചേർക്കുകയല്ല ചെയ്യുന്നത്, മറിച്ച് ഒന്നിനുപുറകെ ഒന്നായി ക്രമമായി കുറച്ചാണ് അന്തിമ വില കണ്ടെത്തുന്നതെന്ന് ഞാൻ വ്യക്തമാക്കും.`,
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
    answerMl: `One-time discount ഉൽപ്പന്നത്തിന്റെ ആദ്യ upfront വിലയെ ബാധിക്കുമ്പോൾ, monthly discount ഒരു നിശ്ചിത കാലാവധിയിലേക്ക് ആവർത്തിച്ചുള്ള പ്രതിമാസ ചെലവിനെയാണ് ബാധിക്കുന്നത് എന്നതാണ് പ്രധാന വ്യത്യാസം.

ഒരു one-time discount-ൽ, ആപ്ലിക്കേഷൻ നേരിട്ടുള്ള ആദ്യ വിലയിലാണ് discount കണക്കാക്കുന്നത്. ഉദാഹരണത്തിന്, യഥാർത്ഥ വില €1,000 ആണെന്നും ഉപയോക്താവ് 3% one-time discount നൽകുന്നുവെന്നും കരുതുക. അപ്പോൾ discount €30 ആയിരിക്കും, upfront വില €970 ആയി മാറുന്നു.

പ്രതിമാസ discount പ്രവർത്തിക്കുന്നത് monthly price-ലാണ്. ഇതിന് ഒരു പ്രത്യേക കാലാവധി (duration) ഉണ്ടായിരിക്കാം, അതിനാൽ ആ promotional discount നിശ്ചിത മാസങ്ങളിലേക്ക് മാത്രമേ ബാധകമാകൂ.

ഉദാഹരണത്തിന്, പ്രതിമാസ നിരക്ക് €10 ആണെന്നും 25% discount 3 മാസത്തേക്ക് ലഭ്യമാണെന്നും കരുതുക. അപ്പോൾ കുറഞ്ഞ പ്രതിമാസ തുക €7.50 ആയിരിക്കും. ആ മൂന്ന് മാസത്തേക്ക് ആകെ തുക €22.50 ആണ്.

Promotional കാലാവധിക്ക് ശേഷം, പ്രതിമാസ വില സാധാരണ €10-ലേക്ക് മടങ്ങിയെത്തുന്നു. മുഴുവൻ 12 മാസത്തെ കാലാവധി കണക്കാക്കിയാൽ, ശേഷിക്കുന്ന ഒമ്പത് മാസത്തേക്ക് €90 വരും. ഇത് ആദ്യ വർഷത്തെ recurring ആകെ തുകയെ €112.50 ആക്കുന്നു.

ഈ ഉദാഹരണത്തിൽ ഉപയോക്താവ് €30-ന്റെ one-time discount കൂടി പ്രയോഗിക്കുകയാണെങ്കിൽ, ആദ്യ വർഷത്തെ ആകെ തുക €970-ഉം €112.50-ഉം ചേർന്ന് €1,082.50 ആയിരിക്കും.

ആദ്യമുണ്ടാകുന്ന ലാഭവും പ്രതിമാസ ലാഭവും മൊത്തം ചെലവിന്റെ വ്യത്യസ്ത ഘടകങ്ങളായതിനാലാണ് ആപ്ലിക്കേഷൻ ഈ കണക്കുകൂട്ടലുകൾ വെവ്വേറെ സൂക്ഷിക്കുന്നത്.

കോഡിൽ, \`calculateMonthlyTotals\` promotional മാസങ്ങളും വർഷത്തിലെ ബാക്കി മാസങ്ങളും കൃത്യമായി കണക്കാക്കാൻ discount duration ഉപയോഗിക്കുന്നു. ഒരൊറ്റ സംഖ്യ മാത്രം കാണിക്കുന്നതിന് പകരം വ്യക്തമായ ഒരു breakdown side cart-ൽ പ്രദർശിപ്പിക്കാൻ ഇത് സഹായിക്കുന്നു.`,
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
    answerMl: `Edge cases-നെ കുറിച്ച് ചിന്തിക്കുമ്പോൾ, സാധാരണ പ്രതീക്ഷിക്കുന്നതിൽ നിന്ന് വ്യത്യസ്തമായ input values വരുമ്പോൾ എന്ത് സംഭവിക്കുന്നു എന്നാണ് ഞാൻ പരിശോധിക്കുന്നത്.

ഉദാഹരണത്തിന്, ഒരു percentage discount പൂജ്യം (0) ആകാം, ഒരു fixed discount ഉൽപ്പന്നത്തിന്റെ വിലയേക്കാൾ വലുതാകാം, അല്ലെങ്കിൽ ഒരു monthly discount-ൽ അർത്ഥശൂന്യമായ duration വരാം. കൂടാതെ ഒന്നിലധികം discounts ഒന്നിനുപുറകെ ഒന്നായി apply ചെയ്യുമ്പോൾ എന്ത് സംഭവിക്കുന്നുവെന്നും ചിന്തിക്കേണ്ടതുണ്ട്.

നിലവിലെ implementation-ൽ, സപ്പോർട്ട് ചെയ്യുന്ന discount types വെവ്വേറെ കൈകാര്യം ചെയ്യുന്നു, കൂടാതെ promotional കാലാവധിയും ബാക്കി മാസങ്ങളും കണ്ടെത്താൻ monthly calculation discount duration ഉപയോഗിക്കുന്നു.

എങ്കിലും എല്ലാ edge cases-ഉം ഇതിനകം പൂർണ്ണമായി പരിഹരിച്ചിട്ടുണ്ടെന്ന് ഞാൻ അവകാശപ്പെടില്ല. ഉദാഹരണത്തിന്, നിലവിലെ \`calculateDiscountedPrice\` ഫലത്തെ പൂജ്യത്തിൽ (zero) ക്ലാംപ് ചെയ്യാതെ നേരിട്ട് തുക കുറയ്ക്കുകയാണ് ചെയ്യുന്നത്. അതിനാൽ വിലയേക്കാൾ വലിയ ഒരു fixed discount നൽകിയാൽ തുക negative ആകാൻ സാധ്യതയുണ്ട്.

Production-നായി ഇത് കൂടുതൽ സുരക്ഷിതമാക്കുമ്പോൾ (hardening), discounts പ്രയോഗിക്കുന്നതിന് മുമ്പ് അവ validate ചെയ്യുകയും, duration-നും percentage-നും പരിധികൾ നിശ്ചയിക്കുകയും, അന്തിമ വില ഒരിക്കലും പൂജ്യത്തിന് താഴെ (negative) പോകുന്നില്ലെന്ന് ഉറപ്പാക്കുകയും ചെയ്യും.

സാധാരണ മൂല്യങ്ങൾ മാത്രം ടെസ്റ്റ് ചെയ്യുന്നത് pricing logic-ൽ മതിയാകാത്തതിനാൽ ഇത്തരം boundary cases-നായി കൂടുതൽ tests ചേർക്കും.

അതുകൊണ്ട്, business rules കണ്ടെത്തുക, അവ കൃത്യമായ layer-ൽ നടപ്പിലാക്കുക, സാധാരണ സാഹചര്യങ്ങളും ഇത്തരം boundary conditions-ഉം automated tests വഴി പരിശോധിക്കുക എന്നിവയാണ് എന്റെ രീതി.`,
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
    answerMl: `ഈ ആപ്ലിക്കേഷനിൽ discounts കൈകാര്യം ചെയ്യാൻ രണ്ട് വഴികളുണ്ട്: predefined discounts-ഉം manually created discounts-ഉം.

Predefined discounts എന്നത് ആപ്ലിക്കേഷനിൽ ഇതിനകം മുൻകൂട്ടി ലഭ്യമാക്കിയിട്ടുള്ള discounts ആണ്. ഇതിന്റെ പ്രാരംഭ ഡാറ്റ \`src/api/mockData.ts\`-ൽ നിന്നാണ് വരുന്നത്, ആപ്ലിക്കേഷൻ ഇവയെ API layer വഴിയാണ് കൈകാര്യം ചെയ്യുന്നത്. Admin page-ൽ നിന്നും ഇവയെ നിയന്ത്രിക്കാനാകും.

Manual discounts ഉപയോക്താവ് checkout interface വഴി നേരിട്ട് ഉണ്ടാക്കുന്നവയാണ്. നിലവിലുള്ള ഒരു predefined discount തിരഞ്ഞെടുക്കുന്നതിന് പകരം, manual discount creation flow വഴി ഉപയോക്താവിന് ഇഷ്ടമുള്ള വിവരങ്ങൾ നൽകാം.

Discount source വിവരങ്ങൾ ഉപയോഗിച്ച് ഡാറ്റാ മോഡലിൽ ഞാൻ ഈ വേർതിരിവ് സൂക്ഷിച്ചിട്ടുണ്ട്. ഒരു discount എവിടെ നിന്നാണ് വന്നതെന്നും UI-ൽ അത് എങ്ങനെ കൈകാര്യം ചെയ്യണമെന്നും തിരിച്ചറിയാൻ ഇത് സഹായിക്കുന്നു.

ഉദാഹരണത്തിന്, predefined discounts ഭരണപരമായ (admin) നിയന്ത്രണങ്ങളെ പിന്തുണയ്ക്കുമ്പോൾ, manual discounts നിലവിലെ checkout ആവശ്യത്തിന് മാത്രമായി ഉപയോക്താവിന് ഉണ്ടാക്കാൻ അനുവാദം നൽകുന്നു.

ഡാറ്റ കൃത്യമായി നിലനിർത്താൻ ഞാൻ TypeScript interfaces ഉപയോഗിക്കുന്നു. Predefined discount structure പൊതുവായ discount interface-നെ extend ചെയ്യുകയും ആ discount active/enabled ആണോ എന്നതുപോലുള്ള അധിക വിവരങ്ങൾ ഉൾക്കൊള്ളുകയും ചെയ്യുന്നു.

അതുകൊണ്ട്, ഇവയുടെ lifecycle തന്നെയാണ് പ്രധാന വ്യത്യാസം: predefined discounts ആപ്ലിക്കേഷനിൽ എപ്പോഴും ലഭ്യമായ ഡാറ്റയായി നിലനിൽക്കുമ്പോൾ, manual discounts ഉപയോക്താവിന്റെ checkout ഇടപെടലിലൂടെ അന്നേരം മാത്രം ഉണ്ടാകുന്നു.`,
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
    answerMl: `Predefined discounts കൈകാര്യം ചെയ്യുന്നതിന് admin page ആണ് ഉത്തരവാദി. Checkout components-ൽ administrative controls കൂട്ടിക്കലർത്താതെ, ഞാൻ ആ പ്രവർത്തനങ്ങൾ \`src/components/admin/AdminPage.tsx\`-ൽ സൂക്ഷിച്ചു.

Admin എന്തെങ്കിലും മാറ്റം വരുത്തുമ്പോൾ, \`src/api/discountsApi.ts\`-ലെ data-management functions-നെ വിളിക്കുന്നു. ആ layer predefined discount data അപ്‌ഡേറ്റ് ചെയ്യുകയും localStorage-ൽ സ്ഥിരമായി സൂക്ഷിക്കുകയും ചെയ്യുന്നു.

മാറ്റങ്ങൾ അറിയിക്കാൻ ഞാൻ ഒരു subscription mechanism-ഉം നടപ്പിലാക്കിയിട്ടുണ്ട്. ഒരു discount മാറുമ്പോഴെല്ലാം മുഴുവൻ ആപ്ലിക്കേഷനും reload ചെയ്യാതെ തന്നെ, ആ വിവരങ്ങൾ ആവശ്യമുള്ള components-ലേക്ക് മാറ്റങ്ങൾ എത്തിക്കുക എന്നതാണ് ഇതിന്റെ ആശയം.

ഒരു മാറ്റം publish ചെയ്യുമ്പോൾ, subscribe ചെയ്തിരിക്കുന്ന components അവയുടെ ഡാറ്റ refresh ചെയ്യുകയും React state അപ്‌ഡേറ്റ് ചെയ്യുകയും ചെയ്യുന്നു. തുടർന്ന് React ഏറ്റവും പുതിയ വിവരങ്ങൾ വച്ച് UI render ചെയ്യുന്നു.

ഉദാഹരണത്തിന്, ഒരു admin ഒരു predefined discount disable ചെയ്താൽ, checkout interface ആ മാറ്റം ഉടൻ സ്വീകരിക്കുകയും disable ആയ അവസ്ഥ കാണിക്കുകയും ചെയ്യുന്നു.

ഏറ്റവും ശ്രദ്ധേയമായ കാര്യം, admin page ഒരിക്കലും checkout components-ന്റെ internal state-ൽ നേരിട്ട് ഇടപെടുന്നില്ല എന്നതാണ്. രണ്ട് ഭാഗങ്ങളും shared data-management layer വഴിയാണ് ആശയവിനിമയം നടത്തുന്നത്.

ഇത് കോഡ് പരിപാലിക്കുന്നത് വളരെ എളുപ്പമാക്കുന്നു, കാരണം admin-നും checkout-നും വെവ്വേറെ UI ഉത്തരവാദിത്തങ്ങൾ ഉള്ളപ്പോഴും അവ ഒരേ ഡാറ്റാ സ്രോതസ്സ് പങ്കിടുന്നു.`,
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
    answerMl: `നിലവിലുള്ള ഒരു predefined discount-നെ പുതിയൊരു discount ആയി കണക്കാക്കാതെ തന്നെ modify ചെയ്യാൻ കഴിയുന്ന വിധത്തിലാണ് ഞാൻ edit flow നടപ്പിലാക്കിയത്.

ആ discount-മായി ബന്ധപ്പെട്ട edit action വഴി ഉപയോക്താവിന് edit interface തുറക്കാനാകും. ഈ പ്രത്യേക flow-വിൽ, മാറ്റങ്ങൾ വരുത്തുന്നത് പരമാവധി 5% വരെയുള്ള percentage value-വിൽ മാത്രമായി ഞാൻ പരിമിതപ്പെടുത്തി. എല്ലാ fields-ഉം മാറ്റാൻ അനുവദിക്കാതെ കൃത്യമായ requirement-ൽ നിൽക്കാൻ ഇത് സഹായിക്കുന്നു.

കൂടാതെ സ്റ്റാറ്റിക് ആയ €1,000 ഉദാഹരണം ഉപയോഗിച്ച് ഒരു price preview കൂടി ഞാൻ ഉൾപ്പെടുത്തിയിട്ടുണ്ട്. സേവ് ചെയ്യുന്നതിന് മുമ്പ് തന്നെ percentage മാറ്റുമ്പോൾ വില എങ്ങനെ മാറുന്നുവെന്ന് ഉപയോക്താവിന് കാണാൻ ഇത് സഹായിക്കുന്നു.

അപ്‌ഡേറ്റ് സേവ് ചെയ്യുമ്പോൾ, മറ്റൊരു ID ഉള്ള പുതിയ discount ഉണ്ടാക്കുന്നതിന് പകരം നിലവിലുള്ള റെക്കോർഡ് തന്നെയാണ് അപ്‌ഡേറ്റ് ചെയ്യുന്നത്. ആപ്ലിക്കേഷന്റെ മറ്റ് ഭാഗങ്ങൾക്ക് ആ discount-നെ തിരിച്ചറിയാൻ ഇതേ ID തന്നെ നിലനിർത്തേണ്ടത് പ്രധാനമാണ്.

ഈ മാറ്റം പിന്നീട് predefined discount data-management layer വഴി കടന്നുപോകുകയും, ഡാറ്റ സേവ് ചെയ്ത് subscribers-നെ വിവരമറിയിക്കുകയും ചെയ്യുന്നു.

അതുകൊണ്ട്, എഡിറ്റിംഗ് പരിമിതപ്പെടുത്തുക, വിലയിലുണ്ടാകുന്ന മാറ്റം ഉപയോക്താവിന് കാണിച്ച് കൊടുക്കുക, നിലവിലുള്ള ID നിലനിർത്തുക എന്നിവയായിരുന്നു ഞാൻ പ്രധാനമായും പരിഗണിച്ച കാര്യങ്ങൾ.`,
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
    answerMl: `Predefined discount data കൈകാര്യം ചെയ്യാൻ ഒരു വഴി ആവശ്യമായിരുന്നുവെങ്കിലും ഈ assignment-ന്റെ ഉദ്ദേശ്യം കാണിക്കാൻ ഒരു പ്രത്യേക backend service ആവശ്യമില്ലാത്തതിനാലാണ് ഞാൻ localStorage ഉപയോഗിച്ചത്.

പ്രാരംഭ discount data \`src/api/mockData.ts\`-ൽ നൽകിയിട്ടുണ്ട്. \`src/api/discountsApi.ts\`-ലെ API layer ഡാറ്റ എടുക്കാനും അപ്‌ഡേറ്റ് ചെയ്യാനുമുള്ള functions നൽകുമ്പോൾ, പേജ് റീലോഡ് ചെയ്താലും മാറ്റങ്ങൾ നിലനിൽക്കാൻ localStorage സഹായിക്കുന്നു.

ഇത് മനഃപൂർവ്വം ഒരു API-പോലെയുള്ള layer-ന് പിന്നിലാണ് വെച്ചിരിക്കുന്നത്. ഡാറ്റ എങ്ങനെ സൂക്ഷിക്കുന്നു എന്നതിന്റെ സങ്കീർണ്ണമായ കാര്യങ്ങൾ UI components അറിയേണ്ടതില്ല. അവയ്ക്ക് data-management functions-നെ നേരിട്ട് വിളിക്കാം.

ഭാവിയിൽ എളുപ്പത്തിൽ മാറാനുള്ള ഒരു സൗകര്യവും (migration path) ഇത് നൽകുന്നു. പിന്നീട് localStorage മാറ്റി ഒരു യഥാർത്ഥ REST API-യും database-ഉം കൊണ്ടുവരികയാണെങ്കിൽ, UI-ലും calculation logic-ലും മാറ്റം വരുത്താതെ തന്നെ data-management layer മാത്രം മാറ്റിയാൽ മതിയാകും.

എങ്കിലും localStorage-ന് ചില പരിമിതികളുണ്ട്. ഡാറ്റ ഉപയോക്താവിന്റെ ബ്രൗസറിലാണ് സൂക്ഷിക്കുന്നത്, ഇത് ഒരു കേന്ദ്രീകൃത source of truth അല്ല, കൂടാതെ server-side validation അല്ലെങ്കിൽ access control നൽകുന്നില്ല. സുരക്ഷിതമായി വിവരങ്ങൾ സൂക്ഷിക്കാനുള്ള ഇടമായും ഇതിനെ കാണാനാവില്ല.

യഥാർത്ഥ പണമിടപാടുകളെ ബാധിക്കുന്ന ഒരു real application-ൽ, discount management-ഉം pricing validation-ഉം ഒരു database ഉള്ള backend-ലേക്ക് മാറ്റുന്നതാണ് ശരിയായ രീതി.

അതുകൊണ്ട്, ഒരു production backend-ന് പകരമായല്ല, മറിച്ച് ഈ assignment-ന്റെ scope-ൽ ഏറ്റവും അനുയോജ്യമായ പ്രായോഗിക പരിഹാരം എന്ന നിലയ്ക്കാണ് ഞാൻ localStorage തിരഞ്ഞെടുത്തത്.`,
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
    answerMl: `Predefined discounts-ലെ മാറ്റങ്ങൾ കൈകാര്യം ചെയ്യാൻ പരസ്പരബന്ധിതമായ രണ്ട് വഴികളാണ് ഞാൻ ഉപയോഗിച്ചത്: ആപ്ലിക്കേഷനകത്തെ ഒരു subscription mechanism-ഉം, മറ്റൊരു ടാബിൽ നിന്നുള്ള മാറ്റങ്ങൾ അറിയാൻ ബ്രൗസറിന്റെ storage event-ഉം.

ഒരേ ആപ്ലിക്കേഷനിലെ വിവിധ ഭാഗങ്ങൾക്ക് മാറ്റങ്ങൾ ശ്രവിക്കാൻ subscription mechanism സഹായിക്കുന്നു. API layer വഴി predefined discount data അപ്‌ഡേറ്റ് ചെയ്യപ്പെടുമ്പോൾ subscribers-ന് ആ വിവരം ലഭിക്കുകയും state refresh ചെയ്യുകയും ചെയ്യാം.

മറ്റൊരു browser tab-ൽ വരുത്തുന്ന മാറ്റങ്ങൾക്കായി ബ്രൗസർ നൽകുന്ന \`storage\` event ഉപയോഗിക്കുന്നു. ഒരേ origin-ൽ ഒരു ടാബ് localStorage മാറ്റുമ്പോൾ മറ്റ് ടാബുകൾക്ക് ആ event ലഭിക്കുകയും പുതിയ മാറ്റങ്ങളോട് പ്രതികരിക്കുകയും ചെയ്യുന്നു.

ഉദാഹരണത്തിന്, ഒരു ടാബിൽ checkout-ഉം മറ്റൊരു ടാബിൽ admin page-ഉം തുറന്നിട്ട്, admin tab-ൽ നിന്ന് ഒരു predefined discount അപ്‌ഡേറ്റ് ചെയ്താൽ, checkout tab ആ storage മാറ്റം കണ്ടെത്തുകയും ഡാറ്റ സ്വയം പുതുക്കുകയും ചെയ്യുന്നു.

ബ്രൗസറിന്റെ ഒരു പ്രധാന പ്രത്യേകത എന്തെന്നാൽ, മാറ്റം വരുത്തിയ അതേ വിൻഡോയിലല്ല, മറിച്ച് ആ storage പങ്കിടുന്ന മറ്റ് വിൻഡോകളിലാണ് \`storage\` event ട്രിഗർ ചെയ്യുന്നത്. അതുകൊണ്ടാണ് ഒരേ ടാബിലെ subscription mechanism-ഉം വ്യത്യസ്ത ടാബുകളിലെ storage event-ഉം ഒന്നിച്ച് പ്രവർത്തിക്കേണ്ടി വരുന്നത്.

ഒരു backend ഇല്ലാതെയും, അടിക്കടി polling നടത്താതെയും തന്നെ predefined discount ഡാറ്റ എപ്പോഴും ഒരേപോലെ (synchronized) നിലനിർത്താൻ ഈ രീതി സഹായിക്കുന്നു.

എങ്കിലും ഇത് ഒരു ബ്രൗസർ തലത്തിലുള്ള synchronization മാത്രമാണ്. പല ഉപയോക്താക്കളും ഡിവൈസുകളുമുള്ള ഒരു production ആപ്ലിക്കേഷനിൽ ഒരു backend തന്നെയായിരിക്കും കേന്ദ്രീകൃത സ്രോതസ്സ്, അവിടെ server-side updates വഴിയാണ് ഇത് സാധ്യമാക്കുന്നത്.`,
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
    answerMl: `ഈ assignment-ൽ Vite ഉപയോഗിക്കുന്നതിനാലും, അത്തരമൊരു setup-ലേക്ക് Vitest വളരെ സ്വാഭാവികമായി ഇണങ്ങുന്നതിനാലുമാണ് ഞാൻ Vitest തിരഞ്ഞെടുത്തത്. TypeScript, modern JavaScript പ്രോജക്റ്റുകളിൽ വളരെ മികച്ച രീതിയിൽ പ്രവർത്തിക്കുന്ന ഒരു test runner ആണ് ഇത്.

വെറുതെ മാനുവലായി UI പരിശോധിക്കുന്നതിന് പകരം ആപ്ലിക്കേഷന്റെ പ്രധാനപ്പെട്ട എല്ലാ ഭാഗങ്ങളും കൃത്യമായി ടെസ്റ്റ് ചെയ്യുന്നതിലാണ് ഞാൻ ശ്രദ്ധ കേന്ദ്രീകരിച്ചത്.

ആദ്യം, ഞാൻ discount calculation logic ടെസ്റ്റ് ചെയ്തു. ഉദാഹരണത്തിന്, percentage, fixed discounts വിലയെ എങ്ങനെ ബാധിക്കുന്നുവെന്നും, ഒന്നിലധികം discounts-ഉം monthly totals-ഉം എങ്ങനെ കണക്കാക്കുന്നുവെന്നും പരിശോധിച്ചു.

Predefined discount അപ്‌ഡേറ്റുകളും localStorage persistence-ഉം കൈകാര്യം ചെയ്യുന്നതിനാൽ data-management layer-ഉം ഞാൻ ടെസ്റ്റ് ചെയ്തു. Discounts എടുക്കുമ്പോഴും മാറ്റുമ്പോഴും ആ ഭാഗം കൃത്യമായി പ്രവർത്തിക്കേണ്ടതുണ്ട്.

വില കാണിക്കുന്നതും interactions-ഉം പോലുള്ള പ്രധാന UI പെരുമാറ്റങ്ങൾക്കായി ഞാൻ tests ചേർത്തു. ഒരു function ശരിയായ ഉത്തരം നൽകുന്നുണ്ടോ എന്ന് മാത്രമല്ല, ആപ്ലിക്കേഷൻ ഉപയോക്താവിന് അത് ശരിയായി കാണിക്കുന്നുണ്ടോ എന്നും ഉറപ്പാക്കുകയായിരുന്നു ഇതിന്റെ ഉദ്ദേശ്യം.

\`package.json\`-ൽ \`vitest run\` പ്രവർത്തിപ്പിക്കുന്നതിനായി ഒരു \`test\` script നൽകിയിട്ടുണ്ട്, അതിനാൽ development server സ്റ്റാർട്ട് ചെയ്യാതെ തന്നെ command line-ൽ നിന്ന് ടെസ്റ്റുകൾ റൺ ചെയ്യാവുന്നതാണ്.

ഒരു pricing ആപ്ലിക്കേഷനിൽ ടെസ്റ്റിംഗ് വളരെ പ്രധാനപ്പെട്ട ഒന്നായി ഞാൻ കാണുന്നു, കാരണം ഒരു ചെറിയ കണക്കുകൂട്ടൽ തെറ്റ് പോലും ഉപയോക്താവ് കാണുന്ന അന്തിമ തുകയെ ബാധിക്കും.

ഭാവിയിൽ ഇത് കൂടുതൽ വികസിപ്പിക്കുകയാണെങ്കിൽ തെറ്റായ discount values, വിലയേക്കാൾ വലിയ discounts, വ്യത്യസ്തമായ monthly durations എന്നിവയ്ക്കായി കൂടുതൽ boundary tests ചേർക്കും. ഒരു discount തിരഞ്ഞെടുക്കുന്നത് മുതൽ അന്തിമ വില കാണുന്നത് വരെയുള്ള സമ്പൂർണ്ണ യാത്ര ഉറപ്പാക്കാൻ end-to-end tests-ഉം ഉൾപ്പെടുത്തും.

അതുകൊണ്ട്, മാനുവൽ പരിശോധനയെ മാത്രം ആശ്രയിക്കാതെ പ്രധാനപ്പെട്ട business rules-ഉം application behavior-ഉം വീണ്ടും വീണ്ടും വിശ്വസനീയമായി ടെസ്റ്റ് ചെയ്യാൻ ഞാൻ Vitest ഉപയോഗിച്ചു.`,
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
