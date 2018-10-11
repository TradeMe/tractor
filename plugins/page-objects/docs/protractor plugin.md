# Protraction plugin

**@tractor-plugins/page-objects** contains a Protractor plugin that adds some additional behaviour to Protractor.

## Extra **`ElementArrayFinder`** methods

### `ElementArrayFinder.prototype.getFromGroup (selector: string)`

This method will select an **Element** from an **ElementGroup** by either the text content of the **Element** or by using an ordinal, e.g.

```javascript
const elements = find('nav li');
elements.getFromGroup('First Menu Item');
elements.getFromGroup('1st');
```

You can also use the special selector `'last'` to get the last **Element** in the group, e.g.

```javascript
const elements = find('nav li');
elements.getFromGroup('last');
```

## Extra **`Element`** methods

### `ElementFinder.prototype.getInputValue ()`

This method returns the `[value]` attribute of an `<input>` element.

```javascript
const input = find('input');
input.getInputValue();
```

### `ElementFinder.prototype.selectOptionByText (text: string)`

This method will select a specific option by its text content.

```javascript
const select = find('select');
select.selectOptionByText('First option');
```

### `ElementFinder.prototype.selectOptionByIndex (index: number)`

This method will select a specific option by its index.

```javascript
const select = find('select');
select.selectOptionByIndex(3);
```

### `ElementFinder.prototype.getSelectedOptionText ()`

This method will return the text content of the currently selected option.

```javascript
const select = find('select');
select.getSelectedOptionText();
```

### `ElementFinder.prototype.getAfterContent ()`

This method will return the text content of any `:after` pseudo-element of to the current element, if it exists.

```javascript
const element = find('div');
element.getAfterContent();
```

### `ElementFinder.prototype.getBeforeContent ()`


This method will return the text content of any `:before` pseudo-element of to the current element, if it exists.

```javascript
const element = find('div');
element.getBeforeContent();
```
