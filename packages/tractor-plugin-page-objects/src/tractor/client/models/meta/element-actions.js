export const ELEMENT_ACTIONS = [{
    name: 'click',
    description: 'Schedules a command to click on this element.',
    returns: 'promise'
}, {
    name: 'send keys',
    description: 'Schedules a command to type a sequence on the DOM element represented by this instance.',
    parameters: [{
        name: 'keys',
        description: 'The sequence of keys to type.',
        type: 'string',
        required: true
    }],
    returns: 'promise'
}, {
    name: 'get text',
    description: 'Get the visible (i.e. not hidden by CSS) innerText of this element, including sub-elements, without any leading or trailing whitespace.',
    returns: {
        name: 'text',
        type: 'promise',
        required: true,
        resolves: 'string'
    }
}, {
    name: 'is enabled',
    description: 'Schedules a command to query whether the DOM element represented by this instance is enabled, as dictated by the `disabled` attribute.',
    returns: {
        name: 'enabled',
        type: 'promise',
        required: true,
        resolves: 'boolean'
    }
}, {
    name: 'is selected',
    description: 'Schedules a command to query whether this element is selected.',
    returns: {
        name: 'selected',
        type: 'promise',
        required: true,
        resolves: 'boolean'
    }
}, {
    name: 'submit',
    description: 'Schedules a command to submit the form containing this element (or this element if it is a FORM element). This command is a no-op if the element is not contained in a form.',
    returns: 'promise'
}, {
    name: 'clear',
    description: 'Schedules a command to clear the value of this element. This command has no effect if the underlying DOM element is neither a text INPUT element nor a TEXTAREA element.',
    returns: 'promise'
}, {
    name: 'is displayed',
    description: 'Schedules a command to test whether this element is currently displayed. If isDisplayed equal to false, it means the element is invisible on browser page, but it still be the present DOM element',
    returns: {
        name: 'displayed',
        type: 'promise',
        required: true,
        resolves: 'boolean'
    }
}, {
    name: 'is present',
    description: 'Schedules a command to test whether this element is currently present as the DOM element.',
    returns: {
        name: 'present',
        type: 'promise',
        required: true,
        resolves: 'boolean'
    }
}, {
    name: 'get attribute',
    description: 'Schedules a command to get attribute of this element.',
    parameters: [{
        name: 'attribute',
        description: 'key of element attribute',
        type: 'string',
        required: true
    }],
    returns: 'promise'
}, {
    name: 'select option by index',
    description: '(tractor) Schedules a command to select an <option> by index.',
    parameters: [{
        name: 'index',
        description: 'index of the <option> to select',
        type: 'number',
        required: true
    }],
    returns: 'promise'
}, {
    name: 'select option by text',
    description: '(tractor) Schedules a command to select an <option> by text.',
    parameters: [{
        name: 'text',
        description: 'text of the <option> to select',
        type: 'string',
        required: true
    }],
    returns: 'promise'
}, {
    name: 'get selected option text',
    description: '(tractor) Schedules a command to get the text of the selected <option>.',
    returns: {
        name: 'text',
        type: 'promise',
        required: true,
        resolves: 'string'
    }
}, {
    name: 'get input value',
    description: '(tractor) Schedules a command to get the value of an <input>.',
    returns: {
        name: 'value',
        type: 'promise',
        required: true,
        resolves: 'string'
    }
}, {
    name: 'get after content',
    description: '(tractor) Schedules a command to get the content of the ::after pseudo-element of this element.',
    returns: {
        name: 'text',
        type: 'promise',
        required: true,
        resolves: 'string'
    }
}, {
    name: 'get before content',
    description: '(tractor) Schedules a command to get the content of the ::before pseudo-element of this element.',
    returns: {
        name: 'text',
        type: 'promise',
        required: true,
        resolves: 'string'
    }
}];
