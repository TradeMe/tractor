export class ImageArea {
    constructor (left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;

        this.include();
    }

    ignore () {
        this.included = false;
    }

    include () {
        this.included = true;
    }

    updateRatio (ratio) {
        this.left *= ratio;
        this.top *= ratio;
        this.right *= ratio;
        this.bottom *= ratio;
    }
}
