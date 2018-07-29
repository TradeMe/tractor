# Design Decisions

## Code generation

### Keep code generation as simple as possible

In the past, this plugin has used nested code structure, which are significantly harder to reason about and parse. Simple structures that compose well are preferable to more idiomatic, but harder to parse JavaScript.

#### Do

```javascript
PageObject.prototype.action = function () {
    var self = this;
    var result = Promise.resolve();
    result = result.then(function () {
        return self.element.action();
    });
    result = result.then(function () {
        return self.element.action();
    });
    result = result.then(function () {
        return self.element.action();
    });
    return result;
};
```

#### Don't

```javascript
PageObject.prototype.action = function () {
    var self = this;
    return self.element.action().then(function () {
        return self.element.action();
    }).then(function () {
        return self.element.action();
    }).then(function () {
        return self.element.action();
    });
};
```
---

### Always generate ES5 code

This may change in the future, but for now it makes things easier from a tooling point of view.

#### Do

```javascript
/*{"name":"page object","version":"0.5.2"}*/
module.exports = function () {
    var PageObject = function PageObject(parent) {
        var find = parent ? parent.element.bind(parent) : element;
    };
    return PageObject;
}();
```

#### Don't

```javascript
/*{"name":"page object","version":"0.5.2"}*/
export class PageObject {
    constructor (parent) {
        const find = parent ? parent.element.bind(parent) : element;
    }
}
```
___

### Store name meta-data *only* when necessary

We don't force a user to understand how JavaScript property names work. To do that, we need to keep a mapping from the name entered by the user to the name used in the generated code. We don't need to store that meta data when we can get it from another source though, for example when we have the file URL.

## Code parsing

### Define as specific queries as possible for each possible outcome

Ambiguous parsing makes things difficult. As we have complete control over the code that we generate, we can have exact control over the code we expect to parse.

#### Do

```javascript
const ELEMENT_MULTIPLE_QUERY = 'AssignmentExpression > FunctionExpression ReturnStatement > CallExpression[callee.object.callee.name="findAll"]';
```

#### Don't

```javascript
const ELEMENT_MULTIPLE_QUERY = 'CallExpression[callee.object.callee.name="findAll"]';
```

___

### Maintain unknown structures

There will likely be cases when *.po.js* files need to be manually edited to get functionality that **tractor** doesn't provide. In the past, this just threw errors and broke. Ideally, these files should still be editable from **tractor** where possible. Instead of throwing an error, mark the unknown structure as unparseable, and show a message to the user. Then, *reuse* the unparseable structure when saving the file.

#### Do

```javascript
let parsedCorrectly = astCompareService.compare(astObject, object.ast);
if (!parsedCorrectly) {
    object.isUnparseable = astObject;
}
```

and

```javascript
get ast () {
    return this.isUnparseable || this._toAST();
}
```
