import type { InterviewQuestion } from "@/types";

type Enrichment = Required<
  Pick<
    InterviewQuestion,
    "quickAnswer" | "detailedExplanation" | "realWorldUseCase" | "codeExample" | "commonMistakes" | "interviewTip"
  >
>;

function guide(
  quickAnswer: string,
  detailedExplanation: string,
  realWorldUseCase: string,
  codeExample: string,
  commonMistakes: string,
  interviewTip: string,
): Enrichment {
  return { quickAnswer, detailedExplanation, realWorldUseCase, codeExample, commonMistakes, interviewTip };
}

function matches(text: string, ...patterns: (string | RegExp)[]): boolean {
  return patterns.some((pattern) => (typeof pattern === "string" ? text.includes(pattern) : pattern.test(text)));
}

function variablesGuide(): Enrichment {
  return guide(
    "`var` is function-scoped and can be redeclared. `let` and `const` are block-scoped. Use `const` when the binding should not be reassigned, and `let` when it must change. Avoid `var` in modern code.",
    "`var` belongs to the nearest function scope, not the nearest block. That means a `var` declared inside an `if` block is still visible outside that block, and a `var` in a loop can create confusing closure bugs.\n\n`let` and `const` belong to the nearest block, such as an `if`, `for`, or `{}` block. Both are hoisted but cannot be used before their declaration because they are in the temporal dead zone. `const` prevents rebinding the variable name, but it does not make objects or arrays immutable.",
    "Use `const` for imported helpers, configuration objects, DOM references, and derived values. Use `let` for counters, retry state, pagination cursors, or values that change over time. This makes intent obvious during code review.",
    "const user = { name: \"Asha\" };\nuser.name = \"Mira\"; // allowed: object content changed\n\nlet retries = 0;\nretries += 1;\n\n// Avoid var: it leaks out of block scope.\nif (true) {\n  var oldStyle = \"visible outside\";\n}",
    "- Saying `const` makes an object fully immutable.\n- Forgetting that `var` is function-scoped, not block-scoped.\n- Using `let` everywhere when `const` would communicate safer intent.",
    "A strong interview answer is: scope first, reassignment second, hoisting/TDZ third. Then mention the practical rule: `const` by default, `let` when reassignment is required, `var` only for legacy code."
  );
}

function hoistingGuide(): Enrichment {
  return guide(
    "Hoisting means JavaScript creates bindings for declarations before code executes. Function declarations are usable early, `var` starts as `undefined`, and `let`/`const` exist but throw if accessed before initialization.",
    "During compilation, JavaScript records declarations for the current scope. A `function declaration` is initialized with the function value, so calling it before its line works. A `var` declaration is initialized to `undefined`, so reading it early does not throw but often hides bugs.\n\n`let` and `const` are also hoisted, but they stay uninitialized until execution reaches the declaration line. That uninitialized period is the temporal dead zone, and reading the variable there throws a `ReferenceError`.",
    "Hoisting explains why moving code around can change behavior in old files, why linters warn about use-before-define, and why `let`/`const` produce clearer failures than `var`.",
    "sayHi(); // works\nfunction sayHi() {\n  console.log(\"hi\");\n}\n\nconsole.log(count); // undefined\nvar count = 1;\n\n// console.log(total); // ReferenceError\nlet total = 1;",
    "- Saying declarations are physically moved to the top at runtime.\n- Forgetting that assignments are not hoisted with `var`.\n- Saying `let` and `const` are not hoisted; they are hoisted but unavailable in the TDZ.",
    "Explain the three cases separately: function declarations, `var`, and `let`/`const`. That structure makes the answer sound precise instead of memorized."
  );
}

function tdzGuide(): Enrichment {
  return guide(
    "The Temporal Dead Zone is the period from entering a scope until a `let` or `const` declaration is initialized. Accessing the variable during that period throws `ReferenceError`.",
    "`let` and `const` bindings are created when the scope is prepared, but they are not initialized immediately. JavaScript intentionally throws if you read them before the declaration line runs. This catches mistakes that `var` would hide by returning `undefined`.\n\nThe TDZ also applies to block scopes and function parameters. It is one reason `let` and `const` make refactors safer: a wrong ordering fails loudly instead of producing a silent undefined value.",
    "You see TDZ errors when a variable is used before a declaration after refactoring, when circular module imports access values too early, or when block-scoped names shadow outer variables.",
    "const name = \"outer\";\n\nif (true) {\n  // console.log(name); // ReferenceError: inner name is in TDZ\n  const name = \"inner\";\n  console.log(name);\n}",
    "- Treating TDZ as a separate runtime feature from hoisting.\n- Thinking `typeof value` is always safe; `typeof` on a TDZ binding also throws.\n- Forgetting that shadowing can create a TDZ even when an outer variable exists.",
    "Connect TDZ to safety: it prevents code from accidentally reading a variable before the value that the developer intended has been assigned."
  );
}

function closureGuide(): Enrichment {
  return guide(
    "A closure is a function that remembers variables from its outer scope even after that outer function has finished running. It is how JavaScript keeps private state for callbacks, factories, and event handlers.",
    "Functions in JavaScript carry a reference to the lexical environment where they were created. If an inner function uses an outer variable, that variable stays alive as long as the inner function can still be called.\n\nClosures are not a special syntax; they naturally happen whenever a function references outer state. They are powerful for encapsulation and async callbacks, but they can also retain memory if they capture large objects longer than needed.",
    "Closures are used in counters, memoization, React hooks callbacks, debounced handlers, module-private state, and functions that pre-fill configuration such as API clients.",
    "function createCounter() {\n  let count = 0;\n\n  return function increment() {\n    count += 1;\n    return count;\n  };\n}\n\nconst next = createCounter();\nconsole.log(next()); // 1\nconsole.log(next()); // 2",
    "- Saying a closure is only an inner function; the key is remembered outer variables.\n- Forgetting that closures capture variables, not snapshots of primitive values.\n- Capturing large DOM nodes or data objects and keeping them alive accidentally.",
    "Use the phrase `function plus its lexical environment`, then give a counter or event-handler example. That is short, accurate, and interview-friendly."
  );
}

function equalityGuide(): Enrichment {
  return guide(
    "`===` compares without type coercion. `==` can convert types before comparing. Prefer `===` so the code behaves predictably, except for the deliberate `value == null` pattern when you want `null` or `undefined`.",
    "`==` uses JavaScript's abstract equality rules, so values of different types may be converted before comparison. That creates surprising results like `0 == false` and `\"\" == 0`.\n\n`===` checks both type and value, so it avoids most coercion surprises. It still has a few numeric edge cases: `NaN === NaN` is false, and `0 === -0` is true. Use `Number.isNaN` or `Object.is` when those cases matter.",
    "In application code, strict equality prevents bugs in form values, URL params, API payloads, feature flags, and permission checks where strings and numbers can be mixed accidentally.",
    "console.log(0 == \"0\");  // true\nconsole.log(0 === \"0\"); // false\n\nconst input = \"1\";\nif (Number(input) === 1) {\n  console.log(\"explicit conversion\");\n}",
    "- Saying `==` is always wrong without explaining coercion.\n- Forgetting that `===` does not make two objects equal by structure.\n- Comparing `NaN` with `===` instead of `Number.isNaN`.",
    "Say: `===` is the default, `==` is coercive, and explicit conversion is clearer than relying on coercion. That shows both judgment and knowledge."
  );
}

function coercionGuide(): Enrichment {
  return guide(
    "Type coercion is JavaScript converting a value from one type to another. It can be explicit, like `Number(value)`, or implicit, like `\"5\" - 1` becoming `4`.",
    "Implicit coercion happens in operators and comparisons. `+` is especially tricky because it can mean numeric addition or string concatenation. Other numeric operators usually convert operands to numbers. Boolean contexts convert values to truthy or falsy.\n\nCoercion is part of the language, so the goal is not to fear it. The goal is to be deliberate: convert at boundaries, keep internal data types consistent, and avoid clever expressions that require readers to know edge-case rules.",
    "You handle coercion when reading input values, URL query strings, local storage values, form fields, and API data. These often arrive as strings and must be converted before validation or math.",
    "const rawAge = \"24\";\nconst age = Number(rawAge);\n\nconsole.log(\"5\" + 1); // \"51\"\nconsole.log(\"5\" - 1); // 4\nconsole.log(Boolean(\"\")); // false",
    "- Depending on `==` to convert values in business logic.\n- Forgetting that form inputs and URL params are strings.\n- Using global `isNaN`, which coerces before checking.",
    "A good answer includes one surprising example and one practical rule: convert data explicitly at system boundaries."
  );
}

function nanGuide(): Enrichment {
  return guide(
    "`NaN` means Not a Number, but its type is still `number`. It appears when a numeric operation cannot produce a valid number. Use `Number.isNaN(value)` to check it.",
    "`NaN` is a special IEEE floating-point value used by JavaScript numbers. It is contagious: most arithmetic with `NaN` produces `NaN`. It is also the only JavaScript value that is not equal to itself, so `NaN === NaN` is false.\n\nThe safest check is `Number.isNaN`, because it only returns true for actual `NaN`. The older global `isNaN` first coerces the value, which can produce confusing results.",
    "You see `NaN` in calculations from user input, parsing prices, date math, chart data, and analytics dashboards. Catching it early prevents broken UI and invalid totals.",
    "const price = Number(\"abc\");\n\nconsole.log(price); // NaN\nconsole.log(price === NaN); // false\nconsole.log(Number.isNaN(price)); // true",
    "- Checking `value === NaN`.\n- Using global `isNaN` without understanding coercion.\n- Letting `NaN` continue through calculations instead of validating inputs early.",
    "Mention all three facts: `typeof NaN` is `number`, `NaN !== NaN`, and `Number.isNaN` is the right check."
  );
}

function nullUndefinedGuide(): Enrichment {
  return guide(
    "`undefined` usually means a variable or property has not been assigned. `null` is an intentional empty value set by the programmer or returned by an API.",
    "`undefined` is JavaScript's default missing value: uninitialized variables, missing object properties, and functions without a return value produce it. `null` is explicit; it means someone chose to represent no value.\n\nIn real code, pick a convention and keep it consistent. Many teams use `undefined` for omitted optional fields and `null` for intentionally empty database/API values.",
    "This matters when handling optional API fields, form resets, React props, cache misses, and database records where `null` may mean the value was intentionally cleared.",
    "let name;\nconsole.log(name); // undefined\n\nconst user = { middleName: null };\nconsole.log(user.middleName); // intentionally empty",
    "- Treating `null` and `undefined` as identical in all code.\n- Forgetting missing object properties return `undefined`.\n- Using loose checks without knowing that `value == null` matches both.",
    "Explain the intent difference: `undefined` is usually absent or not assigned; `null` is deliberately empty. That is what interviewers usually want."
  );
}

function dataTypesGuide(): Enrichment {
  return guide(
    "JavaScript has primitive types `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, and `null`, plus objects for arrays, functions, dates, maps, sets, and plain object data.",
    "Primitive values are not objects and are compared by value. Objects are compared by reference, so two identical-looking objects are different unless they are the same object in memory.\n\n`typeof` is useful but imperfect: `typeof null` returns `\"object\"`, arrays return `\"object\"`, and functions return `\"function\"`. Use `Array.isArray` for arrays and more specific checks when necessary.",
    "Knowing data types helps when validating API responses, building forms, comparing state, serializing JSON, and avoiding accidental mutation of object references.",
    "console.log(typeof \"hi\"); // string\nconsole.log(typeof 42); // number\nconsole.log(typeof null); // object (historical quirk)\nconsole.log(Array.isArray([])); // true\n\nconsole.log({ a: 1 } === { a: 1 }); // false",
    "- Forgetting `null` is a primitive even though `typeof null` says object.\n- Using `typeof value === \"array\"`; that never works.\n- Comparing objects by structure with `===`.",
    "Name the primitives, then add two practical checks: `Array.isArray` for arrays and reference equality for objects."
  );
}

function thisGuide(): Enrichment {
  return guide(
    "`this` is decided by how a regular function is called. `obj.method()` sets `this` to `obj`; a plain function call has `this` as `undefined` in strict mode. Arrow functions do not have their own `this`.",
    "JavaScript does not bind `this` permanently to where a regular function is written. The call-site matters. Calling a function as a method, with `new`, or with `call`/`apply`/`bind` changes its `this` value.\n\nArrow functions are different: they capture `this` from the surrounding lexical scope. That is useful for callbacks but wrong for object methods that need dynamic receiver behavior.",
    "`this` appears in class methods, event handlers, callbacks passed to timers, object methods, and React class components. Bugs often happen when a method is passed as a callback and loses its original receiver.",
    "const user = {\n  name: \"Asha\",\n  regular() {\n    return this.name;\n  },\n  arrow: () => this?.name,\n};\n\nconsole.log(user.regular()); // \"Asha\"\nconst fn = user.regular;\n// fn(); // undefined this in strict mode",
    "- Saying `this` is where the function is defined for regular functions.\n- Using arrow functions as object methods when the method needs the object as `this`.\n- Passing methods as callbacks without binding or wrapping them.",
    "Structure the answer by call-site: method call, plain call, constructor call, explicit binding, arrow lexical `this`."
  );
}

function arrowFunctionGuide(): Enrichment {
  return guide(
    "Arrow functions are shorter function expressions with lexical `this`. They are great for callbacks and small transformations, but they should not be used when you need dynamic `this`, `arguments`, or a constructor.",
    "An arrow function does not create its own `this`, `arguments`, `super`, or `new.target`. It closes over those values from the surrounding scope. This is why arrows are commonly used in callbacks where you want the surrounding class or module context.\n\nThey also cannot be called with `new`, and they are not ideal as object prototype methods. The syntax is concise, but the behavior difference around `this` is the real interview point.",
    "Use arrows for array transformations, promise chains, event callback wrappers, and React handlers. Use regular functions for object methods, constructors, generators, and APIs that intentionally set `this`.",
    "const doubled = [1, 2, 3].map((n) => n * 2);\n\nconst button = {\n  label: \"Save\",\n  click() {\n    setTimeout(() => console.log(this.label), 100);\n  },\n};",
    "- Saying arrows are only syntactic sugar for normal functions.\n- Using arrows for methods that need the caller's `this`.\n- Forgetting arrows do not have their own `arguments` object.",
    "Lead with lexical `this`, then mention concise syntax. That separates a surface-level answer from a correct one."
  );
}

function callApplyBindGuide(): Enrichment {
  return guide(
    "`call`, `apply`, and `bind` let you choose a regular function's `this`. `call` invokes with listed arguments, `apply` invokes with an array, and `bind` returns a new function with `this` pre-set.",
    "All three are methods on functions. `call` and `apply` run the function immediately. The only difference is how arguments are passed: comma-separated for `call`, array-like for `apply`.\n\n`bind` does not run the function immediately. It creates a new function whose `this` and optionally some arguments are fixed. This is useful when passing methods as callbacks.",
    "You use these when integrating older libraries, reusing methods, building partial application helpers, or keeping class methods bound when passing them to event listeners.",
    "function greet(prefix) {\n  return `${prefix}, ${this.name}`;\n}\n\nconst user = { name: \"Mira\" };\nconsole.log(greet.call(user, \"Hi\"));\nconsole.log(greet.apply(user, [\"Hello\"]));\n\nconst bound = greet.bind(user, \"Welcome\");\nconsole.log(bound());",
    "- Saying `bind` calls the function immediately.\n- Mixing up `call` and `apply` argument formats.\n- Trying to change `this` on an arrow function with these methods.",
    "Mention immediate invocation vs returning a new function. That is the cleanest way to compare them."
  );
}

function prototypeGuide(): Enrichment {
  return guide(
    "Prototypal inheritance means objects can delegate property lookups to another object through their prototype chain. `class` syntax is built on top of this object delegation model.",
    "When you access `obj.name`, JavaScript checks the object first. If the property is not found, it checks `obj`'s prototype, then the prototype's prototype, and so on until `null`. This is how methods can be shared instead of copied onto every instance.\n\nModern `class` syntax gives a familiar way to create constructors and methods, but the underlying behavior is still prototypes and property lookup delegation.",
    "Understanding prototypes helps when debugging class methods, inherited methods, monkey-patched APIs, custom objects, and why methods on instances are shared.",
    "function User(name) {\n  this.name = name;\n}\n\nUser.prototype.greet = function () {\n  return `Hi, ${this.name}`;\n};\n\nconst user = new User(\"Asha\");\nconsole.log(user.greet());",
    "- Saying JavaScript inheritance is exactly like classical inheritance.\n- Forgetting property lookup starts on the object before the prototype.\n- Adding mutable shared data to a prototype by accident.",
    "Use the phrase `delegation through the prototype chain`, then say `class` is syntax over that model."
  );
}

function higherOrderGuide(): Enrichment {
  return guide(
    "A higher-order function takes another function as an argument, returns a function, or both. Array methods like `map`, `filter`, and `reduce` are common examples.",
    "Functions are first-class values in JavaScript, so they can be stored in variables, passed around, and returned. A higher-order function uses that ability to separate reusable flow from customizable behavior.\n\nThis is the basis for callbacks, middleware, decorators, retry helpers, memoization, function composition, and most array data transformations.",
    "You use higher-order functions when transforming lists, creating reusable validators, wrapping API calls with retries, debouncing handlers, or composing middleware.",
    "function withLogging(fn) {\n  return function (...args) {\n    console.log(\"calling\", fn.name);\n    return fn(...args);\n  };\n}\n\nconst add = (a, b) => a + b;\nconst loggedAdd = withLogging(add);\nconsole.log(loggedAdd(2, 3));",
    "- Only naming `map` without explaining why it is higher-order.\n- Confusing callbacks with higher-order functions; a callback is the function passed in.\n- Overusing HOFs where a simple function would be clearer.",
    "Define it in one sentence, then give both forms: takes a function and returns a function."
  );
}

function pureFunctionGuide(): Enrichment {
  return guide(
    "A pure function returns the same output for the same input and has no side effects. An impure function reads or changes external state, performs I/O, mutates inputs, or depends on time/randomness.",
    "Purity makes code easier to test and reason about because the function depends only on its arguments. It does not mutate outside state, call APIs, write to storage, or rely on changing values such as `Date.now()`.\n\nImpure functions are not bad; real apps need side effects. The useful pattern is to keep business logic pure where possible and isolate side effects at the edges.",
    "Pure functions are valuable in reducers, selectors, validation, formatting, price calculations, tests, and utility libraries. Impure functions belong in event handlers, API services, and persistence layers.",
    "function pureTotal(items) {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}\n\nlet total = 0;\nfunction impureAdd(price) {\n  total += price;\n  return total;\n}",
    "- Saying pure functions cannot use arrays or objects; they can, if they do not mutate them.\n- Treating all side effects as bad instead of isolating them.\n- Mutating an input array with `sort`, `push`, or `splice` inside a supposedly pure function.",
    "Tie purity to testability: same input, same output, no side effects. Then admit where side effects belong."
  );
}

function curryingGuide(): Enrichment {
  return guide(
    "Currying transforms a function that takes multiple arguments into a chain of functions that each take one argument. It lets you pre-fill arguments and create specialized functions.",
    "Instead of calling `add(2, 3)`, a curried version can be called as `add(2)(3)`. The first call returns a function that remembers the first argument through closure, and the second call completes the calculation.\n\nCurrying is useful for partial application and composition, but it should improve clarity. In everyday frontend code, small factory functions often give the same benefit with less ceremony.",
    "You may use currying for reusable validators, event-handler factories, configuring formatters, Redux-style middleware, and functional utility libraries.",
    "const multiply = (a) => (b) => a * b;\n\nconst double = multiply(2);\nconsole.log(double(5)); // 10\n\nconst minLength = (length) => (value) => value.length >= length;\nconst isLongEnough = minLength(8);",
    "- Confusing currying with simply passing a callback.\n- Making code harder to read by currying everything.\n- Forgetting closures are what keep earlier arguments available.",
    "Give the `add(a)(b)` shape, then explain the practical reason: pre-configuring a reusable function."
  );
}

function freezeConstGuide(): Enrichment {
  return guide(
    "`const` prevents rebinding a variable name. `Object.freeze()` prevents changing an object's own properties at the first level. They solve different problems.",
    "A `const` object can still have its properties changed because the binding points to the same object reference. `Object.freeze(obj)` marks the object's own properties as non-writable and prevents adding/removing own properties.\n\n`Object.freeze()` is shallow. Nested objects can still be changed unless they are also frozen. In modern apps, immutable update patterns are usually preferred over relying on runtime freezing everywhere.",
    "This matters in state management, configuration objects, tests, and preventing accidental mutation of shared constants.",
    "const settings = { theme: \"dark\", nested: { debug: false } };\nsettings.theme = \"light\"; // allowed\n\nObject.freeze(settings);\n// settings.theme = \"dark\"; // TypeError in strict mode\nsettings.nested.debug = true; // still allowed: freeze is shallow",
    "- Saying `const` makes object contents immutable.\n- Forgetting `Object.freeze()` is shallow.\n- Using freeze as a substitute for clear immutable update patterns.",
    "Answer by separating binding immutability from object immutability. That distinction is the whole question."
  );
}

function cloningGuide(): Enrichment {
  return guide(
    "A shallow copy copies only the first level, so nested objects are still shared. A deep copy copies nested data too. Use spread for shallow copies and `structuredClone` for many deep-copy cases.",
    "Object spread, array spread, `Array.from`, and `Object.assign` create shallow copies. They are perfect for updating top-level values but do not protect nested references.\n\nFor deep cloning, prefer `structuredClone` when the data is compatible. It supports many built-in types and handles cycles. JSON stringify/parse is a limited fallback because it drops functions, `undefined`, symbols, dates become strings, and special values can be lost.",
    "Copying comes up in React state updates, reducers, form drafts, undo history, cache updates, and avoiding accidental mutation of objects received from APIs.",
    "const original = { user: { name: \"Asha\" }, tags: [\"js\"] };\nconst shallow = { ...original };\nshallow.user.name = \"Mira\";\nconsole.log(original.user.name); // \"Mira\" - nested object shared\n\nconst deep = structuredClone(original);\ndeep.user.name = \"Nila\";",
    "- Calling spread a deep copy.\n- Using JSON cloning for dates, maps, sets, functions, or cyclic objects.\n- Mutating nested state after making only a shallow copy.",
    "Mention the practical choice: spread for shallow immutable updates, `structuredClone` or a domain-specific clone for deep nested data."
  );
}

function mapSetGuide(): Enrichment {
  return guide(
    "`Map` stores key-value pairs with keys of any type and preserves insertion order. `Set` stores unique values. Use them when object keys or array duplicate checks become awkward.",
    "Plain objects are great for JSON-like records with string keys. `Map` is better when keys are objects, when frequent additions/removals happen, or when you want a clear collection API like `.get`, `.set`, `.has`, and `.size`.\n\nArrays are great for ordered lists. `Set` is better for uniqueness and fast membership checks. Convert between arrays and sets when you need both list rendering and uniqueness.",
    "Use `Map` for caches keyed by objects, request de-duplication, lookup tables, and normalized frontend state. Use `Set` for selected IDs, visited routes, unique tags, and permission checks.",
    "const selectedIds = new Set([1, 2, 2]);\nconsole.log([...selectedIds]); // [1, 2]\nconsole.log(selectedIds.has(2)); // true\n\nconst cache = new Map();\nconst user = { id: 1 };\ncache.set(user, { lastSeen: Date.now() });\nconsole.log(cache.get(user));",
    "- Using an object when keys are not strings or symbols.\n- Forgetting `Set` uniqueness is based on same-value equality, not deep object equality.\n- Serializing `Map` or `Set` directly to JSON and expecting normal output.",
    "Compare by use case: object for records, array for ordered lists, `Map` for keyed collections, `Set` for uniqueness."
  );
}

function spreadGuide(): Enrichment {
  return guide(
    "Spread `...` expands an iterable or object into another array, argument list, or object. It is commonly used for shallow copies and merging.",
    "In arrays, spread expands elements. In function calls, it turns an array into positional arguments. In objects, it copies enumerable own properties into a new object from left to right, so later properties override earlier ones.\n\nSpread is shallow. It copies references for nested objects and arrays, so it does not protect deep data from mutation.",
    "Spread is used constantly in React state updates, composing props, merging defaults, cloning arrays before sorting, and passing dynamic arguments.",
    "const nums = [1, 2, 3];\nconsole.log(Math.max(...nums));\n\nconst defaults = { theme: \"light\", pageSize: 20 };\nconst userPrefs = { pageSize: 50 };\nconst settings = { ...defaults, ...userPrefs };\nconsole.log(settings); // { theme: \"light\", pageSize: 50 }",
    "- Thinking spread deep-clones nested objects.\n- Forgetting object spread order matters; later properties win.\n- Confusing spread in calls/arrays with rest parameters in function definitions.",
    "Mention the three places it appears: arrays, function calls, and objects. Then add the shallow-copy warning."
  );
}

function destructuringGuide(): Enrichment {
  return guide(
    "Destructuring lets you unpack values from arrays or properties from objects into variables. It can also rename variables and provide defaults.",
    "Array destructuring is position-based. Object destructuring is property-name based. Both are shortcuts for pulling values out of structures without repeated property access.\n\nDestructuring is useful but should stay readable. For deeply nested data, too much destructuring can hide null checks and make code harder to debug.",
    "You use destructuring with function parameters, React props, API responses, tuple-like arrays, hooks return values, and configuration objects.",
    "const user = { id: 7, profile: { name: \"Asha\" }, role: undefined };\nconst { id, profile: { name }, role = \"guest\" } = user;\n\nconst [first, second] = [\"a\", \"b\"];\nconsole.log(id, name, role, first, second);",
    "- Destructuring deeply without checking whether parent objects exist.\n- Forgetting array destructuring depends on position.\n- Confusing renaming with default values.",
    "Show one object example and one array example. Mention defaults if you want the answer to feel complete."
  );
}

function restParametersGuide(): Enrichment {
  return guide(
    "Rest parameters collect remaining function arguments into a real array. They use `...` in a function parameter list, which is the opposite direction of spread.",
    "Rest parameters are declared at the end of a function parameter list: `function fn(first, ...rest)`. The collected values are a normal array, so array methods work directly.\n\nThis is cleaner than the old `arguments` object because `arguments` is array-like, not a real array, and it is not available in arrow functions.",
    "Rest parameters are useful for logging wrappers, event emitters, utility functions, variadic math helpers, and forwarding arguments to another function.",
    "function sum(...numbers) {\n  return numbers.reduce((total, n) => total + n, 0);\n}\n\nconsole.log(sum(1, 2, 3)); // 6\n\nfunction logAndCall(fn, ...args) {\n  console.log(args);\n  return fn(...args); // spread forwards them\n}",
    "- Mixing up rest and spread because both use `...`.\n- Placing a rest parameter before other parameters.\n- Treating `arguments` as a modern replacement for rest parameters.",
    "Say: rest gathers values into an array; spread expands values out of an array or object."
  );
}

function mapFilterReduceGuide(kind: "map" | "filter" | "reduce" | "forEachMap" | "aggregate"): Enrichment {
  if (kind === "map") {
    return guide(
      "`.map()` transforms each array item and returns a new array of the same length. Use it when every input item should become one output item.",
      "The callback receives the item, index, and array. Whatever the callback returns becomes the item at the same position in the new array.\n\n`map` is not for side effects. If you do not use the returned array, `forEach` or a `for...of` loop communicates intent better.",
      "Use `map` to render lists, convert API rows into view models, pick specific fields, or format values for display.",
      "const users = [\n  { id: 1, name: \"Asha\" },\n  { id: 2, name: \"Mira\" },\n];\n\nconst labels = users.map((user) => `${user.id}: ${user.name}`);\nconsole.log(labels);",
      "- Mutating items inside `map` and assuming the result is immutable.\n- Forgetting to return from a block-bodied arrow callback.\n- Using `map` when you only want side effects.",
      "Say `same length, transformed values`. That phrase cleanly distinguishes `map` from `filter` and `reduce`."
    );
  }

  if (kind === "filter") {
    return guide(
      "`.filter()` returns a new array containing only items whose callback returns a truthy value. It keeps or removes items; it does not transform them.",
      "The callback is a predicate: it answers yes or no for each item. Items that pass keep their original value and order in the resulting array.\n\nBecause `filter` returns a new array, it is useful for immutable state updates. The original array is not changed.",
      "Use `filter` for search results, hiding disabled items, removing deleted records, selecting active users, and implementing client-side facets.",
      "const tasks = [\n  { title: \"Ship\", done: true },\n  { title: \"Test\", done: false },\n];\n\nconst openTasks = tasks.filter((task) => !task.done);\nconsole.log(openTasks);",
      "- Returning the item itself without understanding truthy/falsy behavior.\n- Expecting `filter` to modify the original array.\n- Using `filter(Boolean)` when valid falsy values like `0` should be kept.",
      "Define it as `keep items that pass a test`. That is the clean interview version."
    );
  }

  if (kind === "reduce" || kind === "aggregate") {
    return guide(
      "`.reduce()` walks an array and carries an accumulator forward, producing one final value such as a sum, object, grouped map, or average.",
      "`reduce` receives an accumulator and the current item. The callback returns the next accumulator. Always provide an initial value unless you intentionally want the first array item to become the accumulator.\n\n`reduce` is powerful, but it can become unreadable. Use it for real aggregation; use `map` or `filter` when those express the intent more clearly.",
      "Use `reduce` for totals, averages, grouping rows by ID, building lookup objects, counting occurrences, and converting arrays into maps.",
      "const scores = [80, 90, 100];\nconst total = scores.reduce((sum, score) => sum + score, 0);\nconst average = total / scores.length;\n\nconsole.log({ total, average });",
      "- Forgetting the initial accumulator value.\n- Using `reduce` for simple transformations where `map` is clearer.\n- Mutating the accumulator accidentally in code that expects immutable data.",
      "Explain the accumulator. If the interviewer asks for an example, use sum or group-by because both show the concept clearly."
    );
  }

  return guide(
    "`.map()` transforms items and returns a new array. `.forEach()` runs side effects for each item and returns `undefined`. Use `map` when you need the transformed result.",
    "Both methods iterate over an array, but their intent is different. `map` is for data transformation: each callback return value becomes part of the new array. `forEach` is for doing something, such as logging, pushing to an external sink, or calling an API.\n\nNeither method is the best choice when you need to `break` early. Use `for...of`, `some`, or `every` for early exit behavior.",
    "Use `map` for rendering UI lists or building payloads. Use `forEach` for instrumentation, registering listeners, or running imperative work for each item.",
    "const numbers = [1, 2, 3];\n\nconst doubled = numbers.map((n) => n * 2);\nconsole.log(doubled); // [2, 4, 6]\n\nnumbers.forEach((n) => console.log(n)); // side effect",
    "- Using `forEach` and expecting a returned array.\n- Using `map` only for side effects.\n- Forgetting neither method supports `break`.",
    "A crisp comparison is: `map` returns transformed data; `forEach` performs side effects."
  );
}

function arrayUtilityGuide(kind: "empty" | "isArray" | "reverseString" | "dedupe" | "secondLargest" | "sort"): Enrichment {
  if (kind === "empty") {
    return guide(
      "To empty an array, assign a new empty array if you own the variable, or set `array.length = 0` if other references should see the same array become empty.",
      "`arr = []` points the variable at a new array. Any other references still point at the old array. `arr.length = 0` mutates the existing array, so all references observe that it is empty.\n\nIn React or immutable state code, prefer creating a new array. In low-level shared-reference code, be explicit if mutation is required.",
      "This matters when clearing UI state, caches, queues, selected IDs, and arrays shared with other modules.",
      "let items = [1, 2, 3];\nconst sameRef = items;\n\nitems = [];\nconsole.log(sameRef); // [1, 2, 3]\n\nsameRef.length = 0;\nconsole.log(sameRef); // []",
      "- Mutating state arrays directly in React.\n- Forgetting `arr = []` does not clear other references.\n- Using `splice` when a clearer reset would do.",
      "Mention reference behavior. That is the part interviewers are really checking."
    );
  }

  if (kind === "isArray") {
    return guide(
      "Use `Array.isArray(value)` to check arrays. `typeof []` returns `\"object\"`, so `typeof` is not enough.",
      "Arrays are objects internally, which is why `typeof []` is not specific. `Array.isArray` reliably checks the internal array brand, including values from different frames or realms where `instanceof Array` can be unreliable.\n\nAfter confirming a value is an array, you can safely use array methods or validate its item types.",
      "Use this when validating API responses, parsing local storage, checking optional props, and guarding utility functions.",
      "function normalizeTags(value) {\n  if (!Array.isArray(value)) return [];\n  return value.map(String);\n}\n\nconsole.log(Array.isArray([])); // true\nconsole.log(typeof []); // \"object\"",
      "- Using `typeof value === \"array\"`.\n- Relying on `instanceof Array` across iframes or realms.\n- Checking only that a value is truthy before calling array methods.",
      "The whole answer can be one sentence plus the `typeof []` caveat. That is enough and precise."
    );
  }

  if (kind === "reverseString") {
    return guide(
      "For simple strings, use `str.split(\"\").reverse().join(\"\")`. For user-facing Unicode text, prefer `Array.from(str).reverse().join(\"\")` or a grapheme-aware approach.",
      "The common split/reverse/join solution works for ASCII and many simple cases. But JavaScript strings are UTF-16, so emoji and combined characters can be split incorrectly.\n\nIn interviews, mention the simple solution first, then show awareness of Unicode if the app handles real user text.",
      "You might reverse strings in coding exercises, text utilities, palindrome checks, or data normalization tasks. For production user names and messages, Unicode handling matters.",
      "function reverseSimple(text) {\n  return text.split(\"\").reverse().join(\"\");\n}\n\nfunction reverseCodePoints(text) {\n  return Array.from(text).reverse().join(\"\");\n}\n\nconsole.log(reverseSimple(\"hello\")); // \"olleh\"",
      "- Forgetting strings are immutable; methods return new values.\n- Ignoring Unicode when reversing user-facing text.\n- Mutating arrays in-place without noticing `reverse()` mutates the array.",
      "For a coding round, give the simple answer fast, then add the Unicode caveat to show senior judgment."
    );
  }

  if (kind === "dedupe") {
    return guide(
      "For primitive values, remove duplicates with `Array.from(new Set(array))` or `[...new Set(array)]`. For objects, dedupe by a stable key such as `id`.",
      "`Set` keeps only unique values using same-value equality. This works well for strings, numbers, booleans, and object references. It does not deep-compare object contents.\n\nFor arrays of objects, use a `Map` keyed by `id` or another unique property so you decide what counts as duplicate.",
      "Dedupe is common for tags, selected IDs, merged API pages, autocomplete options, and cached entities.",
      "const ids = [1, 2, 2, 3];\nconsole.log([...new Set(ids)]); // [1, 2, 3]\n\nconst users = [{ id: 1, name: \"A\" }, { id: 1, name: \"A updated\" }];\nconst uniqueUsers = [...new Map(users.map((user) => [user.id, user])).values()];\nconsole.log(uniqueUsers);",
      "- Expecting `Set` to deep-dedupe different object literals.\n- Losing order requirements by using the wrong structure.\n- Dedupe by display text when a stable ID exists.",
      "Mention primitives vs objects. That distinction turns a basic coding answer into a practical one."
    );
  }

  if (kind === "secondLargest") {
    return guide(
      "Track the largest and second-largest values in one pass. Decide whether duplicates count; most interview solutions ask for the second distinct largest number.",
      "A one-pass solution is better than sorting when you only need the answer. Keep two variables: `largest` and `second`. For each number, update them carefully, skipping duplicates if the requirement says distinct.\n\nAlso handle arrays with fewer than two distinct numbers by returning `null`, throwing, or documenting the behavior.",
      "This pattern appears in ranking, metrics, dashboards, score lists, and coding interviews that test edge cases and loop reasoning.",
      "function secondLargest(numbers) {\n  let largest = -Infinity;\n  let second = -Infinity;\n\n  for (const n of numbers) {\n    if (n > largest) {\n      second = largest;\n      largest = n;\n    } else if (n < largest && n > second) {\n      second = n;\n    }\n  }\n\n  return second === -Infinity ? null : second;\n}\n\nconsole.log(secondLargest([4, 1, 9, 9, 7])); // 7",
      "- Not defining whether duplicate max values count.\n- Returning `-Infinity` for invalid input.\n- Sorting the original array and mutating it by accident.",
      "Start by clarifying `distinct or not?` That small question shows maturity before you code."
    );
  }

  return guide(
    "`sort()` mutates the array it is called on. Clone first with `[...array]` or use `toSorted()` where available when you need an immutable sorted result.",
    "JavaScript array `sort()` sorts in place and returns the same array reference. Chained code can accidentally mutate state, props, cached data, or shared arrays.\n\nAlso remember that default `sort()` compares values as strings. For numbers, pass a comparator like `(a, b) => a - b`.",
    "This matters in React state, Redux reducers, table sorting, cached API data, and any code that relies on previous array order.",
    "const scores = [10, 2, 30];\n\nconst sorted = [...scores].sort((a, b) => a - b);\nconsole.log(sorted); // [2, 10, 30]\nconsole.log(scores); // [10, 2, 30]\n\n// Modern option:\n// const sorted2 = scores.toSorted((a, b) => a - b);",
    "- Forgetting `sort()` mutates the original array.\n- Sorting numbers without a comparator.\n- Mutating React state or props before rendering.",
    "Mention both mutation and numeric comparator. Those are the two bugs interviewers expect you to catch."
  );
}

function templateLiteralGuide(): Enrichment {
  return guide(
    "Template literals use backticks to create strings with interpolation, multiline text, and tagged-template support. Interpolate expressions with `${...}`.",
    "Unlike normal quoted strings, template literals can span multiple lines and embed expressions directly. The expression is evaluated and converted to a string.\n\nTagged templates are an advanced form where a function receives the string parts and expression values. Libraries use them for CSS-in-JS, SQL builders, and safe formatting.",
    "Use template literals for readable UI labels, logging, URLs, generated messages, and any string that combines static text with variables.",
    "const user = { name: \"Asha\", count: 3 };\nconst message = `Hi ${user.name}, you have ${user.count} tasks.`;\n\nconst multiline = `first line\nsecond line`;\nconsole.log(message, multiline);",
    "- Forgetting interpolation only works inside backticks.\n- Building unsafe HTML or SQL strings without escaping.\n- Overusing complex expressions inside `${...}` instead of computing a named variable first.",
    "Say interpolation and multiline support first. Tagged templates are a nice bonus if the interviewer asks for depth."
  );
}

function optionalChainingGuide(): Enrichment {
  return guide(
    "Optional chaining `?.` safely reads a property, calls a function, or indexes a value when the left side may be `null` or `undefined`. It returns `undefined` instead of throwing.",
    "`user?.profile?.name` stops evaluation if `user` or `profile` is nullish. It does not stop on other falsy values like `0`, `false`, or `\"\"`.\n\nOptional chaining is for safe access, not for hiding required-data problems. If a value must exist, validate it and fail clearly.",
    "Use it when rendering optional API fields, reading nested configuration, calling optional callbacks, or handling partially loaded data.",
    "const user = null;\nconsole.log(user?.profile?.name); // undefined\n\nconst callbacks = { onDone: undefined };\ncallbacks.onDone?.(); // safe no-op",
    "- Thinking `?.` handles all falsy values; it only handles `null` and `undefined`.\n- Overusing it until real data problems are hidden.\n- Forgetting optional function call syntax: `fn?.()`.",
    "Pair it with nullish coalescing: `user?.name ?? \"Guest\"`. That shows you know both safe access and defaults."
  );
}

function nullishGuide(): Enrichment {
  return guide(
    "Nullish coalescing `??` returns the right-hand value only when the left-hand value is `null` or `undefined`. It preserves valid falsy values like `0`, `false`, and `\"\"`.",
    "`||` uses truthiness, so it replaces any falsy value. That can break legitimate values such as `0` page size, an empty string input, or `false` feature flag.\n\n`??` is better when you mean missing value rather than falsy value. It often pairs with optional chaining for safe defaults.",
    "Use `??` for default settings, API fallback values, form fields, pagination, feature flags, and user preferences where falsy values may be valid.",
    "const pageSize = 0;\n\nconsole.log(pageSize || 20); // 20, maybe wrong\nconsole.log(pageSize ?? 20); // 0, preserves explicit value\n\nconst displayName = user?.name ?? \"Guest\";",
    "- Replacing every `||` default with `??` without checking intent.\n- Forgetting `??` only handles `null` and `undefined`.\n- Mixing `??` with `||` or `&&` without parentheses.",
    "Use one example with `0` or `false`; it makes the difference instantly clear."
  );
}

function modulesGuide(): Enrichment {
  return guide(
    "ES modules let files export values and import them explicitly. `export` exposes bindings; `import` brings them into another module. Modules are strict mode by default.",
    "ES modules create a static dependency graph, which helps bundlers tree-shake unused exports and lets browsers load modules predictably. Imports are live bindings, meaning an imported binding reflects updates made by the exporting module.\n\nPrefer named exports for shared utilities and default exports when a module has one obvious main value. Teams often choose one style consistently for easier refactors.",
    "Modules organize frontend code into components, utilities, services, hooks, constants, and feature boundaries. They also make dependency relationships easier to test and review.",
    "// math.js\nexport function add(a, b) {\n  return a + b;\n}\n\n// app.js\nimport { add } from \"./math.js\";\nconsole.log(add(2, 3));",
    "- Mixing CommonJS and ESM rules without understanding the runtime/bundler.\n- Forgetting file paths usually need extensions in native browser ESM.\n- Creating circular imports that read values before initialization.",
    "Mention strict mode, static imports, and named/default exports. That is enough for most frontend interviews."
  );
}

function eventLoopGuide(): Enrichment {
  return guide(
    "The event loop lets JavaScript run non-blocking work on a single main thread. After the current call stack finishes, microtasks such as promise callbacks run before the next macrotask such as `setTimeout`.",
    "JavaScript executes synchronous code on the call stack. Browser or Node APIs handle timers, network, and events outside the stack. When async work is ready, callbacks are queued.\n\nMicrotasks include promise reactions and `queueMicrotask`; they run after the current stack empties and before rendering/next macrotask. Macrotasks include timers, user events, and message tasks. Too many microtasks can delay rendering because the browser drains the microtask queue first.",
    "This matters when debugging why a Promise runs before `setTimeout`, why long loops freeze the UI, why rendering waits for JS to finish, and why async code ordering can surprise users.",
    "console.log(\"start\");\n\nsetTimeout(() => console.log(\"timeout\"), 0);\nPromise.resolve().then(() => console.log(\"promise\"));\n\nconsole.log(\"end\");\n// start, end, promise, timeout",
    "- Saying JavaScript is multi-threaded because async code exists.\n- Forgetting promise callbacks are microtasks and usually run before timers.\n- Blocking the main thread with heavy synchronous work.",
    "Give the output-order example. It is the clearest way to prove you understand microtasks versus macrotasks."
  );
}

function callbackGuide(): Enrichment {
  return guide(
    "A callback is a function passed to another function to be called later. Callback hell happens when many nested callbacks make control flow, errors, and sequencing hard to read.",
    "Callbacks are a core JavaScript pattern because functions are first-class values. They work for events, timers, array methods, and async APIs.\n\nThe problem is not callbacks themselves; it is deep nesting and scattered error handling. Promises and `async`/`await` flatten async control flow, while named functions can make callback code clearer.",
    "Callbacks appear in event listeners, array methods, Node-style APIs, timers, and library hooks. Understanding them helps you read both modern and legacy JavaScript.",
    "function loadUser(id, onSuccess, onError) {\n  fetch(`/api/users/${id}`)\n    .then((res) => res.json())\n    .then(onSuccess)\n    .catch(onError);\n}\n\nloadUser(1, console.log, console.error);",
    "- Calling every async function a callback.\n- Nesting callbacks deeply instead of composing named functions or promises.\n- Forgetting to handle errors in callback-based APIs.",
    "Define callback broadly first, then explain callback hell as a maintainability problem, not a separate feature."
  );
}

function promiseGuide(): Enrichment {
  return guide(
    "A Promise represents a future value that is pending, fulfilled, or rejected. Use `.then()`/`.catch()` or `await` to handle the eventual result.",
    "Promises give async work a composable structure. A promise starts pending, then settles once as fulfilled or rejected. `.then` returns a new promise, which is why promise chains can transform values and sequence async operations.\n\nErrors thrown inside a promise chain become rejections. Always return nested promises from `.then` callbacks or use `await` so the chain waits correctly.",
    "Promises power `fetch`, async data loading, route transitions, file operations, cache refreshes, and any operation that completes later.",
    "function getUser(id) {\n  return fetch(`/api/users/${id}`)\n    .then((res) => {\n      if (!res.ok) throw new Error(`HTTP ${res.status}`);\n      return res.json();\n    });\n}\n\ngetUser(1).then(console.log).catch(console.error);",
    "- Forgetting a promise settles only once.\n- Not returning a promise inside `.then`, causing the chain to continue too early.\n- Handling success but forgetting `.catch` or rejection paths.",
    "Use the states `pending`, `fulfilled`, `rejected`, then mention chaining. That is the core mental model."
  );
}

function promiseCombinatorGuide(): Enrichment {
  return guide(
    "`Promise.all()` waits for all promises and rejects if any one rejects. `Promise.race()` settles as soon as the first promise settles, whether fulfilled or rejected.",
    "`Promise.all` is for parallel work where every result is required. The result order matches the input order, not completion order. If one promise rejects, the whole `Promise.all` rejects.\n\n`Promise.race` is for first-settled behavior, such as timeouts or choosing the fastest source. Other useful combinators are `Promise.allSettled` when you need every outcome and `Promise.any` when you need the first successful fulfillment.",
    "Use `Promise.all` to load independent data for a page. Use `Promise.race` for request timeouts or fallback races. Use `allSettled` for dashboards where partial failures should still be shown.",
    "const [user, orders] = await Promise.all([\n  fetchJson(\"/api/user\"),\n  fetchJson(\"/api/orders\"),\n]);\n\nconst result = await Promise.race([\n  fetchJson(\"/api/slow\"),\n  timeout(3000),\n]);",
    "- Thinking `Promise.all` runs promises; promises usually start when created.\n- Forgetting `Promise.all` fails fast on the first rejection.\n- Using `race` when you actually need the first successful result; that is `Promise.any`.",
    "Compare by failure behavior and completion rule. That is more useful than only saying `all waits, race is first`."
  );
}

function asyncAwaitGuide(): Enrichment {
  return guide(
    "`async` functions always return a Promise. `await` pauses that async function until the Promise settles, making async code read like step-by-step synchronous code.",
    "`await` does not block the whole JavaScript thread; it yields control back to the event loop while the awaited promise is pending. When the promise settles, the async function continues in a microtask.\n\nUse `try/catch` around awaited operations when you need local error handling. Start independent promises before awaiting them if they can run in parallel.",
    "Use `async`/`await` for API calls, form submissions, route loaders, retry logic, file uploads, and any workflow where readable sequencing matters.",
    "async function loadDashboard() {\n  try {\n    const [user, stats] = await Promise.all([\n      fetchJson(\"/api/user\"),\n      fetchJson(\"/api/stats\"),\n    ]);\n    return { user, stats };\n  } catch (error) {\n    console.error(\"Could not load dashboard\", error);\n    throw error;\n  }\n}",
    "- Thinking `await` blocks the entire browser thread.\n- Awaiting independent requests one by one and making them slower.\n- Forgetting an `async` function wraps returned values in a Promise.",
    "Say `async returns a Promise` and `await pauses only the async function`. Those two details prevent most wrong answers."
  );
}

function asyncErrorGuide(): Enrichment {
  return guide(
    "Handle `async`/`await` errors with `try/catch`, or let the rejection bubble to a caller that can handle it. For `fetch`, also check `response.ok` because HTTP 404/500 do not reject automatically.",
    "`await` turns a rejected promise into a thrown error at that line, so normal `try/catch` works. Catch only where you can add useful behavior such as showing a message, retrying, logging context, or converting the error.\n\nFor multiple independent promises, choose the right combinator. `Promise.all` fails fast, while `Promise.allSettled` lets you inspect successes and failures separately.",
    "This matters in form submissions, API calls, dashboards with partial data, upload flows, and any user action where failure needs a clear UI response.",
    "async function saveProfile(data) {\n  try {\n    const res = await fetch(\"/api/profile\", {\n      method: \"POST\",\n      body: JSON.stringify(data),\n    });\n\n    if (!res.ok) throw new Error(`Save failed: ${res.status}`);\n    return await res.json();\n  } catch (error) {\n    console.error(error);\n    throw error;\n  }\n}",
    "- Wrapping everything in `try/catch` and swallowing the error.\n- Forgetting to check `response.ok` for HTTP errors.\n- Losing useful context by throwing generic errors everywhere.",
    "A good answer separates transport errors, HTTP status errors, and application validation errors."
  );
}

function fetchGuide(): Enrichment {
  return guide(
    "`fetch()` starts an HTTP request and returns a Promise for a `Response`. It rejects for network-level failures, but not for HTTP error statuses like 404 or 500.",
    "The `Response` object contains status, headers, and body-reading methods such as `.json()` and `.text()`. Body reading is also async because the response stream may arrive over time.\n\nAlways check `response.ok` or the status code before treating the response as success. Also consider timeouts, cancellation, retries, and request body serialization for production code.",
    "Use `fetch` for loading API data, submitting forms, refreshing dashboards, downloading assets, and calling backend-for-frontend endpoints.",
    "async function fetchJson(url) {\n  const res = await fetch(url);\n\n  if (!res.ok) {\n    throw new Error(`HTTP ${res.status}`);\n  }\n\n  return res.json();\n}",
    "- Assuming `fetch` rejects on 404 or 500.\n- Forgetting to `await res.json()`.\n- Sending an object body without `JSON.stringify` and appropriate headers.",
    "Mention the two-step process: await the response, check status, then parse the body."
  );
}

function fetchTimeoutGuide(): Enrichment {
  return guide(
    "Use `AbortController` to cancel a `fetch` after a timer. Pass `controller.signal` to `fetch`, call `abort()` when the timeout expires, and always clear the timer in `finally`.",
    "`fetch` does not have a built-in timeout option in the basic API. `AbortController` is the standard cancellation mechanism. When aborted, the fetch rejects with an abort error.\n\nA reliable helper should handle cleanup, avoid leaving timers running, and allow callers to pass their own fetch options. In production, distinguish timeout/cancel errors from HTTP status errors.",
    "Use this for search suggestions, route transitions, dashboard widgets, upload flows, or any UI where stale slow requests should not keep running forever.",
    "async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {\n  const controller = new AbortController();\n  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);\n\n  try {\n    const response = await fetch(url, {\n      ...options,\n      signal: controller.signal,\n    });\n\n    if (!response.ok) throw new Error(`HTTP ${response.status}`);\n    return response;\n  } finally {\n    clearTimeout(timeoutId);\n  }\n}",
    "- Racing fetch against a timeout without aborting the actual network request.\n- Forgetting to clear the timer.\n- Treating abort, network failure, and HTTP error as the same kind of failure.",
    "Say `Promise.race` alone is not enough because it does not cancel the request. `AbortController` is the important part."
  );
}

function returnAwaitGuide(): Enrichment {
  return guide(
    "`return fetch()` returns the promise directly. `return await fetch()` waits inside the current async function, which is mainly useful when a local `try/catch` or `finally` must observe the error or cleanup timing.",
    "In a simple async function, `return await promise` is usually redundant because async functions already wrap returned values in promises. However, inside `try/catch`, `return await` lets the rejection be caught in that function.\n\nIt also affects stack traces and `finally` timing in some cases. Modern linters no longer treat every `return await` as bad; the question is whether local error handling or cleanup needs it.",
    "Use `return await` when translating errors, logging context, measuring duration, releasing locks, or ensuring cleanup happens after the awaited operation settles.",
    "async function direct() {\n  return fetch(\"/api/user\");\n}\n\nasync function withContext() {\n  try {\n    return await fetch(\"/api/user\");\n  } catch (error) {\n    throw new Error(\"Loading user failed\", { cause: error });\n  }\n}",
    "- Saying `return await` is always wrong.\n- Forgetting local `try/catch` will not catch a returned promise unless it is awaited.\n- Adding `await` everywhere without a reason.",
    "Answer with nuance: redundant in simple returns, useful for local catch/finally behavior."
  );
}

function concurrentApiGuide(): Enrichment {
  return guide(
    "Run independent API calls with controlled concurrency: process a queue with a small limit instead of firing all 100 at once. Use `Promise.all` per batch or a concurrency limiter.",
    "If the calls are independent, sequential `await` is too slow, but unbounded `Promise.all(100 requests)` can overwhelm the browser, backend, or rate limits. Controlled concurrency keeps a fixed number of requests in flight.\n\nAdd retries with backoff for transient errors, cancellation for stale screens, and partial-failure handling if one failed request should not discard all successful results.",
    "This pattern appears in dashboards, bulk imports, image processing, background sync, search indexing, and pages that hydrate many related resources.",
    "async function mapWithConcurrency(items, limit, worker) {\n  const results = [];\n  let nextIndex = 0;\n\n  async function run() {\n    while (nextIndex < items.length) {\n      const current = nextIndex++;\n      results[current] = await worker(items[current], current);\n    }\n  }\n\n  await Promise.all(Array.from({ length: limit }, run));\n  return results;\n}\n\nconst users = await mapWithConcurrency(ids, 5, (id) => fetchJson(`/api/users/${id}`));",
    "- Using one giant `Promise.all` without considering rate limits.\n- Awaiting calls one by one when they are independent.\n- Failing the whole workflow when partial success is acceptable.",
    "Say `bounded parallelism`. Then discuss limit choice, error handling, retries, and cancellation."
  );
}

function debounceThrottleGuide(kind: "debounce" | "throttle" | "compare"): Enrichment {
  if (kind === "debounce") {
    return guide(
      "Debouncing waits until activity stops for a delay, then runs the function once. It is ideal for search input, autosave, and validation after the user pauses.",
      "Each call resets the timer. Only the final call after the quiet period actually runs. This reduces wasted work when many events happen quickly.\n\nDebounce can run on the trailing edge, leading edge, or both depending on implementation. For UI, trailing-edge debounce is common because it uses the user's final value.",
      "Use debouncing for search boxes, resize recalculation after dragging stops, autosave after typing, and validation after input settles.",
      "function debounce(fn, delay) {\n  let timeoutId;\n\n  return function (...args) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\nconst onSearch = debounce((query) => fetchResults(query), 300);",
      "- Using debounce for work that must happen regularly during continuous activity.\n- Forgetting to cancel timers when components unmount.\n- Losing `this` or arguments in a hand-written helper.",
      "Use the phrase `wait until the user stops`. It immediately distinguishes debounce from throttle."
    );
  }

  if (kind === "throttle") {
    return guide(
      "Throttling runs a function at most once per time window. It is ideal for scroll, resize, drag, and pointer-move work that must update regularly but not too often.",
      "While events keep firing, throttle guarantees a maximum execution rate. For example, a throttled handler might run once every 100ms no matter how many scroll events happen.\n\nImplementations can run on the leading edge, trailing edge, or both. Choose based on whether the UI needs an immediate first update, a final update, or both.",
      "Use throttling for scroll progress, canvas redraws during resize, drag previews, infinite-scroll checks, and analytics events that should sample activity.",
      "function throttle(fn, interval) {\n  let lastRun = 0;\n\n  return function (...args) {\n    const now = Date.now();\n    if (now - lastRun >= interval) {\n      lastRun = now;\n      fn.apply(this, args);\n    }\n  };\n}\n\nwindow.addEventListener(\"resize\", throttle(redrawCanvas, 100));",
      "- Using throttle for search input where the final value matters most.\n- Forgetting trailing behavior, causing the last event to be missed.\n- Doing heavy work inside the handler before throttling.",
      "Use the phrase `at most once every N milliseconds`. That is the clearest throttle definition."
    );
  }

  return guide(
    "Debounce waits for activity to stop; throttle runs at a steady maximum rate. For heavy canvas redraw during continuous resize, throttle is usually better, possibly with a final trailing redraw.",
    "Debounce is best when only the final value matters, like search after typing. Throttle is best when the UI needs periodic updates during continuous activity, like scroll position or resize drawing.\n\nFor canvas resize, users expect the visual to keep up while resizing, but not redraw hundreds of times per second. Throttle the redraw and optionally run one final redraw when resizing stops.",
    "Use this decision whenever you optimize high-frequency events such as input, resize, scroll, mousemove, drag, and sensor updates.",
    "const redrawDuringResize = throttle(redrawCanvas, 100);\nconst finalRedraw = debounce(redrawCanvas, 150);\n\nwindow.addEventListener(\"resize\", () => {\n  redrawDuringResize();\n  finalRedraw();\n});",
    "- Choosing debounce when users need ongoing feedback.\n- Choosing throttle when only the final value matters.\n- Ignoring cleanup of timers/listeners in component unmount code.",
    "Frame the choice around user experience: final answer after quiet period vs steady updates during activity."
  );
}

function domGuide(kind: "dom" | "bubbling" | "delegation" | "preventStop" | "select" | "storage" | "load"): Enrichment {
  if (kind === "dom") {
    return guide(
      "The DOM is the browser's object representation of an HTML document. JavaScript uses DOM APIs to read, create, update, and listen to elements on the page.",
      "When HTML is parsed, the browser builds a tree of nodes: document, elements, text, comments, and attributes. JavaScript can query that tree and change it through APIs such as `querySelector`, `classList`, `append`, and event listeners.\n\nFrameworks like React still ultimately update the DOM, but they add an abstraction that decides what DOM changes are needed.",
      "You use the DOM when wiring event listeners, focusing inputs, measuring element sizes, integrating third-party widgets, portals, accessibility behavior, and browser APIs.",
      "const button = document.querySelector(\"button\");\n\nbutton?.addEventListener(\"click\", () => {\n  document.body.classList.toggle(\"is-active\");\n});",
      "- Thinking the DOM is the same thing as the original HTML string.\n- Mutating DOM directly in framework-managed areas without care.\n- Forgetting DOM APIs may return `null` when elements are missing.",
      "Define it as a tree of objects representing the page, then mention JavaScript reads and updates that tree."
    );
  }

  if (kind === "bubbling") {
    return guide(
      "Event bubbling means an event starts at the target element and then travels upward through its ancestors. Parent elements can react to child events during this bubble phase.",
      "Browser events usually move through capture, target, and bubble phases. Most handlers listen during bubbling by default. If a button inside a card is clicked, the button handler can run and then the card handler can run too.\n\nBubbling enables event delegation, but it can also cause accidental parent behavior if you do not manage propagation intentionally.",
      "Bubbling matters for menus, modals, table rows, nested buttons, analytics tracking, and delegated list handlers.",
      "document.querySelector(\".list\")?.addEventListener(\"click\", (event) => {\n  const button = event.target.closest(\"button[data-id]\");\n  if (!button) return;\n\n  console.log(\"Clicked item\", button.dataset.id);\n});",
      "- Mixing up bubbling with capturing.\n- Calling `stopPropagation` everywhere instead of designing event flow.\n- Forgetting `event.target` is the original element, while `event.currentTarget` is the element handling the event.",
      "Mention target -> parent -> ancestors, then connect it to event delegation."
    );
  }

  if (kind === "delegation") {
    return guide(
      "Event delegation attaches one listener to a parent and handles events from matching children using bubbling. It is efficient for dynamic lists.",
      "Instead of adding a listener to every item, listen on a stable ancestor. When an event bubbles up, inspect `event.target` or `closest()` to find whether a relevant child was clicked.\n\nDelegation works best for events that bubble. It reduces listener setup, handles items added later, and keeps cleanup simple.",
      "Use delegation for tables, menus, todo lists, command palettes, dropdowns, and large lists where rows are added or removed dynamically.",
      "const list = document.querySelector(\"#todo-list\");\n\nlist?.addEventListener(\"click\", (event) => {\n  const item = event.target.closest(\"[data-todo-id]\");\n  if (!item || !list.contains(item)) return;\n\n  console.log(\"toggle\", item.dataset.todoId);\n});",
      "- Forgetting to check that the matched child belongs to the parent.\n- Using delegation for events that do not bubble without understanding alternatives.\n- Reading `event.target` as if it is always the parent.",
      "Use the phrase `one parent listener for many child elements`. Then mention dynamic children."
    );
  }

  if (kind === "preventStop") {
    return guide(
      "`preventDefault()` cancels the browser's default action. `stopPropagation()` stops the event from continuing through the capture/bubble path. They solve different problems.",
      "Use `preventDefault` when you want to stop default browser behavior, such as form submission, link navigation, or checkbox toggling. Use `stopPropagation` when parent listeners should not receive the event.\n\nThey can be used together, but doing so casually can break accessibility, analytics, keyboard behavior, or parent components that expect events.",
      "This matters in custom forms, nested clickable cards, modals, dropdowns, drag-and-drop, and link/button interactions.",
      "form.addEventListener(\"submit\", (event) => {\n  event.preventDefault(); // do not reload page\n  saveForm();\n});\n\nbutton.addEventListener(\"click\", (event) => {\n  event.stopPropagation(); // parent card click should not run\n});",
      "- Using `stopPropagation` when the real goal is to stop navigation or form submit.\n- Calling both methods by habit.\n- Breaking keyboard or accessibility behavior by blocking defaults without replacing them.",
      "Compare default action versus event travel. That distinction is the whole answer."
    );
  }

  if (kind === "select") {
    return guide(
      "Use `document.querySelector()` for the first CSS selector match and `document.querySelectorAll()` for all matches. More specific APIs include `getElementById` and `getElementsByClassName`.",
      "`querySelector` and `querySelectorAll` accept normal CSS selectors, which makes them flexible and familiar. `querySelectorAll` returns a static `NodeList`, not a live HTMLCollection.\n\nAlways handle missing elements because `querySelector` can return `null`. In framework apps, prefer refs or framework patterns for elements owned by the framework.",
      "Use DOM selection for progressive enhancement, small scripts, tests, third-party integrations, focus management, and browser API work outside framework-rendered state.",
      "const form = document.querySelector(\"form[data-login]\");\nconst buttons = document.querySelectorAll(\"button[data-action]\");\n\nbuttons.forEach((button) => {\n  button.addEventListener(\"click\", () => console.log(button.dataset.action));\n});",
      "- Forgetting `querySelector` can return `null`.\n- Expecting `querySelectorAll` to update live when the DOM changes.\n- Manipulating framework-owned DOM directly instead of using state/refs.",
      "Mention CSS selectors and null handling. That is the practical knowledge interviewers look for."
    );
  }

  if (kind === "storage") {
    return guide(
      "`localStorage` persists until cleared, `sessionStorage` lasts for the tab/session, and cookies are sent with HTTP requests when their rules match.",
      "Web Storage stores string key-value pairs and is accessible from JavaScript. It is convenient but synchronous, size-limited, and not appropriate for sensitive secrets.\n\nCookies can be configured with expiration, path, domain, `HttpOnly`, `Secure`, and `SameSite`. `HttpOnly` cookies cannot be read by JavaScript, which makes them useful for session tokens.",
      "Use local storage for non-sensitive preferences, session storage for temporary per-tab state, and secure HttpOnly cookies for auth/session flows.",
      "localStorage.setItem(\"theme\", \"dark\");\nconsole.log(localStorage.getItem(\"theme\"));\n\nsessionStorage.setItem(\"draft\", JSON.stringify({ title: \"Hi\" }));\n\n// Cookie security attributes are set by the server for auth cookies.",
      "- Storing access tokens or secrets in localStorage without understanding XSS risk.\n- Forgetting Web Storage stores strings only.\n- Assuming cookies are always available to JavaScript; HttpOnly cookies are not.",
      "Compare lifetime, JavaScript access, and whether the value is sent to the server. That gives a complete answer."
    );
  }

  return guide(
    "`DOMContentLoaded` fires when the HTML has been parsed and the DOM tree is ready. `window.onload` fires later, after images, stylesheets, iframes, and other subresources finish loading.",
    "Use `DOMContentLoaded` when your script only needs elements to exist. Use `load` when layout-affecting resources or media must be fully available.\n\nModern scripts often use `defer` or modules, which execute after parsing and before `DOMContentLoaded`, reducing the need for manual listeners.",
    "This matters when initializing widgets, measuring images, running legacy scripts, or deciding when page setup code should run.",
    "document.addEventListener(\"DOMContentLoaded\", () => {\n  console.log(\"DOM is ready\");\n});\n\nwindow.addEventListener(\"load\", () => {\n  console.log(\"all resources loaded\");\n});",
    "- Using `load` for simple DOM setup and delaying interactivity unnecessarily.\n- Measuring images before they load.\n- Forgetting deferred/module scripts already wait for parsing.",
    "Say DOM ready versus all resources loaded. That concise contrast is usually enough."
  );
}

function restApiGuide(): Enrichment {
  return guide(
    "A REST API exposes resources over HTTP using URLs, methods, status codes, headers, and representations such as JSON. The client uses standard HTTP semantics to read or change resources.",
    "REST is an architectural style, not just any JSON endpoint. A resource might be `/users/42`, and HTTP methods express intent: `GET` reads, `POST` creates or triggers processing, `PUT` replaces, `PATCH` partially updates, and `DELETE` removes.\n\nGood REST APIs use meaningful status codes, predictable resource names, validation errors, pagination, and authentication/authorization.",
    "Frontend developers use REST APIs to load page data, submit forms, authenticate users, update dashboards, and integrate with backend services.",
    "async function updateUser(id, patch) {\n  const res = await fetch(`/api/users/${id}`, {\n    method: \"PATCH\",\n    headers: { \"Content-Type\": \"application/json\" },\n    body: JSON.stringify(patch),\n  });\n\n  if (!res.ok) throw new Error(`HTTP ${res.status}`);\n  return res.json();\n}",
    "- Treating every HTTP API as REST without resource semantics.\n- Using `GET` for actions that change server state.\n- Ignoring status codes and assuming every JSON response is success.",
    "Mention resources, methods, status codes, and JSON. That is the compact full answer."
  );
}

function httpMethodsGuide(): Enrichment {
  return guide(
    "Common HTTP methods are `GET` to read, `POST` to create or submit, `PUT` to replace, `PATCH` to partially update, and `DELETE` to remove.",
    "The method communicates intent to the server and to infrastructure like caches and proxies. `GET` should be safe and not change server state. `PUT` is usually idempotent replacement. `PATCH` changes part of a resource. `POST` is flexible and often used for creation or actions.\n\nCorrect method choice improves caching, observability, API consistency, and team understanding.",
    "You choose HTTP methods when wiring forms, CRUD screens, bulk actions, uploads, and frontend API clients.",
    "await fetch(\"/api/users\", { method: \"GET\" });\nawait fetch(\"/api/users\", { method: \"POST\", body: JSON.stringify(newUser) });\nawait fetch(\"/api/users/42\", { method: \"PATCH\", body: JSON.stringify({ name: \"Asha\" }) });\nawait fetch(\"/api/users/42\", { method: \"DELETE\" });",
    "- Using `GET` for mutations because it is easy to test in a browser.\n- Mixing up `PUT` replacement and `PATCH` partial update.\n- Ignoring idempotency when designing retry behavior.",
    "Define each method by intent, then add `GET should not mutate`. That last detail is important."
  );
}

function websocketGuide(): Enrichment {
  return guide(
    "A WebSocket is a persistent, full-duplex connection between browser and server. After the handshake, both sides can send messages without creating a new HTTP request each time.",
    "WebSockets are useful when the server needs to push updates immediately or when frequent bidirectional messages would make polling inefficient. They require connection lifecycle handling: open, message, error, close, reconnect, heartbeat, and backpressure.\n\nThey are not a replacement for every API. Normal request/response data often stays simpler with HTTP.",
    "Use WebSockets for chat, multiplayer presence, collaborative editing, live dashboards, notifications, trading screens, and real-time monitoring.",
    "const socket = new WebSocket(\"wss://example.com/socket\");\n\nsocket.addEventListener(\"open\", () => {\n  socket.send(JSON.stringify({ type: \"join\", room: \"general\" }));\n});\n\nsocket.addEventListener(\"message\", (event) => {\n  const message = JSON.parse(event.data);\n  console.log(message);\n});",
    "- Using WebSockets when occasional polling or server-sent events would be simpler.\n- Forgetting reconnect and heartbeat behavior.\n- Trusting incoming messages without validation.",
    "Compare it to HTTP: persistent bidirectional connection versus one request/response at a time."
  );
}

function jsonGuide(): Enrichment {
  return guide(
    "JSON is a text format for structured data. `JSON.parse()` converts JSON text into JavaScript values, and `JSON.stringify()` converts JavaScript values into JSON text.",
    "JSON supports objects, arrays, strings, numbers, booleans, and `null`. It does not support functions, `undefined`, symbols, comments, `Date` objects as dates, `Map`, or `Set` directly.\n\nBecause JSON is text, it is language-independent and common for HTTP APIs. Always handle parse errors when reading untrusted or manually stored JSON.",
    "Use JSON for API request/response bodies, local storage serialization, configuration, logs, and data exchange between frontend and backend services.",
    "const text = '{\"name\":\"Asha\",\"active\":true}';\nconst user = JSON.parse(text);\n\nconst payload = JSON.stringify({ id: 1, tags: [\"js\"] });\nconsole.log(user.name, payload);",
    "- Calling a JavaScript object literal JSON; JSON is text and requires double-quoted keys.\n- Forgetting `JSON.parse` can throw.\n- Expecting functions, `undefined`, dates, maps, or sets to survive normal JSON serialization.",
    "Say `JSON is text, not an object`. That clears up a very common beginner confusion."
  );
}

function syncAsyncGuide(): Enrichment {
  return guide(
    "Synchronous code runs line by line and blocks the current thread until it finishes. Asynchronous code starts work that completes later, allowing JavaScript to continue and handle the result through callbacks, promises, or `async`/`await`.",
    "JavaScript has one main call stack in the browser for running your code. Long synchronous work blocks user input and rendering. Async APIs let the browser or runtime wait for timers, network, or events without keeping the stack busy.\n\nWhen async work completes, its continuation is queued and later run by the event loop. This is why code after an async call often runs before the async result is available.",
    "This matters for fetching data, timers, animations, user input, file uploads, and keeping UIs responsive during expensive work.",
    "console.log(\"A\");\n\nsetTimeout(() => console.log(\"C\"), 0);\nPromise.resolve().then(() => console.log(\"B\"));\n\nconsole.log(\"D\");\n// A, D, B, C",
    "- Thinking async means parallel JavaScript execution on the same thread.\n- Blocking the UI with long synchronous loops.\n- Forgetting async results are not available immediately after starting the work.",
    "Tie the answer to responsiveness: sync blocks; async lets work complete later while the app keeps moving."
  );
}

function scopeGuide(): Enrichment {
  return guide(
    "Scope is where a variable can be accessed. JavaScript has global scope, function scope, block scope for `let`/`const`, and module scope in ES modules.",
    "When code reads a variable, JavaScript looks in the current scope first, then outward through parent lexical scopes. This lexical scope chain is created by where code is written, not where it is called.\n\n`var` is function-scoped; `let` and `const` are block-scoped. Closures work because inner functions keep access to outer lexical scopes.",
    "Scope matters for avoiding global variables, writing callbacks, understanding closures, preventing naming collisions, and organizing modules.",
    "const globalName = \"outer\";\n\nfunction greet() {\n  const message = \"hello\";\n\n  if (true) {\n    let name = \"Asha\";\n    console.log(message, name, globalName);\n  }\n\n  // console.log(name); // ReferenceError\n}",
    "- Thinking scope is based on who calls the function.\n- Forgetting `var` ignores block scope.\n- Leaking values into global scope by assigning undeclared variables in sloppy mode.",
    "Mention lexical lookup and the difference between function scope and block scope. That covers the important parts."
  );
}

function memoryLeakGuide(): Enrichment {
  return guide(
    "A JavaScript memory leak happens when objects are no longer needed but are still reachable, so the garbage collector cannot free them.",
    "JavaScript garbage collection frees values that are not reachable from active roots such as globals, closures, DOM references, timers, and event listeners. A leak happens when you keep an accidental reference alive.\n\nCommon causes include forgotten event listeners, timers/intervals, caches that never evict, closures holding large objects, detached DOM nodes, and long-lived subscriptions.",
    "Memory leaks show up in single-page apps, dashboards, infinite-scroll lists, media-heavy pages, and components that mount/unmount repeatedly.",
    "function mount() {\n  const bigData = new Array(100000).fill(\"data\");\n\n  function onResize() {\n    console.log(bigData.length);\n  }\n\n  window.addEventListener(\"resize\", onResize);\n\n  return () => {\n    window.removeEventListener(\"resize\", onResize);\n  };\n}",
    "- Assuming garbage collection prevents all leaks automatically.\n- Forgetting to clean up listeners, intervals, observers, and subscriptions.\n- Keeping unbounded caches or arrays of historical data.",
    "Say `still reachable` rather than `not deleted`. That is the accurate garbage-collection concept."
  );
}

function javascriptOverviewGuide(): Enrichment {
  return guide(
    "JavaScript is the standard programming language of the web. It runs in browsers for interactive UI and in runtimes like Node.js for servers, tooling, scripts, and APIs.",
    "JavaScript is high-level, garbage-collected, dynamically typed, and based on the ECMAScript standard. It supports multiple styles: functional programming with first-class functions, object-oriented programming through prototypes/classes, and event-driven programming for user interfaces.\n\nIts importance comes from reach: every modern browser runs it, and the ecosystem covers frontend apps, backend services, build tools, testing, mobile wrappers, and desktop apps.",
    "You use JavaScript to respond to user events, validate forms, render UI, call APIs, update state, build tooling, automate workflows, and run full-stack applications.",
    "const button = document.querySelector(\"button\");\n\nbutton?.addEventListener(\"click\", async () => {\n  const res = await fetch(\"/api/message\");\n  const data = await res.json();\n  console.log(data.message);\n});",
    "- Saying JavaScript is only a browser scripting language.\n- Confusing JavaScript with Java.\n- Ignoring the ECMAScript language versus browser/Node APIs distinction.",
    "For a beginner interview, include where it runs, what it is used for, and one key trait like dynamic typing or first-class functions."
  );
}

function frameworkLibraryGuide(): Enrichment {
  return guide(
    "A library is usually a tool you call from your code. A framework usually provides the structure and calls your code at defined points. In practice, the line can blur.",
    "JavaScript libraries and frameworks help you build apps faster by solving common problems: UI rendering, routing, state management, data fetching, testing, and build tooling.\n\nReact is often described as a library because it focuses on UI, while frameworks like Next.js add routing, rendering strategy, data conventions, and deployment structure. The important interview point is understanding control flow and trade-offs.",
    "Teams choose libraries/frameworks to standardize architecture, improve productivity, share patterns, and avoid rewriting solved infrastructure.",
    "import { useState } from \"react\";\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}",
    "- Saying frameworks always do everything and libraries are always tiny.\n- Choosing tools by popularity without considering app needs.\n- Ignoring trade-offs like bundle size, learning curve, conventions, and ecosystem maturity.",
    "Use the `who is in control?` comparison: with a library you call it; with a framework it often calls your code."
  );
}

function iifeGuide(): Enrichment {
  return guide(
    "An IIFE is an Immediately Invoked Function Expression: a function expression that runs right after it is created. It was commonly used to create private scope before modules and block scope.",
    "The surrounding parentheses turn the function declaration syntax into an expression, and the final `()` invokes it. Variables inside the IIFE do not leak to the outer scope.\n\nModern JavaScript uses ES modules, `let`, `const`, and block scope for most cases, but IIFEs still appear in legacy code, bookmarklets, and generated bundles.",
    "You may see IIFEs in older scripts that avoid globals, plugin wrappers, build output, and snippets that need one-time setup.",
    "(function () {\n  const secret = \"not global\";\n  console.log(\"setup complete\");\n})();\n\n// console.log(secret); // ReferenceError",
    "- Forgetting the function is invoked immediately.\n- Thinking IIFEs are the main modern module pattern.\n- Accidentally creating globals inside an IIFE by assigning undeclared variables.",
    "Explain the name literally: immediately invoked, function expression. Then mention private scope."
  );
}

function strictModeGuide(): Enrichment {
  return guide(
    "Strict mode is a safer JavaScript mode that turns some silent mistakes into errors and changes a few risky behaviors. ES modules and classes are strict by default.",
    "You enable strict mode in old scripts with the string directive `\"use strict\"`. It prevents accidental globals, makes some invalid assignments throw, disallows duplicate parameter names, and makes `this` be `undefined` in plain function calls instead of the global object.\n\nModern module-based code already runs strict, but understanding it helps when reading legacy scripts.",
    "Strict mode catches bugs in older codebases, scripts loaded outside modules, and interview examples involving undeclared variables or `this`.",
    "\"use strict\";\n\nfunction demo() {\n  // accidental = 1; // ReferenceError\n  console.log(this); // undefined in a plain call\n}\n\ndemo();",
    "- Thinking strict mode is a performance feature.\n- Forgetting modules are strict automatically.\n- Assuming strict mode fixes all JavaScript quirks.",
    "Mention accidental globals and `this` in plain calls. Those are the most interview-relevant behavior changes."
  );
}

function undeclaredUndefinedGuide(): Enrichment {
  return guide(
    "Undeclared means no variable binding exists for that name. `undefined` means the binding exists but currently has the value `undefined`.",
    "Reading an undeclared variable normally throws `ReferenceError`. A declared variable without an assigned value contains `undefined`. A missing object property also evaluates to `undefined`.\n\nIn sloppy mode, assigning to an undeclared name can create an accidental global. Strict mode prevents that by throwing an error.",
    "This matters when debugging typos, missing imports, optional object fields, and old scripts that accidentally create globals.",
    "let declared;\nconsole.log(declared); // undefined\n\nconst user = {};\nconsole.log(user.name); // undefined\n\n// console.log(missingName); // ReferenceError",
    "- Saying undeclared and undefined are the same.\n- Assigning to undeclared variables in non-module scripts.\n- Forgetting missing object properties return `undefined` without throwing.",
    "Use the words `binding exists` versus `binding does not exist`. That makes the difference exact."
  );
}

function getJavaScriptGuide(q: InterviewQuestion): Enrichment | undefined {
  const text = `${q.id} ${q.question}`.toLowerCase();

  if (matches(text, "fetchwithtimeout", "abortcontroller")) return fetchTimeoutGuide();
  if (matches(text, "100 independent api", "overwhelming the backend")) return concurrentApiGuide();
  if (matches(text, "return await fetch", "return fetch()")) return returnAwaitGuide();
  if (matches(text, "why doesn't a fetch", "404 or 500")) return fetchGuide();
  if (matches(text, "what is fetch")) return fetchGuide();

  if (matches(text, "rest api")) return restApiGuide();
  if (matches(text, "common http methods")) return httpMethodsGuide();
  if (matches(text, "websocket")) return websocketGuide();

  if (matches(text, "temporal dead zone", "tdz")) return tdzGuide();
  if (matches(text, "hoisting")) return hoistingGuide();
  if (matches(text, "undeclared and undefined")) return undeclaredUndefinedGuide();
  if (matches(text, "var, let, and const", "var vs let vs const", "let vs const", "let, const, and var")) {
    return variablesGuide();
  }
  if (matches(text, "closure")) return closureGuide();
  if (matches(text, "strict mode")) return strictModeGuide();
  if (matches(text, "iife")) return iifeGuide();

  if (matches(text, "different data types")) return dataTypesGuide();
  if (matches(text, "null and undefined")) return nullUndefinedGuide();
  if (matches(text, "== and ===", "== vs ===")) return equalityGuide();
  if (matches(text, "type coercion")) return coercionGuide();
  if (matches(text, "what is nan")) return nanGuide();
  if (matches(text, "what is scope")) return scopeGuide();
  if (matches(text, "what is json")) return jsonGuide();

  if (matches(text, "arrow function")) return arrowFunctionGuide();
  if (matches(text, "call(), apply(), and bind()", "call(), apply(), and bind")) return callApplyBindGuide();
  if (matches(text, "prototypal inheritance")) return prototypeGuide();
  if (matches(text, "this keyword", "`this` keyword", "what is `this`", "what is this")) return thisGuide();

  if (matches(text, "higher-order function")) return higherOrderGuide();
  if (matches(text, "pure and impure")) return pureFunctionGuide();
  if (matches(text, "currying")) return curryingGuide();

  if (matches(text, "object.freeze", "freeze() and const")) return freezeConstGuide();
  if (matches(text, "deep-clone", "deep clone", "shallow vs deep copy", "clone an object")) return cloningGuide();
  if (matches(text, "map and set", "map` and `set")) return mapSetGuide();
  if (matches(text, "spread operator")) return spreadGuide();
  if (matches(text, "destructuring")) return destructuringGuide();
  if (matches(text, "rest parameters")) return restParametersGuide();
  if (matches(text, "template literals")) return templateLiteralGuide();
  if (matches(text, "optional chaining")) return optionalChainingGuide();
  if (matches(text, "nullish coalescing")) return nullishGuide();
  if (matches(text, "es6 modules")) return modulesGuide();

  if (matches(text, "handle errors with async", "errors with fetch/async")) return asyncErrorGuide();
  if (matches(text, "event loop", "promises versus settimeout")) return eventLoopGuide();
  if (matches(text, "promise.all", "promise.race")) return promiseCombinatorGuide();
  if (matches(text, "promise")) return promiseGuide();
  if (matches(text, "async/await", "async / await")) return asyncAwaitGuide();
  if (matches(text, "callback hell", "callback function")) return callbackGuide();
  if (matches(text, "synchronous and asynchronous")) return syncAsyncGuide();

  if (matches(text, "debouncing and throttling")) return debounceThrottleGuide("compare");
  if (matches(text, "debouncing", "what is debounce")) return debounceThrottleGuide("debounce");
  if (matches(text, "throttling", "what is throttle")) return debounceThrottleGuide("throttle");

  if (matches(text, "map vs filter vs reduce")) return mapFilterReduceGuide("aggregate");
  if (matches(text, ".map()", "what does .map")) return mapFilterReduceGuide("map");
  if (matches(text, ".filter()", "what does .filter")) return mapFilterReduceGuide("filter");
  if (matches(text, ".reduce()", "what does .reduce", "compute an average")) return mapFilterReduceGuide("reduce");
  if (matches(text, "map and foreach", "map vs foreach", ".foreach() and .map")) return mapFilterReduceGuide("forEachMap");
  if (matches(text, "empty an array")) return arrayUtilityGuide("empty");
  if (matches(text, "value is an array")) return arrayUtilityGuide("isArray");
  if (matches(text, "reverse a string")) return arrayUtilityGuide("reverseString");
  if (matches(text, "remove duplicates")) return arrayUtilityGuide("dedupe");
  if (matches(text, "second largest")) return arrayUtilityGuide("secondLargest");
  if (matches(text, "sort mutate")) return arrayUtilityGuide("sort");

  if (matches(text, "event bubbling")) return domGuide("bubbling");
  if (matches(text, "event delegation")) return domGuide("delegation");
  if (matches(text, "preventdefault", "stoppropagation")) return domGuide("preventStop");
  if (matches(text, "select elements")) return domGuide("select");
  if (matches(text, "local storage", "session storage", "cookies")) return domGuide("storage");
  if (matches(text, "window.onload", "domcontentloaded")) return domGuide("load");
  if (matches(text, "the dom")) return domGuide("dom");

  if (matches(text, "memory leak")) return memoryLeakGuide();
  if (matches(text, "javascript frameworks and libraries")) return frameworkLibraryGuide();
  if (matches(text, "what is javascript")) return javascriptOverviewGuide();

  return undefined;
}

type TopicCopy = {
  concept: string;
  useCase: string;
  codeExample: string;
  commonMistakes: string;
  interviewTip: string;
  detailedAddOn?: string;
};

function compactText(text: string | undefined): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function clampText(text: string, max = 560): string {
  const trimmed = compactText(text);
  if (trimmed.length <= max) return trimmed;
  const cut = trimmed.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}...`;
}

function existingAnswer(q: InterviewQuestion, fallback: string): string {
  return clampText(q.answer || fallback);
}

function buildGuideFromTopic(q: InterviewQuestion, topic: TopicCopy): Enrichment {
  const quick = existingAnswer(q, `${q.question} is mainly about ${topic.concept}.`);
  const explanation = compactText(q.explanation);
  const detailParts = [
    quick,
    explanation && explanation !== quick ? explanation : "",
    topic.detailedAddOn ??
      `The interview goal is to show that you know what problem this solves, when you would use it, and what trade-off or failure mode you would watch for.`,
    `For this question, anchor your answer around ${topic.concept}.`,
  ].filter(Boolean);

  return guide(
    quick,
    detailParts.join("\n\n"),
    topic.useCase,
    compactText(q.example) || topic.codeExample,
    topic.commonMistakes,
    topic.interviewTip,
  );
}

function topic(
  concept: string,
  useCase: string,
  codeExample: string,
  commonMistakes: string,
  interviewTip: string,
  detailedAddOn?: string,
): TopicCopy {
  return { concept, useCase, codeExample, commonMistakes, interviewTip, detailedAddOn };
}

const REACT_DEFAULT = topic(
  "React's declarative component model: state changes describe what the UI should look like, and React updates the DOM from that description",
  "You use this when building reusable screens, shared components, forms, dashboards, and flows where UI must stay in sync with changing data.",
  "function StatusBadge({ status }: { status: string }) {\n  return <span className={`badge badge-${status}`}>{status}</span>;\n}",
  "- Mutating state directly instead of creating new values.\n- Putting derived data in state when it can be calculated during render.\n- Reaching for global state or memoization before proving it solves a real problem.",
  "Start with the mental model, then mention the practical rule: keep render pure, isolate side effects, and choose state location based on who needs the data.",
);

const TS_DEFAULT = topic(
  "TypeScript's static type system: it checks code before runtime and documents the shape of values moving through your app",
  "You use this when typing API payloads, component props, utility functions, shared domain models, and code paths where refactors should be safe.",
  "type User = {\n  id: string;\n  name: string;\n};\n\nfunction formatUser(user: User) {\n  return `${user.id}: ${user.name}`;\n}",
  "- Using `any` to silence errors instead of modeling the value.\n- Over-typing obvious values and making code noisy.\n- Trusting compile-time types for unvalidated external JSON.",
  "Explain the safety benefit, then add the boundary rule: TypeScript helps after data is validated, but runtime inputs still need checks.",
);

const CSS_DEFAULT = topic(
  "CSS layout and styling as a cascade of selectors, inherited values, box sizing, and responsive constraints",
  "You use this when building responsive pages, reusable components, accessible states, design-system primitives, and layouts that must survive real content.",
  ".card {\n  box-sizing: border-box;\n  padding: 1rem;\n  border: 1px solid #d4d4d8;\n  border-radius: 0.5rem;\n}",
  "- Solving layout with fixed pixel sizes that break with real content.\n- Adding `!important` before understanding cascade and specificity.\n- Forgetting accessibility states such as focus, reduced motion, and readable contrast.",
  "Give the rule first, then name the failure mode. CSS interview answers sound stronger when you mention content, responsiveness, and accessibility together.",
);

const HTML_DEFAULT = topic(
  "semantic HTML: choosing elements that communicate structure, purpose, and interaction to browsers and assistive technology",
  "You use this when building forms, navigation, page landmarks, dialogs, buttons, links, and accessible content that works before JavaScript enhancements.",
  "<main>\n  <h1>Account settings</h1>\n  <button type=\"button\">Save changes</button>\n</main>",
  "- Using `div` and `span` for interactive controls when native elements exist.\n- Adding ARIA that conflicts with native semantics.\n- Testing only with a mouse and missing keyboard or screen-reader behavior.",
  "Prefer native elements first. If you mention ARIA, also say ARIA supplements semantics; it does not replace correct HTML.",
);

const NEXT_DEFAULT = topic(
  "Next.js as a React framework for routing, rendering, data fetching, optimization, and deployment conventions",
  "You use this when choosing how pages render, where data is fetched, how routes are structured, and how performance or SEO requirements are met.",
  "export default async function Page() {\n  const data = await getData();\n  return <section>{data.title}</section>;\n}",
  "- Treating every component as a Client Component.\n- Fetching data on the client when the server can render it earlier.\n- Ignoring cache freshness, auth boundaries, and loading states.",
  "Name the rendering choice first, then justify it with freshness, interactivity, SEO, and performance.",
);

const REDUX_DEFAULT = topic(
  "Redux as predictable global state: actions describe changes, reducers update state immutably, and selectors read derived slices",
  "You use this when many distant parts of the app need the same client state, debugging history matters, or complex updates need predictable flow.",
  "const selectedUser = useSelector((state) => state.users.byId[id]);\nconst dispatch = useDispatch();\ndispatch(userUpdated({ id, name: \"Asha\" }));",
  "- Putting server cache data in Redux when a query cache would fit better.\n- Mutating state outside reducer rules.\n- Returning new objects from selectors and causing avoidable re-renders.",
  "Compare Redux to Context and server-cache tools. Interviewers like hearing when you would not use Redux too.",
);

const GRAPHQL_DEFAULT = topic(
  "GraphQL as a typed query layer where clients request exactly the fields they need from a schema",
  "You use this when multiple clients need flexible data shapes, related resources should be fetched together, or API evolution needs strong schema contracts.",
  "query UserProfile($id: ID!) {\n  user(id: $id) {\n    id\n    name\n    posts { id title }\n  }\n}",
  "- Treating GraphQL as automatically faster than REST.\n- Forgetting resolver-level authorization and query complexity limits.\n- Creating N+1 database queries from nested resolvers.",
  "Mention schema, resolver, and client query. Then add the operational concern: authorization, caching, and N+1 protection.",
);

const GENERAL_DEFAULT = topic(
  "clear engineering communication: describe context, trade-offs, decision-making, and measurable outcomes",
  "You use this in behavioral rounds, system/debugging scenarios, delivery questions, production incidents, and senior-level collaboration discussions.",
  "Answer structure:\n1. Situation and constraint\n2. Action you took\n3. Trade-off you considered\n4. Result or lesson learned",
  "- Giving a vague story without your specific contribution.\n- Skipping trade-offs and making the answer sound too perfect.\n- Forgetting to mention how you measured success or prevented recurrence.",
  "Use a STAR-style answer, but keep it technical: context, decision, trade-off, result, and what you would improve next.",
);

function reactTopic(q: InterviewQuestion): TopicCopy {
  const text = `${q.id} ${q.question}`.toLowerCase();

  if (matches(text, "race condition", "stale api", "abortcontroller", "api calls", "slow", "without `await`")) {
    return topic(
      "safe async React work: cancel stale requests, ignore outdated responses, and update state only for the latest user intent",
      "Use this in profile switching, autocomplete search, route changes, form submits, and dashboards where requests can finish out of order.",
      "useEffect(() => {\n  const controller = new AbortController();\n\n  fetch(`/api/users/${id}`, { signal: controller.signal })\n    .then((res) => res.json())\n    .then(setUser)\n    .catch((error) => {\n      if (error.name !== \"AbortError\") setError(error);\n    });\n\n  return () => controller.abort();\n}, [id]);",
      "- Updating state after a component unmounts or after the user has moved on.\n- Swallowing every error as if it were a cancellation.\n- Starting requests sequentially when they can safely run in parallel.",
      "Say `latest intent wins`. Then explain cleanup, cancellation, loading state, and error handling.",
      "React effects and event handlers often start async work, but React does not automatically know which response is still relevant. You must either abort the old work or guard the state update with a request id/current flag."
    );
  }

  if (matches(text, "stale closure", "dependency array", "useeffect cleanup", "side effects", "uselayouteffect", "effect")) {
    return topic(
      "React effects as synchronization with external systems, not a place to duplicate render logic",
      "Use effects for subscriptions, timers, network synchronization, DOM integration, analytics, and cleanup when components mount/update/unmount.",
      "useEffect(() => {\n  const id = setInterval(() => {\n    setCount((count) => count + 1);\n  }, 1000);\n\n  return () => clearInterval(id);\n}, []);",
      "- Leaving dependencies out to silence re-renders.\n- Putting calculations in effects when they belong in render or `useMemo`.\n- Forgetting cleanup for timers, listeners, subscriptions, and in-flight requests.",
      "Frame effects as synchronization. Then explain dependencies as values the effect reads from render.",
      "A stale closure happens when an effect or callback captures old render values. Fix it with complete dependencies, functional state updates, refs for mutable latest values, or by moving logic into the event/effect that owns it."
    );
  }

  if (matches(text, "memory leak", "tab freezes", "large dom", "re-renders", "performance", "usememo", "usecallback", "react.memo", "inline functions", "optimize")) {
    return topic(
      "React performance work: measure first, reduce unnecessary renders, virtualize large UI, and clean up long-lived resources",
      "Use this in large lists, low-code canvases, search-heavy screens, dashboards, and components that stay open for hours.",
      "const visibleRows = useMemo(() => {\n  return rows.filter((row) => row.name.includes(query));\n}, [rows, query]);\n\nconst onSelect = useCallback((id: string) => {\n  setSelectedId(id);\n}, []);",
      "- Memoizing everything without profiling.\n- Creating new object/function props that defeat memoized children.\n- Forgetting virtualization, pagination, and cleanup for large or long-lived screens.",
      "Mention DevTools Profiler, why the render happens, and the smallest change that removes real work.",
      "Performance answers should start with measurement. After that, choose from memoization, state colocation, list virtualization, code splitting, cache tuning, and cleanup of listeners/timers."
    );
  }

  if (matches(text, "state", "usereducer", "usestate", "global state", "redux", "zustand", "tanstack", "client state", "lifting state", "mutating react state")) {
    return topic(
      "state ownership: keep state as local as possible, lift it only when multiple components need it, and use global/cache tools for shared or server data",
      "Use this when deciding between component state, reducers, Context, Redux/Zustand, and TanStack Query/SWR for real application data.",
      "type Action = { type: \"increment\" } | { type: \"reset\" };\n\nfunction reducer(count: number, action: Action) {\n  switch (action.type) {\n    case \"increment\": return count + 1;\n    case \"reset\": return 0;\n  }\n}",
      "- Putting all state in a global store by default.\n- Mutating arrays/objects and expecting React to detect a change.\n- Mixing server cache, UI state, and form state without clear ownership.",
      "Answer with a decision tree: local state, lifted state, context/global state, then server cache.",
      "`useState` is best for simple local values. `useReducer` fits related transitions or complex updates. Server-cache tools fit remote data; global stores fit shared client state."
    );
  }

  if (matches(text, "props", "prop drilling", "context", "usecontext", "component architecture", "scalable", "component libraries", "theme")) {
    return topic(
      "React data flow and component architecture: compose small components, pass explicit props, and introduce context or shared state only when it reduces real friction",
      "Use this in design systems, reusable component libraries, forms, dashboards, and large apps with shared themes or permissions.",
      "const ThemeContext = createContext(\"light\");\n\nfunction Toolbar() {\n  const theme = useContext(ThemeContext);\n  return <div data-theme={theme}>Tools</div>;\n}",
      "- Hiding too much data in context and making components hard to reuse.\n- Passing huge prop objects instead of clear component contracts.\n- Building abstractions before repeated use cases prove the pattern.",
      "Talk about ownership and API design: what the component needs, who controls it, and how it stays reusable.",
      "Props are explicit and easy to trace. Context is good for app-wide values like theme, auth, locale, or feature flags. For frequently changing complex state, a store or cache may be better."
    );
  }

  if (matches(text, "form", "controlled", "uncontrolled", "loading", "search/filter", "modal", "error boundary", "errors in the ui", "validation")) {
    return topic(
      "user-flow state: model loading, success, empty, error, validation, and accessibility states explicitly",
      "Use this in forms, modals, search screens, async buttons, dynamic validation, and any UI where users need clear feedback.",
      "function SaveButton({ isSaving }: { isSaving: boolean }) {\n  return (\n    <button disabled={isSaving} aria-busy={isSaving}>\n      {isSaving ? \"Saving...\" : \"Save\"}\n    </button>\n  );\n}",
      "- Showing a spinner with no error or retry path.\n- Losing focus management in modals.\n- Mixing validation, submission, and display logic until the component becomes hard to test.",
      "List the states you support. Interviewers notice when you include empty/error/retry and accessibility.",
      "Good UI answers cover more than the happy path. Say how data enters, how validation runs, what happens while work is pending, and how failure is shown."
    );
  }

  if (matches(text, "hooks", "rules of hooks", "custom hook", "useref", "forwardref", "imperativehandle", "useformstatus", "useoptimistic", "usetransition", "usedeferredvalue", "usesyncexternalstore", "use() hook")) {
    return topic(
      "React hooks as a way to reuse stateful logic while preserving React's render order rules",
      "Use hooks for local state, effects, refs, context, async UI status, optimistic updates, and extracting reusable behavior from components.",
      "function useOnlineStatus() {\n  const [online, setOnline] = useState(true);\n\n  useEffect(() => {\n    const update = () => setOnline(navigator.onLine);\n    window.addEventListener(\"online\", update);\n    window.addEventListener(\"offline\", update);\n    return () => {\n      window.removeEventListener(\"online\", update);\n      window.removeEventListener(\"offline\", update);\n    };\n  }, []);\n\n  return online;\n}",
      "- Calling hooks inside conditions, loops, or nested functions.\n- Creating custom hooks that hide too much behavior or skip cleanup.\n- Using refs to avoid state when the UI actually needs to re-render.",
      "Say hooks must be called unconditionally at the top level. Then explain the specific hook by the problem it solves.",
      "The Rules of Hooks let React match hook calls between renders. Custom hooks do not create magic; they are functions that call other hooks and return reusable stateful behavior."
    );
  }

  if (matches(text, "virtual dom", "real dom", "reconciliation", "hydration", "suspense", "lazy loading", "ssr", "strict mode", "fragment", "portals", "syntheticevent", "jsx", "components", "react?")) {
    return topic(
      "React rendering: components return a UI description, React reconciles changes, and advanced features control loading, hydration, and where UI appears",
      "Use this when explaining React basics, SSR/hydration, lazy-loaded screens, modals via portals, and how list keys preserve identity.",
      "const items = users.map((user) => (\n  <li key={user.id}>{user.name}</li>\n));\n\nreturn <ul>{items}</ul>;",
      "- Treating the Virtual DOM as the only reason React is fast.\n- Using unstable keys like array indexes for reorderable lists.\n- Forgetting hydration requires server and client output to match.",
      "Keep it practical: React renders descriptions, compares trees, and updates the real DOM where needed.",
      "Rendering answers should include identity. Keys, component boundaries, and consistent server/client markup all help React preserve the right state."
    );
  }

  return REACT_DEFAULT;
}

function typeScriptTopic(q: InterviewQuestion): TopicCopy {
  const text = `${q.id} ${q.question}`.toLowerCase();

  if (matches(text, "any", "unknown", "json", "unreliable")) {
    return topic(
      "safe boundaries: prefer `unknown` for untrusted values, narrow or validate, and avoid `any` unless you are intentionally escaping type checking",
      "Use this for API responses, local storage, third-party SDKs, form data, and migration code where runtime data may not match your expected types.",
      "function isUser(value: unknown): value is { id: string; name: string } {\n  return typeof value === \"object\" && value !== null &&\n    \"id\" in value && typeof value.id === \"string\" &&\n    \"name\" in value && typeof value.name === \"string\";\n}",
      "- Using `any` because it is faster during development, then losing safety everywhere it spreads.\n- Trusting external JSON without runtime validation.\n- Using type assertions instead of checks when the value is uncertain.",
      "Say `unknown` forces proof; `any` turns checks off. That contrast is the interview core.",
    );
  }

  if (matches(text, "interface", "type alias", "structural", "object shapes", "declaration merging")) {
    return topic(
      "object shape modeling: interfaces and type aliases both describe contracts, while TypeScript compares shapes structurally",
      "Use this for props, API models, shared domain objects, public library types, and cases where declaration merging or unions matter.",
      "interface User {\n  id: string;\n  name: string;\n}\n\ntype ApiState =\n  | { status: \"loading\" }\n  | { status: \"success\"; user: User }\n  | { status: \"error\"; message: string };",
      "- Saying interface and type are identical in every situation.\n- Forgetting TypeScript cares about structure, not class names.\n- Choosing inheritance when composition or unions would be clearer.",
      "Mention the team convention, then the real distinction: interfaces can merge and extend nicely; type aliases handle unions and advanced composition well.",
    );
  }

  if (matches(text, "generic", "generics")) {
    return topic(
      "generics: type parameters that preserve relationships between inputs and outputs without falling back to `any`",
      "Use generics for reusable API helpers, lists, form utilities, hooks, repositories, and functions that should keep the caller's exact type.",
      "function first<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\nconst name = first([\"Asha\", \"Mira\"]);",
      "- Replacing every unknown type with `any` instead of a type parameter.\n- Making generic APIs too abstract to read.\n- Forgetting to constrain generics when you access required properties.",
      "Explain the relationship it preserves. A good generic answer is about constraints, not just `<T>` syntax.",
    );
  }

  if (matches(text, "union", "intersection", "tuple", "literal", "null", "undefined", "void", "never", "type guard", "type assertion")) {
    return topic(
      "precise value modeling and narrowing: represent possible states, then prove which state you have before using it",
      "Use this for API state machines, form states, reducers, error handling, optional values, and functions that should reject impossible states.",
      "type Result =\n  | { ok: true; data: string }\n  | { ok: false; error: string };\n\nfunction read(result: Result) {\n  if (result.ok) return result.data;\n  throw new Error(result.error);\n}",
      "- Using assertions to silence the compiler instead of narrowing.\n- Forgetting `null` and `undefined` behavior depends on strictness.\n- Modeling impossible states as optional properties instead of discriminated unions.",
      "Use a discriminated union example. It shows how TypeScript turns runtime checks into safer code.",
    );
  }

  if (matches(text, "keyof", "typeof operator", "mapped types", "conditional type", "partial", "required", "readonly", "record", "pick", "omit", "exclude", "utility type", "picks keys")) {
    return topic(
      "type-level transformations: derive new types from existing ones so models stay consistent as the app changes",
      "Use this for DTOs, form models, update payloads, reusable table columns, strongly typed object helpers, and library APIs.",
      "function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {\n  const result = {} as Pick<T, K>;\n  for (const key of keys) result[key] = obj[key];\n  return result;\n}",
      "- Duplicating types manually until they drift apart.\n- Writing clever conditional types that teammates cannot maintain.\n- Forgetting utility types transform compile-time types, not runtime values.",
      "Say what the transformation does in plain English, then show one small example with `keyof`, `Pick`, or `Record`.",
    );
  }

  if (matches(text, "class", "access modifiers", "readonly property", "inheritance", "abstract", "overriding", "getter", "setter")) {
    return topic(
      "TypeScript classes add type checks around JavaScript class behavior, including visibility, inheritance, abstract contracts, and readonly fields",
      "Use this in UI models, domain services, SDK wrappers, and codebases that prefer class-based organization.",
      "abstract class Repository<T> {\n  abstract findById(id: string): Promise<T | null>;\n}\n\nclass UserRepository extends Repository<User> {\n  async findById(id: string) {\n    return fetchUser(id);\n  }\n}",
      "- Assuming `private` always means runtime privacy in every emitted target.\n- Overusing inheritance when composition is simpler.\n- Confusing `readonly` compile-time checks with deep runtime immutability.",
      "Separate JavaScript runtime behavior from TypeScript compile-time checking. That distinction matters for class questions.",
    );
  }

  if (matches(text, "transpiler", "compile", "tsconfig", "browsers", "primitive", "default type", "strict", ".d.ts", "declaration files", "benefits", "differs from javascript", "what is typescript")) {
    return topic(
      "TypeScript tooling: the compiler checks types, emits JavaScript, and uses `tsconfig.json` to control strictness, target, modules, and project behavior",
      "Use this when setting up projects, migrating JavaScript code, publishing typed libraries, or explaining why browsers run JavaScript rather than TypeScript.",
      "{\n  \"compilerOptions\": {\n    \"strict\": true,\n    \"target\": \"ES2022\",\n    \"module\": \"ESNext\"\n  }\n}",
      "- Thinking TypeScript changes runtime behavior by itself.\n- Disabling strict checks instead of fixing unclear types.\n- Forgetting `.d.ts` files describe types and do not emit runtime code.",
      "Say TypeScript is compile-time safety on top of JavaScript. Then mention that runtime validation is still needed for external data.",
    );
  }

  return TS_DEFAULT;
}

function cssTopic(q: InterviewQuestion): TopicCopy {
  const text = `${q.id} ${q.question}`.toLowerCase();

  if (matches(text, "focus", "keyboard", "accessibility")) {
    return topic(
      "accessible focus styling: keyboard users need a visible focus indicator, while `:focus-visible` helps avoid noisy mouse-only focus rings",
      "Use this for buttons, links, form fields, cards with actions, menus, dialogs, and design-system components.",
      ".button:focus-visible {\n  outline: 3px solid #2563eb;\n  outline-offset: 3px;\n}\n\n.button:focus:not(:focus-visible) {\n  outline: none;\n}",
      "- Removing outlines globally.\n- Designing focus states with low contrast.\n- Testing only with a mouse and missing tab order issues.",
      "Always say you preserve keyboard visibility. A polished answer mentions contrast, offset, and design-system tokens.",
    );
  }

  if (matches(text, "grid", "flex", "subgrid", "container", "layout", "columns", "center", "navbar", "sidebar", "modal", "gap")) {
    return topic(
      "modern CSS layout: Flexbox handles one-dimensional alignment, Grid handles two-dimensional layout, and container queries make components respond to their own space",
      "Use this for page shells, cards, dashboards, responsive lists, sidebars, navbars, modals, and reusable components.",
      ".layout {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));\n  gap: 1rem;\n}\n\n.toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}",
      "- Using fixed widths instead of flexible tracks.\n- Choosing Grid or Flexbox by habit rather than layout direction.\n- Forgetting gaps, min/max constraints, and content wrapping.",
      "Say Flexbox for a row or column, Grid for rows and columns. Then mention responsive constraints like `minmax`, `auto-fit`, and container queries.",
    );
  }

  if (matches(text, "responsive", "media queries", "fluid", "clamp", "mobile-first", "typography", "images")) {
    return topic(
      "responsive CSS: start from small screens, add constraints as space grows, and use fluid values where they improve continuity",
      "Use this for typography, cards, navbars, images, dashboards, and layouts that must work across mobile, tablet, and desktop.",
      ".title {\n  font-size: clamp(1.5rem, 1rem + 2vw, 3rem);\n}\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));\n}",
      "- Creating many breakpoint-only overrides instead of fluid constraints.\n- Forgetting content can be longer than the mockup.\n- Making text or touch targets too small on mobile.",
      "Explain the strategy, not only the syntax: mobile-first base, fluid sizing, then breakpoints for real layout changes.",
    );
  }

  if (matches(text, "specificity", "!important", "organize", "tailwind", "sass", "css modules", "@scope", "nesting", "variables")) {
    return topic(
      "maintainable CSS: control cascade, specificity, naming, tokens, and component boundaries so styles stay predictable at scale",
      "Use this in design systems, large teams, themeable apps, utility-first setups, CSS Modules, and component libraries.",
      ":root {\n  --space-4: 1rem;\n  --color-brand: #2563eb;\n}\n\n.card {\n  padding: var(--space-4);\n  border-color: var(--color-brand);\n}",
      "- Fighting the cascade with `!important` instead of fixing selector order/specificity.\n- Nesting selectors so deeply that overrides become painful.\n- Letting design tokens drift across components.",
      "When debugging CSS, say you inspect the computed style, winning selector, source order, specificity, and cascade layer before using `!important`.",
    );
  }

  if (matches(text, "performance", "glassmorphism", "animation", "60fps", "backdrop-filter", "safari", "cross-browser", "scroll-driven", "view transitions", "anchor positioning", "color-mix", "has()")) {
    return topic(
      "advanced CSS with progressive enhancement: use modern features carefully, test support, and keep paint/layout cost under control",
      "Use this for polished UI effects, animations, Safari compatibility, dashboards, mobile performance, and design-system features with fallbacks.",
      ".panel {\n  background: rgb(255 255 255 / 0.72);\n}\n\n@supports (backdrop-filter: blur(12px)) {\n  .panel {\n    backdrop-filter: blur(12px);\n  }\n}",
      "- Shipping expensive blur/filter effects without profiling.\n- Depending on a new CSS feature without a fallback.\n- Animating layout-heavy properties when transform/opacity would be cheaper.",
      "Mention `@supports`, reduced motion, browser testing, and profiling. That makes advanced CSS answers feel production-ready.",
    );
  }

  return CSS_DEFAULT;
}

function htmlTopic(q: InterviewQuestion): TopicCopy {
  const text = `${q.id} ${q.question}`.toLowerCase();

  if (matches(text, "validation")) {
    return topic(
      "layered validation: the client gives fast feedback, while the server is the source of truth for security and data integrity",
      "Use this in forms, checkout flows, account settings, file uploads, and accessible error summaries.",
      "<label for=\"email\">Email</label>\n<input id=\"email\" name=\"email\" type=\"email\" required aria-describedby=\"email-error\" />\n<p id=\"email-error\" role=\"alert\">Enter a valid email address.</p>",
      "- Trusting client-side validation for security.\n- Showing errors visually but not connecting them to fields.\n- Waiting until submit to reveal every obvious error.",
      "Say client validation improves UX; server validation protects the system. Include accessible error messaging.",
    );
  }

  if (matches(text, "dom", "event bubbling", "event delegation")) {
    return topic(
      "HTML and DOM event flow: elements form a tree, and events can travel through that tree for direct handlers or delegated handlers",
      "Use this for menus, tables, forms, dynamic lists, modals, and progressive enhancement scripts.",
      "<ul id=\"menu\">\n  <li><button data-action=\"edit\">Edit</button></li>\n</ul>\n\n<script>\nmenu.addEventListener(\"click\", (event) => {\n  const button = event.target.closest(\"button[data-action]\");\n  if (button) console.log(button.dataset.action);\n});\n</script>",
      "- Confusing the original event target with the current handler element.\n- Adding one listener per item when delegation would be simpler.\n- Blocking default behavior without replacing keyboard-accessible behavior.",
      "Explain the tree first, then bubbling/delegation. That keeps the answer grounded.",
    );
  }

  return topic(
    "accessible semantic HTML: native elements provide roles, keyboard behavior, names, and structure before JavaScript runs",
    "Use this for navigation, buttons, forms, dialogs, headings, landmarks, and WCAG-focused React applications.",
    "<nav aria-label=\"Primary\">\n  <a href=\"/docs\">Docs</a>\n  <a href=\"/interview\">Interview</a>\n</nav>\n\n<button type=\"button\">Open menu</button>",
    "- Replacing buttons and links with clickable divs.\n- Adding ARIA roles that duplicate or conflict with native elements.\n- Skipping keyboard, focus order, labels, and error announcements.",
    "Say native first, ARIA second. If you must build a custom control, mention role, tabIndex, keyboard events, focus styles, and accessible name.",
  );
}

function nextTopic(q: InterviewQuestion): TopicCopy {
  const text = `${q.id} ${q.question}`.toLowerCase();

  if (matches(text, "lcp", "image", "seo", "metadata")) {
    return topic(
      "Next.js performance and SEO: render useful HTML early, optimize images/fonts, and provide metadata that crawlers and users can consume",
      "Use this for marketing pages, product pages, dashboards with critical hero content, and apps where mobile performance affects conversion.",
      "import Image from \"next/image\";\n\nexport function Hero() {\n  return <Image src=\"/hero.jpg\" alt=\"Product preview\" width={1200} height={800} priority />;\n}",
      "- Optimizing JavaScript while ignoring the real LCP element.\n- Using large unoptimized images or blocking fonts.\n- Forgetting title, description, Open Graph, and canonical metadata.",
      "For LCP, identify the element first. Then fix image size/priority, server rendering, caching, CSS, and third-party scripts.",
    );
  }

  if (matches(text, "routing", "router", "file-based", "dynamic", "link", "layout.tsx", "pages router", "app router")) {
    return topic(
      "Next.js routing conventions: folders define routes, special files define UI/data boundaries, and Link enables client-side navigation",
      "Use this when structuring pages, nested layouts, dynamic detail pages, shared shells, and migration between Pages Router and App Router.",
      "export default async function Page({ params }: { params: Promise<{ slug: string }> }) {\n  const { slug } = await params;\n  return <h1>{slug}</h1>;\n}",
      "- Treating route groups as URL segments.\n- Using client navigation patterns when a server route can do the work.\n- Forgetting dynamic params and layouts are part of the route contract.",
      "Mention the file convention and what problem it solves. For App Router questions, include Server Components by default.",
    );
  }

  if (matches(text, "ssr", "csr", "ssg", "isr", "server components", "rsc", "client components", "hydration", "streaming", "suspense")) {
    return topic(
      "rendering strategy: choose server, static, incremental, or client rendering based on freshness, personalization, interactivity, and performance",
      "Use this for enterprise dashboards, content sites, authenticated pages, product pages, and screens with slow data dependencies.",
      "export default async function Page() {\n  const report = await getReport();\n  return <ReportView report={report} />;\n}\n\n// Add a Client Component only where hooks or browser APIs are needed.",
      "- Marking a whole page `use client` because one child needs interactivity.\n- Serving stale static data for personalized dashboards.\n- Ignoring hydration mismatches between server and client output.",
      "Give the trade-off: SSR for fresh/personalized HTML, SSG/ISR for cacheable content, CSR for browser-only interactions.",
    );
  }

  if (matches(text, "api routes", "middleware", "auth", "protected", "server actions", "cache", "revalidation", "fetch data", "getstaticprops", "getserversideprops")) {
    return topic(
      "Next.js server capabilities: fetch data near the server, protect routes at the right boundary, and revalidate cached data after mutations",
      "Use this for authenticated apps, dashboards, forms, mutations, API endpoints, and data that needs explicit freshness control.",
      "export async function updateUser(formData: FormData) {\n  \"use server\";\n  await saveUser(formData);\n  revalidatePath(\"/settings\");\n}",
      "- Putting secrets in Client Components.\n- Forgetting authorization checks on server actions/API endpoints.\n- Caching user-specific data incorrectly or never revalidating after writes.",
      "Talk about the boundary: what runs on the server, what ships to the client, and how data freshness is controlled.",
    );
  }

  return NEXT_DEFAULT;
}

function reduxTopic(q: InterviewQuestion): TopicCopy {
  const text = `${q.id} ${q.question}`.toLowerCase();

  if (matches(text, "useselector", "re-render")) {
    return topic(
      "selector stability: `useSelector` re-renders when the selected value changes by reference comparison",
      "Use this when reading store data in components, deriving view models, and avoiding unnecessary renders in large Redux screens.",
      "const user = useSelector((state) => state.users.byId[id]);\nconst total = useSelector(selectCartTotal);",
      "- Returning a new object literal from `useSelector` on every call.\n- Deriving expensive data inline instead of using memoized selectors.\n- Selecting more state than the component needs.",
      "Mention strict equality by default, then talk about memoized selectors and `shallowEqual` where appropriate.",
    );
  }

  if (matches(text, "asyncthunk", "pending", "fulfilled", "rejected")) {
    return topic(
      "Redux async lifecycle: thunks dispatch pending, fulfilled, and rejected actions so reducers can model loading, success, and error states",
      "Use this for form submits, data loading, retries, and flows where async state should be visible in Redux DevTools.",
      "export const fetchUser = createAsyncThunk(\"users/fetch\", async (id: string) => {\n  const res = await fetch(`/api/users/${id}`);\n  return res.json();\n});",
      "- Storing only data and forgetting loading/error state.\n- Swallowing rejected errors instead of modeling them.\n- Putting every async request in Redux when server-cache tools may fit better.",
      "Describe the three action states and what UI each state enables.",
    );
  }

  if (matches(text, "normalize")) {
    return topic(
      "normalized entity state: store records by ID and keep ordered ID arrays separately to avoid duplication and expensive nested updates",
      "Use this for users, products, comments, permissions, and large datasets shared across many screens.",
      "const users = {\n  ids: [\"1\", \"2\"],\n  entities: {\n    \"1\": { id: \"1\", name: \"Asha\" },\n    \"2\": { id: \"2\", name: \"Mira\" },\n  },\n};",
      "- Duplicating the same entity under many nested parents.\n- Updating one copy but leaving another stale.\n- Over-normalizing tiny local component state.",
      "Say normalized state trades simple nesting for predictable updates and reuse.",
    );
  }

  return REDUX_DEFAULT;
}

function graphQlTopic(q: InterviewQuestion): TopicCopy {
  const text = `${q.id} ${q.question}`.toLowerCase();

  if (matches(text, "n+1")) {
    return topic(
      "GraphQL resolver performance: nested fields can create one database query per parent unless requests are batched and cached per operation",
      "Use this when resolving lists with child relationships such as users/posts, products/reviews, or organizations/members.",
      "const postsByUser = new DataLoader(async (userIds: readonly string[]) => {\n  const posts = await db.posts.findMany({ where: { userId: { in: [...userIds] } } });\n  return userIds.map((id) => posts.filter((post) => post.userId === id));\n});",
      "- Solving N+1 only on the client instead of fixing resolvers.\n- Sharing DataLoader cache across users/requests and leaking data.\n- Ignoring query depth and complexity limits.",
      "Say DataLoader batches and caches per request. That phrase usually lands the answer.",
    );
  }

  if (matches(text, "authentication")) {
    return topic(
      "GraphQL auth belongs in the server context and resolvers: authenticate the request, then authorize each field or operation that needs protection",
      "Use this for user-specific data, admin fields, multi-tenant apps, and APIs where a single query may touch many resource types.",
      "const context = async ({ req }) => {\n  const user = await authenticate(req.headers.authorization);\n  return { user };\n};\n\nconst resolvers = {\n  Query: {\n    me: (_, __, ctx) => ctx.user,\n  },\n};",
      "- Authenticating once but forgetting per-resource authorization.\n- Trusting client-selected fields without permission checks.\n- Returning detailed auth errors that leak information.",
      "Separate authentication from authorization. Then explain where user context enters resolver execution.",
    );
  }

  if (matches(text, "subscriptions")) {
    return topic(
      "GraphQL subscriptions stream real-time updates over a persistent transport, usually WebSockets, for events that change after the initial query",
      "Use this for chat, notifications, collaborative updates, live dashboards, and operational monitoring.",
      "subscription OnMessage($roomId: ID!) {\n  messageAdded(roomId: $roomId) {\n    id\n    text\n    author { id name }\n  }\n}",
      "- Using subscriptions for data that simple polling could handle.\n- Forgetting connection auth, reconnect behavior, and cleanup.\n- Broadcasting more data than subscribers are allowed to see.",
      "Compare query, mutation, and subscription: read once, write once, stream changes.",
    );
  }

  if (matches(text, "better fit than rest")) {
    return topic(
      "GraphQL versus REST trade-offs: GraphQL shines when clients need flexible shapes and related data, while REST is simpler for resource-oriented endpoints and HTTP caching",
      "Use this when multiple clients need different fields, pages combine many resources, or API evolution needs schema-driven contracts.",
      "query Dashboard {\n  viewer { id name }\n  notifications { id message }\n  projects { id title status }\n}",
      "- Saying GraphQL replaces REST everywhere.\n- Ignoring caching, authorization, and resolver performance.\n- Designing one giant schema without clear ownership.",
      "Give a balanced answer: GraphQL optimizes client flexibility; REST remains excellent for simple resource operations.",
    );
  }

  return GRAPHQL_DEFAULT;
}

function generalTopic(q: InterviewQuestion): TopicCopy {
  const text = `${q.id} ${q.question}`.toLowerCase();

  if (matches(text, "ci/cd", "ci pipeline", "continuous integration", "continuous deployment", "git", "branching", "agile", "sprint", "backlog")) {
    return topic(
      "delivery process: small changes, version control, automated checks, review, deployment, and feedback loops reduce release risk",
      "Use this when explaining team workflow, sprint planning, CI/CD, branching, code review, and how production changes move safely.",
      "Typical flow:\nfeature branch -> pull request -> lint/test/build -> review -> merge -> deploy to staging -> smoke test -> production release",
      "- Describing process ceremonies without explaining why they reduce risk.\n- Treating CI/CD as only a tool instead of a feedback loop.\n- Keeping long-lived branches that drift far from main.",
      "Tie the process to outcomes: faster feedback, fewer regressions, easier rollback, and clearer team coordination.",
    );
  }

  if (matches(text, "production", "minified", "bug", "troubleshoot", "performance", "latency", "large assets", "crashing", "sensitive", "auth", "security", "websockets", "rest", "rxjs", "node.js backend")) {
    return topic(
      "scenario troubleshooting: reproduce, observe, isolate, fix the root cause, and add prevention so the same class of bug is easier next time",
      "Use this for production incidents, performance issues, security reviews, real-time systems, browser crashes, and backend/frontend integration problems.",
      "Debug flow:\n1. Reproduce or collect evidence\n2. Check logs, source maps, metrics, and recent deploys\n3. Isolate the smallest failing path\n4. Patch behind a safe rollout\n5. Add tests, alerts, or guards",
      "- Jumping to a fix before confirming the root cause.\n- Debugging only locally when the bug is environment-specific.\n- Forgetting observability, rollback, and prevention.",
      "For advanced scenarios, narrate your investigation. Interviewers want to hear how you think under uncertainty.",
    );
  }

  if (matches(text, "project", "strength", "challenge", "why react", "hire", "advocating", "team buy-in", "mentoring", "stay current", "designer", "junior", "pr", "background", "bottlenecks")) {
    return topic(
      "behavioral storytelling: use a specific example, explain your decision, and show impact without pretending there were no trade-offs",
      "Use this for experience, leadership, mentoring, conflict, project, architecture, and senior-developer interview questions.",
      "STAR answer:\nSituation: what was happening?\nTask: what were you responsible for?\nAction: what did you personally do?\nResult: what changed, and what did you learn?",
      "- Giving a generic answer that could belong to anyone.\n- Taking all credit and ignoring collaboration.\n- Omitting measurable impact or what you learned.",
      "Pick one real story. Keep it concise, specific, and honest about constraints.",
    );
  }

  if (matches(text, "scenario-based", "stand out")) {
    return topic(
      "scenario answers: clarify requirements, state assumptions, propose a plan, name trade-offs, and explain how you would verify the result",
      "Use this in senior frontend interviews where the interviewer cares about judgment more than a memorized definition.",
      "Scenario answer shape:\n1. Clarify the user/business goal\n2. Identify constraints\n3. Propose the implementation\n4. Discuss trade-offs\n5. Explain testing and monitoring",
      "- Starting to code before clarifying the problem.\n- Giving one perfect-sounding answer with no trade-offs.\n- Forgetting how you would test, measure, or roll back.",
      "Think aloud. Good scenario answers show prioritization, not just knowledge.",
    );
  }

  return GENERAL_DEFAULT;
}

function getNonJavaScriptGuide(q: InterviewQuestion): Enrichment {
  const topicForQuestion =
    q.technology === "React"
      ? reactTopic(q)
      : q.technology === "TypeScript"
        ? typeScriptTopic(q)
        : q.technology === "CSS3"
          ? cssTopic(q)
          : q.technology === "HTML5"
            ? htmlTopic(q)
            : q.technology === "Next.js"
              ? nextTopic(q)
              : q.technology === "Redux"
                ? reduxTopic(q)
                : q.technology === "GraphQL"
                  ? graphQlTopic(q)
                  : generalTopic(q);

  return buildGuideFromTopic(q, topicForQuestion);
}

export function enrichInterviewQuestion(q: InterviewQuestion): InterviewQuestion {
  const enrichment = q.technology === "JavaScript" ? getJavaScriptGuide(q) : getNonJavaScriptGuide(q);
  if (!enrichment) return q;

  return {
    ...q,
    quickAnswer: q.quickAnswer ?? enrichment.quickAnswer,
    detailedExplanation: q.detailedExplanation ?? enrichment.detailedExplanation,
    realWorldUseCase: q.realWorldUseCase ?? enrichment.realWorldUseCase,
    codeExample: q.codeExample ?? enrichment.codeExample,
    commonMistakes: q.commonMistakes ?? enrichment.commonMistakes,
    interviewTip: q.interviewTip ?? enrichment.interviewTip,
  };
}
