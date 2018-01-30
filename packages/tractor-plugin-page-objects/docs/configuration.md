# Configuration

The Page Objects plugin can be configured by adding a `pageObjects` object to a *tractor.conf.js* file:

For example:

```javascript
// tractor.conf.js
module.exports = {
    // ...
    pageObjects: {
        directory: './path/to/app/',
        include: {
            someUiComponentLibrary: './node_modules/module/to/include/existing/page-objects/from/'
        }
    },
    // ...
};
```

## Options:

### `directory: string`:

The path to where your *.po.js* files will be saved. This defaults to *./tractor/page-objects/*. It is recommended to set this to be the path to your UI code, as keeping the Page Objects aligned with your actual components improves maintainability.

### `include: { [name: string]: string`:

The paths to any external *.po.js* files that you would like to use. Importing **Page Objects** from other libraries improves composability, which in turn makes creating **Page Objects** easier.
