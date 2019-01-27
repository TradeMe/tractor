// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { PNG } from 'pngjs';
import { Element } from './element';

export function createIgnoredElement (elementFinder) {
    const element = new Element(elementFinder);
    element.ignore();
    return element;
}

export function createIncludedElement (elementFinder) {
    return  new Element(elementFinder);
}

export async function excludeElements (rawPngData, elements, windowScroll, pixelRatio) {
    const locations = await Promise.all(elements.map(element => element.getLocation()));
    const shiftedLocations = locations.map(location => _shiftLocation(location, windowScroll));
    const scaledLocations = shiftedLocations.map(location => _scaleLocation(location, pixelRatio));
    let png = PNG.sync.read(Buffer.from(rawPngData, 'base64'));

    scaledLocations.forEach((location, i) => {
        if (!elements[i].included) {
            _ignoreElement(png, location);
        }
    });

    const [firstElement] = elements;
    if (firstElement.included) {
        const bounds = _getBounds(scaledLocations);
        png = _cropToBounds(png, bounds);
    }

    return PNG.sync.write(png);
}

export async function validateElements (elements, windowSize) {
    const included = elements.filter(element => element.included);
    const locations = await Promise.all(included.map(element => element.getLocation()));

    const bounds = _getBounds(locations);
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;

    if (width > windowSize.width) {
        throw new TractorError(`Target screenshot bounds are wider than the browser window. Please resize the window to at least ${width}px wide.`);
    }
    if (height > windowSize.height) {
        throw new TractorError(`Target screenshot bounds are taller than the browser window. Please resize the window to at least ${height}px tall.`);
    }
}

function _cropToBounds (png, bounds) {
    let { left, top, right, bottom } = bounds;
    let width = right - left;
    let height = bottom - top;
    let cropped = new PNG({ width, height });
    PNG.bitblt(png, cropped, left, top, width, height, 0, 0);
    return cropped;
}

function _getBounds (locations) {
    return locations.reduce((p, n) => {
        return {
            left: Math.min(p.left, n.left),
            top: Math.min(p.top, n.top),
            right: Math.max(p.right, n.right),
            bottom: Math.max(p.bottom, n.bottom)
        };
    }, {
        left: Infinity,
        top: Infinity,
        right: -Infinity,
        bottom: -Infinity
    });
}

function _ignoreElement (png, location) {
    for (let y = location.top; y < location.bottom; y += 1) {
        for (let x = location.left; x < location.right; x += 1) {
            let index = png.width * y + x << 2;
            _ignorePixel(png.data, index);
        }
    }
}

function _ignorePixel (data, index) {
    data[index] = 0;
    data[index + 1] = 0;
    data[index + 2] = 0;
    data[index + 3] = 0;
}

function _scaleLocation (location, pixelRatio) {
    location.left *= pixelRatio;
    location.right *= pixelRatio;
    location.top *= pixelRatio;
    location.bottom *= pixelRatio;
    return location;
}

function _shiftLocation (location, windowScroll) {
    const { x, y } = windowScroll;
    location.left -= x;
    location.right -= x;
    location.top -= y;
    location.bottom -= y;
    return location;
}