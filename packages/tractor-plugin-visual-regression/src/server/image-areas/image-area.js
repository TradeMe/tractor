export class ImageArea {
    constructor (topLeftX, topLeftY, bottomRightX, bottomRightY) {
        this.topLeftX = topLeftX;
        this.topLeftY = topLeftY;
        this.bottomRightX = bottomRightX;
        this.bottomRightY = bottomRightY;

        this.include();
    }

    ignore () {
        this.ignored = true;
    }

    include () {
        this.ignored = false;
    }
}
