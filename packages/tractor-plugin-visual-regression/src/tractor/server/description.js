export const description = {
    methods: [{
        name: 'ignoreElement',
        description: 'Declare an element that will be ignored in the next screenshot.',
        arguments: [{
            name: 'element',
            description: 'The element that will be ignored.',
            type: 'element',
            required: true
        }],
        returns: 'promise'
    }, {
        name: 'includeElement',
        description: 'Declare an element that will be included in the next screenshot.',
        arguments: [{
            name: 'element',
            description: 'The element that will be included.',
            type: 'element',
            required: true
        }],
        returns: 'promise'
    }, {
        name: 'takeScreenshot',
        description: 'Take a screenshot of the current included elements.',
        arguments: [{
            name: 'name',
            description: 'The name of the screenshot.',
            type: 'string',
            required: true
        }, {
            name: 'description',
            description: 'The description of the screenshot.',
            type: 'string',
            required: true
        }],
        returns: 'promise'
    }]
};
