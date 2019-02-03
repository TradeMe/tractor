// Dependencies:
import { TractorDescription } from '@tractor/plugin-loader';

export const description: TractorDescription = {
    actions: [
        {
            description: 'Navigate to the given destination and loads mock modules before Angular.',
            name: 'get',
            parameters: [
                {
                    description: 'Destination URL',
                    name: 'destination',
                    required: true,
                    type: 'string'
                },
                {
                    description: 'Number of milliseconds to wait for Angular to start.',
                    name: 'timeout',
                    type: 'number'
                }
            ],
            returns: 'promise'
        },
        {
            description: 'Makes a full reload of the current page and loads mock modules before Angular. Assumes that the page being loaded uses Angular.',
            name: 'refresh',
            parameters: [{
                description: 'Number of seconds to wait for Angular to start.',
                name: 'timeout',
                type: 'number'
            }],
            returns: 'promise'
        },
        {
            description: 'Browse to another page using in-page navigation.',
            name: 'set location',
            parameters: [{
                description: 'In page URL using the same syntax as $location.url()',
                name: 'url',
                required: true,
                type: 'string'
            }],
            returns: 'promise'
        },
        {
            description: 'Schedules a command to retrieve the URL of the current page.',
            name: 'get current URL',
            returns: {
                name: 'url',
                required: true,
                resolves: 'string',
                type: 'promise'
            }
        },
        {
            description: 'Instruct webdriver to wait until Angular has finished rendering and has no outstanding $http calls before continuing.',
            name: 'wait for Angular',
            returns: 'promise'
        },
        {
            description: `Schedules a command to make the driver sleep for the given amount of time. If you're resorting to using a sleep you probably should have tried every other option first!`,
            name: 'sleep',
            parameters: [{
                description: 'The amount of time, in milliseconds, to sleep.',
                name: 'milliseconds',
                type: 'number'
            }],
            returns: 'promise'
        },
        {
            deprecated: true,
            description: 'Deprecated pause function for debugging webdriver tests.',
            name: 'pause',
            parameters: [{
                description: 'Optional port to use for the debugging process',
                name: 'debugPort',
                type: 'number'
            }],
            returns: 'promise'
        },
        {
            description: '(tractor) Schedules a command to press the Delete key.',
            name: 'send Delete key',
            returns: 'promise'
        },
        {
            description: '(tractor) Schedules a command to press the Enter key.',
            name: 'send Enter key',
            returns: 'promise'
        },
        {
            description: '(tractor) Schedules a command to press the Space key.',
            name: 'send Space key',
            returns: 'promise'
        },
        {
            description: '(tractor) Schedules a command to move focus to the next element.',
            name: 'focus next',
            returns: 'promise'
        },
        {
            description: '(tractor) Schedules a command to move focus to the previous element.',
            name: 'focus previous',
            returns: 'promise'
        }
    ]
};
