# Configuration

The Mock Requests plugin can be configured by adding a `mockRequests` object to a *tractor.conf.js* file:

For example:

```javascript
// tractor.conf.js
module.exports = {
    // ...
    mockRequests: {
        directory: './path/to/app/',
        domain: 'custom.domain.co.nz',
        headers: {
            'Custom Header': 'Custom Value'
        },
        minPort: 1234,
        maxPort: 5678
    },
    // ...
};
```

## Options

### `directory: string`

The path to where your *.mock.json* files will be saved. This defaults to `'./tractor/mock-requests/'`.

### `domain: string`

The domain to use for the intercepting proxy. This defaults to `'localhost'`.

### `headers: { [name: string]: string }`

Any headers which should be set on all proxied requests. This defaults to `{}`.

### `minPort: number`

The min port used for the intercepting proxy.
Default value is 30000

### `maxPort: number`

The max port used for the intercepting proxy.
Default value is 40000