export class ImageArea {
    constructor (topLeftX, topLeftY, bottomRightX, bottomRightY) {
        this.topLeftX = topLeftX;
        this.topLeftY = topLeftY;
        this.bottomRightX = bottomRightX;
        this.bottomRightY = bottomRightY;

        this.include();
    }

    ignore () {
        this.included = false;
    }

    include () {
        this.included = true;
    }

    updateRatio (ratio) {
        this.topLeftX *= ratio;
        this.topLeftY *= ratio;
        this.bottomRightX *= ratio;
        this.bottomRightY *= ratio;
    }
}
