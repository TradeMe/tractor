'use strict';

// Dependencies:
import application from '../../application';
import * as fileStructure from '../../file-structure';

export default function start () {
	return fileStructure.refresh()
	.then(() => {
		return application.start();
	});
}
