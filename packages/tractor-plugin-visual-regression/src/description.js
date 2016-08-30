const description = {
    name: 'Visual Regression',
    variableName: 'visualRegression',
    methods: [{
        name: 'takeScreenshot',
        description: 'Take a screenshot of the current viewport.',
        arguments: [{
            name: 'path',
            description: 'The location of where the screen shot will be saved.',
            type: 'string',
            required: true
        }],
        returns: 'promise'
    }]
};

export default description;
