// Dependencies:
import Results from '../Results';

export default class Renderer {
    after () { }
    before () { }
    result () { }

    getResults (results) {
        let newImages = results.filter(result => result.result === Results.IMAGE_NEW);
        let similarImages = results.filter(result => result.result === Results.IMAGE_SIMILAR);
        let differentImages = results.filter(result => result.result === Results.IMAGE_DIFFERENT);
        return { newImages, similarImages, differentImages };
    }
}
