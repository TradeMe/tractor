// Dependencies:
import { ImageArea } from './image-area';
import { PNG } from 'pngjs';

export function createIgnoredArea (...coordinates) {
    let area = createImageArea(...coordinates);
    area.ignore();
    return area;
}

export function createIncludedArea (...coordinates) {
    return createImageArea(...coordinates);
}

export function updateAreas (rawPngData, areas, ratio) {
    let png = PNG.sync.read(new Buffer(rawPngData, 'base64'));

    if (areas.length) {
        areas.forEach(area => area.updateRatio(ratio));

        let areaData = calculateAreas(areas)
        updateData(png, areaData);

        let [firstArea] = areas;
        if (firstArea.included) {
            png = cropImage(png, areaData);
        }
    }

    return PNG.sync.write(png);
}

function calculateAreas (areas) {
    let areaData = createImageData();
    areas.forEach(area => {
        if (!validateArea(area)) {
            return;
        }

        let { left, top, right, bottom } = area;

        if (left < areaData.minX) {
            areaData.minX = left;
        }
        if (top < areaData.minY) {
            areaData.minY = top;
        }
        if (right > areaData.maxX) {
            areaData.maxX = right;
        }
        if (bottom > areaData.maxY) {
            areaData.maxY = bottom;
        }

        for (let y = top; y < bottom; y += 1) {
            areaData.positions[y] = areaData.positions[y] || [];
            for (let x = left; x < right; x += 1) {
                areaData.positions[y][x] = !!area.included;
            }
        }
    });
    return areaData;
}

function createImageArea (left, top, right, bottom) {
    return new ImageArea(left, top, right, bottom)
}

function createImageData () {
    return {
        positions: [],
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity
    };
}

function cropImage (png, areaData) {
    let { minX, minY, maxX, maxY } = areaData;
    let width = maxX - minX;
    let height = maxY - minY;
    let cropped = new PNG({ width, height });
    PNG.bitblt(png, cropped, minX, minY, width, height, 0, 0);
    return cropped;
}

function updateData (png, areaData) {
    for (let y = areaData.minY; y < areaData.maxY; y += 1) {
        for (let x = areaData.minX; x < areaData.maxX; x += 1) {
            if (!areaData.positions[y][x]) {
                let index = (png.width * y + x) << 2;
                paintItBlack(png.data, index);
            }
        }
    }
}

function paintItBlack (data, index) {
    data[index] = 0;
    data[index + 1] = 0;
    data[index + 2] = 0;
    data[index + 3] = 255;
}

function validateArea (area) {
    let { left, top, right, bottom } = area;
    return validateNumber(left) && validateNumber(top) && validateNumber(right) && validateNumber(bottom)
}

function validateNumber (number) {
    return !isNaN(number) && number != null;
}
