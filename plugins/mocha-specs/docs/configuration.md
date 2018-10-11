# Configuration

The Mocha specs plugin can be configured by adding a `mochaSpecs` object to a *tractor.conf.js* file:

For example:

```javascript
// tractor.conf.js
module.exports = {
    // ...
    mochaSpecs: {
        directory: './path/to/app/',
        reportsDirectory: './path/to/reports/'
    },
    // ...
};
```

## Options

### `directory: string`

The path to where your *.e2e-spec.js* files will be saved. This defaults to `'./tractor/mocha-specs/'`. It is recommended to set this to be the path to your application code.

### `reportsDirectory: string`

The path to where the [mochawesome](https://adamgruber.github.io/mochawesome/) report will be saved. This defaults to `'./tractor/reports/'`.