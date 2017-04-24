const description = {
    methods: [{
        name: 'ignoreArea',
        description: 'Declare an area of the viewport that will be ignored in the next screenshot.',
        arguments: [{
            name: 'top-left X',
            description: 'The "X" coordinate of the top-left corner of the area that will be ignored.',
            type: 'number',
            required: true
        }, {
            name: 'top-left Y',
            description: 'The "Y" coordinate of the top-left corner of the area that will be ignored.',
            type: 'number',
            required: true
        }, {
            name: 'bottom-right X',
            description: 'The "X" coordinate of the bottom-right corner of the area that will be ignored.',
            type: 'number',
            required: true
        }, {
            name: 'bottom-right Y',
            description: 'The "Y" coordinate of the bottom-right corner of the area that will be ignored.',
            type: 'number',
            required: true
        }]
    }, {
        name: 'includeArea',
        description: 'Declare an area of the viewport that will be included in the next screenshot.',
        arguments: [{
            name: 'top-left X',
            description: 'The "X" coordinate of the top-left corner of the area that will be included.',
            type: 'number',
            required: true
        }, {
            name: 'top-left Y',
            description: 'The "Y" coordinate of the top-left corner of the area that will be included.',
            type: 'number',
            required: true
        }, {
            name: 'bottom-right X',
            description: 'The "X" coordinate of the bottom-right corner of the area that will be included.',
            type: 'number',
            required: true
        }, {
            name: 'bottom-right Y',
            description: 'The "Y" coordinate of the bottom-right corner of the area that will be included.',
            type: 'number',
            required: true
        }]
    }, {
        name: 'takeScreenshot',
        description: 'Take a screenshot of the current viewport.',
        arguments: [{
            name: 'filePath',
            description: 'The location of where the screen shot will be saved.',
            type: 'string',
            required: true
        }],
        returns: 'promise'
    }]
};

export default description;
