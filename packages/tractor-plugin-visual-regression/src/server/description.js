const description = {
    methods: [{
        name: 'takeScreenshot',
        description: 'Take a screenshot of the current viewport.',
        arguments: [{
            name: 'fileName',
            description: 'The location of where the screen shot will be saved.',
            type: 'string',
            required: true
        }],
        returns: 'promise'
    }]
};

export default description;
