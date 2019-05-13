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
        }
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

### `port: number (deprecated)`

The port to that used to be used for the intercepting proxy. No longer necessary, and will be randomised instead.
