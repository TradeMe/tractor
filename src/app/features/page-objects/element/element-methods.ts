'use strict';

export const CLICK = {
    name: 'click',
    description: 'Schedules a command to click on this element.',
    returns: 'promise'
};

export const SEND_KEYS = {
    name: 'sendKeys',
    description: 'Schedules a command to type a sequence on the DOM element represented by this instance.',
    arguments: [{
        name: 'keys',
        description: 'The sequence of keys to type.',
        type: 'string',
        required: true
    }],
    returns: 'promise'
};

export const GET_TEXT = {
    name: 'getText',
    description: 'Get the visible (i.e. not hidden by CSS) innerText of this element, including sub-elements, without any leading or trailing whitespace.',
    returns: 'promise',
    promise: {
        name: 'text',
        type: 'string',
        required: true
    }
};

export const IS_ENABLED = {
    name: 'isEnabled',
    description: 'Schedules a command to query whether the DOM element represented by this instance is enabled, as dictated by the `disabled` attribute.',
    returns: 'promise',
    promise: {
        name: 'enabled',
        type: 'boolean',
        required: true
    }
};

export const IS_SELECTED = {
    name: 'isSelected',
    description: 'Schedules a command to query whether this element is selected.',
    returns: 'promise',
    promise: {
        name: 'selected',
        type: 'boolean',
        required: true
    }
};

export const SUBMIT = {
    name: 'submit',
    description: 'Schedules a command to submit the form containing this element (or this element if it is a FORM element). This command is a no-op if the element is not contained in a form.',
    returns: 'promise'
};

export const CLEAR = {
    name: 'clear',
    description: 'Schedules a command to clear the {@code value} of this element. This command has no effect if the underlying DOM element is neither a text INPUT element nor a TEXTAREA element.',
    returns: 'promise'
};

export const IS_DISPLAYED = {
    name: 'isDisplayed',
    description: 'Schedules a command to test whether this element is currently displayed.',
    returns: 'promise',
    promise: {
        name: 'displayed',
        type: 'boolean',
        required: true
    }
};

export const GET_OUTER_HTML = {
    name: 'getOuterHtml',
    description: 'Schedules a command to retrieve the outer HTML of this element.',
    returns: 'promise',
    promise: {
        name: 'outerHtml',
        type: 'string',
        required: true
    }
};

export const GET_INNER_HTML = {
    name: 'getInnerHtml',
    description: 'Schedules a command to retrieve the inner HTML of this element.',
    returns: 'promise',
    promise: {
        name: 'innerHtml',
        type: 'string',
        required: true
    }
};
