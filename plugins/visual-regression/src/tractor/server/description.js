export const description = {
    actions: [{
        name: 'ignore element',
        description: 'Declare an element that will be ignored in the next screenshot.',
        parameters: [{
            name: 'element',
            description: 'The element that will be ignored.',
            type: 'element',
            required: true
        }],
        returns: 'promise'
    }, {
        name: 'include element',
        description: 'Declare an element that will be included in the next screenshot.',
        parameters: [{
            name: 'element',
            description: 'The element that will be included.',
            type: 'element',
            required: true
        }],
        returns: 'promise'
    }, {
        name: 'take screenshot',
        description: 'Take a screenshot of the current included elements.',
        parameters: [{
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
    }, {
        name: 'take screenshot of element',
        description: 'Take a screenshot of a particular element.',
        parameters: [{
            name: 'element',
            description: 'The element that will be ignored.',
            type: 'element',
            required: true
        }, {
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
