# Protractor plugins

The Mock Requests plugin is designed to be used with [**tractor**](https://github.com/TradeMe/tractor), but it can also be used with [**protractor**](http://www.protractortest.org/) directly.

## Instantiation:

First, you need to create the plugin:

```javascript
let mockRequests = new MockRequests(browser, config);
```

Where `browser` is the **Protractor** `browser` object, and `config` is a Mock Requests config object [as described here](./configuration.md).

## Usage:

You can then set up your mocks as appropriate, using any of the available methods:

* `whenDELETE (matcher: RegExp, options: ResponseOptions)`
* `whenGET (matcher: RegExp, options: ResponseOptions)`
* `whenHEAD (matcher: RegExp, options: ResponseOptions)`
* `whenPATCH (matcher: RegExp, options: ResponseOptions)`
* `whenPOST (matcher: RegExp, options: ResponseOptions)`
* `whenPUT (matcher: RegExp, options: ResponseOptions)`

```javascript
type ResponseOptions = {
    body?: string,
    headers?: { [name: string]: string },
    passThrough?: boolean,
    status?: number
};
```

For example:

```javascript
mockRequests.whenGET(/\/my\/api\/endpoint.json/, {
    body: myResponseData,
    status: 418
});
```
