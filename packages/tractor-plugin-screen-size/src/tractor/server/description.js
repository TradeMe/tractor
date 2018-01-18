export const description = {
    actions: [{
        name: 'set size',
        description: 'Set the size of the viewport',
        parameters: [{
            name: 'size',
            description: 'The name of the screen size configuration',
            type: 'string',
            required: true
        }],
        returns: 'promise'
    }]
};
