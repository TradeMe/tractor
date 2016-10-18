// Dependencies:
import Renderer from './Renderer';

export default class ConsoleRenderer extends Renderer {
    after (results) {
        let { newImages, similarImages, differentImages } = this.getResults(results);
        console.log('Visual regression diff results:');
        console.log(`${newImages.length} new, ${similarImages.length} similar, ${differentImages.length} different`);
    }

    before () {
        console.log('Running visual regression diff...');
    }

    result () {
        console.log('.');
    }
}
