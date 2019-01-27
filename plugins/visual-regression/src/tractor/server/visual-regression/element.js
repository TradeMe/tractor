export class Element {
    constructor (element) {
        this.element = element;

        this.include();
    }

    ignore () {
        this.included = false;
    }

    include () {
        this.included = true;
    }

    async getLocation () {
        const location = await this.element.getLocation();
        const left = location.x;
        const top = location.y;
        const size = await this.element.getSize();
        const right = left + size.width;
        const bottom = top + size.height;
        return { left, top, right, bottom };
    }
}
