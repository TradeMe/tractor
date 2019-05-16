// Dependencies:
import { TractorDescription } from '@tractor/plugin-loader';

export const description: TractorDescription = {
    actions: [
        {
            description: 'Check a page for accessibility issues.',
            name: 'checkPage',
            parameters: [{
                description: 'Unique name for this test',
                name: 'name',
                required: true,
                type: 'string'
            }],
            returns: 'promise'
        },
        {
            description: 'Check specific elements for accessibility issues.',
            name: 'checkSelector',
            parameters: [
                {
                    description: 'Unique name for this test',
                    name: 'name',
                    required: true,
                    type: 'string'
                },
                {
                    description: 'CSS selector for elements',
                    name: 'selector',
                    required: true,
                    type: 'string'
                }
            ],
            returns: 'promise'
        },
        {
            description: 'Focus the next tabbable element.',
            name: 'focusNext',
            returns: 'promise'
        },
        {
            description: 'Focus the previous tabbable element.',
            name: 'focusPrevious',
            returns: 'promise'
        },
        {
            description: 'Press the space bar.',
            name: 'pressSpace',
            returns: 'promise'
        },
        {
            description: 'Press the enter bar.',
            name: 'pressEnter',
            returns: 'promise'
        },
        {
            description: 'Press the up key.',
            name: 'pressUp',
            returns: 'promise'
        },
        {
            description: 'Press the down key.',
            name: 'pressDown',
            returns: 'promise'
        }
    ]
};
