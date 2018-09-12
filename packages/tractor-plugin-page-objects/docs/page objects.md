# Page Objects

A **Page Object** is a class that describes the behaviour of a part of a application. There has been a [lot](https://github.com/SeleniumHQ/selenium/wiki/PageObjects) [of](https://martinfowler.com/bliki/PageObject.html) [stuff](https://www.pluralsight.com/guides/software-engineering-best-practices/getting-started-with-page-object-pattern-for-your-selenium-tests) written about them already! This plugin encapsulates the best ideas of Page Objects and makes it really ready easy to create and modify them.

A **Page Object** is composed of **Elements** and **Actions**. An **Element** is a reference to a DOM element, or group of DOM elements, and an **Action** is a set of **Interactions** on those elements.

Let's dive a bit deeper and explore how to create robust, extensible **Page Objects**!

## Composition

The first, and most important thing when creating **Page Objects** is to consider how they will be [*composed*](https://en.wikipedia.org/wiki/Object_composition). Ideally, this will have already been considered when building the application, and in general it is useful to align your **Page Objects** with the existing structure of your application. All **Page Objects** made by **@tractor-plugins/page-objects** are composable by default. Work out your deepest, most fundamental units of UI, and start building **PageObjects** from there up to the root of your application.

## Elements

An **Element** is the basic building block of a **Page Object**. It describes a specific DOM element, and encapsulates the actions that the user can perform on that element. Those actions are described in code [here](https://github.com/phenomnomnominal/tractor-plugin-page-objects/tree/master/src/tractor/client/models/meta/element-actions), and are derived from the [`ElementFinder`](http://www.protractortest.org/#/api?view=ElementFinder) of [**protractor**](http://www.protractortest.org/).

### Creating Elements

#### Try to keep selectors as simple as possible

**@tractor-plugins/page-objects** enforces the use of CSS selectors. This is because they are powerful, flexible, well-documented, and well-understood. They will also work across different frameworks.

If you find yourself writing overly complex CSS selectors, have a look at your component structure. Complex selectors usually mean poor composition.

It is often suggested to use `data-*` attributes to help with creating selectors, and this is a valid option. However, note that you will have to choose between shipping that code to production, or stripping it out for production and having difference code in test and production. Good composition can often avoid the need for specific helper attributes.

#### Use groups when you have repeated components

Repeated components (e.g. `<li>`) are often used to encapsulate complexity. Rather than select individual items using `:nth-child(n)` or similar, you can indicate that the selector matches several elements with the **"group"** checkbox.

Once you have marked an **Element** as a group, you will then be able to select from the group using either the expected text content or an ordinal number, e.g. "1st", "2nd", "25th", or the special value "last".

#### Use types to embrace composability

**Elements** that do not have a type set will default to the `ElementFinder` interface. This applies to both single elements and elements that are a group. You can set the type to specify that the result of the selector is represented by another **Page Object** class. The available types will be other **Page Objects** that you have defined, but can be [configured using the `include` option](https://github.com/phenomnomnominal/tractor-plugin-page-objects/tree/master/docs/configuration.md) to use **PageObjects** from another library.

### Creating Actions

#### Use Parameters

If you hard-code a value to an **Action** within a **Page Object** it instantly becomes less reusable. Use a parameter so that you can pass a value in from your actual test.

#### Use Optional Actions to reduce duplication

If you have an **Action** where one of the Interactions does not always happen, for example, a "confirm" dialog, you can mark the **Action** as "optional". Instead of throwing an error, the interaction will just be ignored.

#### Describe *what* the Page Object does, not *how*.

It can be tempting to have a 1-1 mapping from **Element** action to **Page Object** action, but this is often not what you want to do. As an example, let's look at a "Log in" component.

At first it might seem like you should create several **Actions**, e.g. "Enter username", "Enter password", "click log in", and then combine them in the test. If the component changes, such as to also required a two-factor token, you would have to add another **Action** and use that in all of your tests.

It is preferable to have a single "Log in" action, which takes a `username` and a `password`, and performs all of the steps. You can then extend it the require a third parameter, `token`, and only have to update the tests to add that parameter.

That said, there are definitely cases where a 1-1 mapping is appropriate, such as getting a piece of text from an element, or clicking a specific button. In those cases, be sure to still name your actions in a way that describes the *what*, not the *how*.

### Other advice

* **Keep naming consistent**

* **Re-order your element and actions sensibly**
