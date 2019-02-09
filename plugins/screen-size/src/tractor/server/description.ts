// Dependencies:
import { TractorDescription } from '@tractor/plugin-loader';

export const description: TractorDescription = {
    actions: [
        {
            description: 'Set the size of the viewport',
            name: 'set size',
            parameters: [{
                description: 'The name of the screen size configuration',
                name: 'size',
                required: true,
                type: 'string'
            }],
            returns: 'promise'
        },
        {
            description: 'Maximize the viewport',
            name: 'maximize',
            parameters: [],
            returns: 'promise'
        },
        {
            description: 'Get the height of the viewport',
            name: 'get height',
            parameters: [],
            returns: 'promise'
        },
        {
            description: 'Get the width of the viewport',
            name: 'get width',
            parameters: [],
            returns: 'promise'
        },
        {
            description: 'Get the height of the screen',
            name: 'get screen height',
            parameters: [],
            returns: 'promise'
        },
        {
            description: 'Get the width of the screen',
            name: 'get screen width',
            parameters: [],
            returns: 'promise'
        }
    ]
};
