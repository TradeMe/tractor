'use strict';

// Dependencies:
import File from './File';

export default class MockDataFile extends File {
    save (data) {
        if (data) {
            this.content = data;
        }
        return super.save();
    }
}
