# Page Objects

A **Page Object** is a class that describes the behaviour of a part of a application. There has been a [lot](https://github.com/SeleniumHQ/selenium/wiki/PageObjects) [of](https://martinfowler.com/bliki/PageObject.html) [stuff](https://www.pluralsight.com/guides/software-engineering-best-practices/getting-started-with-page-object-pattern-for-your-selenium-tests) written about them already! This plugin encapsulates the best ideas of Page Objects and makes it really ready easy to create and modify them.

A **Page Object** is made up of **Elements** and **Actions**. An **Element** is a reference to a DOM element, or group of DOM elements, and an **Action** is a set of **Interactions** on those elements.

Let's dive a bit deeper and explore how to create robust, extensible **Page Objects**!

## Composition

The first, and most important thing when creating **Page Objects** is to consider how they will be [*composed*](https://en.wikipedia.org/wiki/Object_composition). Ideally, this will have already been considered when building the application, and in general it is useful to align your **Page Objects** with the existing structure of your application. All **Page Objects** made by **@tractor-plugins/page-objects** are composable by default. Start from the deepest, most fundamental units of UI, and build **PageObjects** from there up to the root of the application.

## Elements

An **Element** is the basic building block of a **Page Object**. It describes a specific DOM element, and encapsulates the actions that the user can perform on that element. Those actions are described in code [here](https://github.com/phenomnomnominal/tractor-plugin-page-objects/tree/master/src/tractor/client/models/meta/element-actions), and are derived from the [`ElementFinder`](http://www.protractortest.org/#/api?view=ElementFinder) of [**protractor**](http://www.protractortest.org/).

### Creating **Elements**

#### Try to keep selectors as simple as possible

**@tractor-plugins/page-objects** enforces the use of CSS selectors. This is because they are powerful, flexible, well-documented, and well-understood. They will also work across different frameworks. Overly complex CSS selectors usually mean poor composition, and can be an indication that the structure of the applications components should be reconsidered.

It is often suggested to use `data-*` attributes to help with creating selectors, and this is a valid option. However, note that this results in a choice between shipping that code to production, or stripping it out for production and having difference code in test and production. Good composition can often avoid the need for specific helper attributes.

#### Use groups with repeated components

Repeated components (e.g. `<li>`) are often used to encapsulate complexity. Rather than select individual items using `:nth-child(n)` or similar, indicate that the selector matches several elements with the **"group"** checkbox.

Once an **Element** is marked as a group, individual elements can be selected from the group using either the expected text content or an ordinal number, e.g. "1st", "2nd", "25th", or the special value "last".

#### Use types to embrace composability

**Elements** that do not have a type set will default to the `ElementFinder` interface. This applies to both single elements and elements that are a group. Set the type to specify that the result of the selector is represented by another **Page Object** class. The available types will be other **Page Objects** that have been defined, but can be [configured using the `include` option](https://github.com/phenomnomnominal/tractor-plugin-page-objects/tree/master/docs/configuration.md) to use **PageObjects** from another library.

### Creating **Actions**

#### Use Parameters

If a value is hard-coded inside an **Action** within a **Page Object** it instantly becomes less reusable. Use a parameter instead so the caller can define the value.

#### Use Optional Actions to reduce duplication

If there is an **Action** where one of the Interactions does not always happen, (for example, a "confirm" dialog that doesn't display the first time), the **Action** can be marked as "optional". Instead of throwing an error, the interaction will just be ignored.

#### Use **Actions** to combine common, repeated interactions

It can be tempting to have a 1-1 mapping from **Element** action to **Page Object** action, but this should not be necessary. As an example, consider a "Log in" component.

At first it might seem like there should be several **Actions**, e.g. "Enter username", "Enter password", "click log in", and then combine them in the test. If the component changes, such as to also required a two-factor token, another **Action** would have to be added and used in all the tests.

It is preferable to have a single "Log in" action, which takes a `username` and a `password`, and performs all of the steps. It could then be extended to take a third parameter, `token`, which is a much simpler refactor.

___

### Other advice

* **Keep naming consistent**

* **Re-order your element and actions sensibly**

___

## Example

Imagine a "Log In" modal in a component-based application, with some mark-up that looks something like the following:

```html
<tractor-login-modal>
    <tractor-text-input
        label="Username">
        <input
            name="username">
    </tractor-text-input>
    <tractor-text-input
        label="Password">
        <input
            name="password">
    </tractor-text-input>
    <button
        tractorButton>
        Log In
    </button>
</tractor-login-modal>
```

Note that this is only a representation of the component structure, the actual resultant HTML will be more complicated. There's a few things here to consider:

1) There are a number of different components:
    `<tractor-login-modal>`, `<tractor-text-input>`, and `[tractorButton]`. Each of these components have their own behaviour that needs to be capture. Each component type should be descibed by its own **Page Object**.

2) There are interactions with native elements:
    `<tractor-text-input>` expects there to be a `<input>` inside it, and `[tractorButton]` expects to be used with a `<button>`

3) There are multiple instances of `<tractor-text-input>` that need to be interacted with separately.

It is a good idea to start with the deepest components, and build up to the bigger more complex components. In this case, that would be `[tractorButton]` and `<tractor-text-input>`. These kinds of components are likely re-used throughout the application, and their **Page Objects** will be similarly reusable!

___

### `[tractorButton]`

`[tractorButton]` is a very simple component. A **Page Object** describing it should also be straightforward. The rendered HTML might look something like this:

```html
<button
    tractorButton
    class="tractor-button">
    <span
        class="tractor-button__content">
        BUTTON CONTENT
    </span>
</button>
```

#### `[tractorButton]` Elements

The `[tractorButton]` has two DOM elements to consider:

1) The host button (`<button tractorButton class="tractor-button">`)

2) The content span (`<span class="tractor-button__content">`)

**@tractor-plugins/page-objects** automatically defines an element called `host`. This is particularly useful for components that use an attribute selector like `[tractorButton]`. That leaves a single **Element** which needs to be defined manually.

The **Element** for the content span would have a name, `"content"`, and a simple CSS selector, `".tractor-button__content"`.  Using the [BEM](http://getbem.com/) naming convention can help keep element selectors simple.

#### `[tractorButton]` Actions

The **Page Object** for `[tractorButton]` should describe (at a minimum):

* Clicking the button

* The button content

* The state of the button - whether or not it is `disabled`

This means that the **Page Object** should have three **Actions**.

1) Clicking the button will requires a single **Interaction**. It should use the special `host` **Element**, and the "click" method. The **Action** should probably also be named "click", as it just a pass-through to the underlying DOM element.

2) Getting the button content. Similarly, getting the button content will only be a single **Interaction**. It should use the "content" **Element**, with the "get text" method. It could be named something slightly more specific, like "get button content".

3) Getting the state of the button will again use the special `host` **Element**, this time with the "is enabled" method. Again, the name should reflect that this is a pass-through.

___

### `<tractor-text-input>`

`<tractor-text-input>` is slightly more complex. It is used to wrap a native `<input>` element. The rendered HTML of the component and its content might look something like this:

```html
<tractor-text-input>
    <label
        class="tractor-text-input__label"
        for="my-input">
        LABEL CONTENT
    </label>
    <input
        id="my-input"
        name="my-input"/>
    <span
        class="tractor-text-input__validation tractor-text-input__validation--error">
        ERROR MESSAGE
    </span>
</tractor-text-input>
```

#### `<tractor-text-input>` Elements

The `<tractor-text-input>` has four DOM elements to consider.

1) As `<tractor-text-input>` defines its own custom element, it is unlikely to need to use the `host` **Element**.

2) There should be an **Element** for the `<label>`. It would be named `"label"`, and use `".tractor-text-input__label"` for its selector.

3) The **Element** for the input slot, would be named `"input"`, with a selector `"input"`. If the content slot could have lots of different content, it may make more sense to ignore content slots, and allow the content do be descibed in the parent **Page Object**.

4) Lastly, an **Element** for the validation span called `"validation"` with the selector `"tractor-text-input__validation"`.

#### `<tractor-text-input>` Actions

The **Page Object** from `<tractor-text-input>` could have several **Actions**:

* Firstly, an **Action** called "get label". This would use the "label" **Element**, with the "get text" method.

* An **Action** called "get validation". This would also use "get text", but on the "validation" **Element**.

* There could also be a "has validation" **Action** which would use the "is displayed" method on the "validation" **Element**.

Interacting with the `<input>` is slightly more complicated.

* There could be a "set value" **Action** with a **Parameter** called "value". It would use the "send keys" method on the "input" **Element**, and pass the "value" **Parameter".

* The could also be a "clear value" **Action**, which would use the "clear" method on the "input" **Element**.

___

### `<tractor-login-modal>`

Now that there are **Page Objects** for the `[tractorButton]` and `<tractor-text-input>` components, it's time to have a go at using them to define the `<tractor-login-modal>`. As a reminder, the mark up looks something like this:

```html
<tractor-login-modal>
    <tractor-text-input
        label="Username">
        <input
            name="username">
    </tractor-text-input>
    <tractor-text-input
        label="Password">
        <input
            name="password">
    </tractor-text-input>
    <button
        tractorButton>
        Log In
    </button>
</tractor-login-modal>
```

#### `<tractor-login-modal>` Elements

This time there are **three** **Elements** to consider. This time, they are not just basic DOM elements, but are custom components!

1) The username input will be an **Element** named "username". This **Element** should have a **Type** of `tractor-text-input`, and its selector will use the unique attributes of this usage of that type: `tractor-text-input[label="Username"]`.

2) The password **Element** will be similar! It should be named "password", again with **Type** `tractor-text-input`, and a very similar selector, `tractor-text-input[label="Password"]`

3) The "log in button" **Element** will use a different **Type**, `tractorButton`, and be selected with `button[tractorButton]`.

#### `<tractor-login-modal>` Actions

We can bring everything together here into a single **Action** called "log in"!

Define the **Parameters** for the **Action**, one named "username" and another named "password".

Then there should be the first **Interaction**, using the "username" **Element** and its "set value" **Action**. It should take the "username" **Parameter** as an argument. The second **Interaction** will be almost identical, except using the "password" **Element**, and "password" **Parameter**. Lastly, add one more **Interaction**, using the "click" **Action** of the "log in button" **Element**.
