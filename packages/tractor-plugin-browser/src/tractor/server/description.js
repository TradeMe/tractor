export const description = {
    actions: [{
        name: 'get',
        description: 'Navigate to the given destination and loads mock modules before Angular.',
        parameters: [{
            name: 'destination',
            description: 'Destination URL',
            type: 'string',
            required: true
        }, {
            name: 'timeout',
            description: 'Number of milliseconds to wait for Angular to start.',
            type: 'number'
        }],
        returns: 'promise'
    }, {
        name: 'refresh',
        description: 'Makes a full reload of the current page and loads mock modules before Angular. Assumes that the page being loaded uses Angular.',
        parameters: [{
            name: 'timeout',
            description: 'Number of seconds to wait for Angular to start.',
            type: 'number'
        }],
        returns: 'promise'
    }, {
        name: 'set location',
        description: 'Browse to another page using in-page navigation.',
        parameters: [{
            name: 'url',
            description: 'In page URL using the same syntax as $location.url()',
            type: 'string',
            required: true
        }],
        returns: 'promise'
    }, {
        name: 'get current URL',
        description: 'Schedules a command to retrieve the URL of the current page.',
        returns: {
            name: 'url',
            type: 'promise',
            required: true,
            resolves: 'string'
        }
    }, {
        name: 'wait for Angular',
        description: 'Instruct webdriver to wait until Angular has finished rendering and has no outstanding $http calls before continuing.',
        returns: 'promise'
    }, {
        name: 'sleep',
        description: `Schedules a command to make the driver sleep for the given amount of time. If you're resorting to using a sleep you probably should have tried every other option first!`,
        parameters: [{
            name: 'milliseconds',
            description: 'The amount of time, in milliseconds, to sleep.',
            type: 'number'
        }],
        returns: 'promise'
    }, {
        name: 'pause',
        description: 'Beta (unstable) pause function for debugging webdriver tests.',
        parameters: [{
            name: 'debugPort',
            description: 'Optional port to use for the debugging process',
            type: 'number'
        }],
        returns: 'promise'
    }, {
        name: 'send Delete key',
        description: '(tractor) Schedules a command to press the Delete key.',
        returns: 'promise'
    }, {
        name: 'send Enter key',
        description: '(tractor) Schedules a command to press the Enter key.',
        returns: 'promise'
    }]
};
