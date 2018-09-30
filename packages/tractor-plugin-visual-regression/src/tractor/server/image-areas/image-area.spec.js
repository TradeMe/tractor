// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { ImageArea } from './image-area';

describe('@tractor-plugins/visual-regression - image-area:', () => {
    describe('ImageArea constructor:', () => {
        it('it should contain the bounding box', () => {
            let imageArea = new ImageArea(1, 2, 3, 4);

            expect(imageArea.left).to.equal(1);
            expect(imageArea.top).to.equal(2);
            expect(imageArea.right).to.equal(3);
            expect(imageArea.bottom).to.equal(4);
        });

        it('should be included by default', () => {
            let imageArea = new ImageArea(1, 2, 3, 4);

            expect(imageArea.included).to.equal(true);
        });
    });

    describe('ImageArea.ignore', () => {
        it('should mark the ImageArea as ignored', () => {
            let imageArea = new ImageArea(1, 2, 3, 4);

            imageArea.ignore();

            expect(imageArea.included).to.equal(false);
        });
    });

    describe('ImageArea.include', () => {
        it('should mark the ImageArea as included', () => {
            let imageArea = new ImageArea(1, 2, 3, 4);
            imageArea.ignore();

            imageArea.include();

            expect(imageArea.included).to.equal(true);
        });
    });

    describe('ImageArea.updateRatio', () => {
        it('should scale the bounding box', () => {
            let imageArea = new ImageArea(1, 2, 3, 4);

            imageArea.updateRatio(1.5);

            expect(imageArea.left).to.equal(1.5);
            expect(imageArea.top).to.equal(3);
            expect(imageArea.right).to.equal(4.5);
            expect(imageArea.bottom).to.equal(6);
        });
    });
});
