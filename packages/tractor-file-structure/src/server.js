// Constants:
import config from './config';

// Dependencies:
import { copyItem } from './actions/copy-item';
import { deleteItem } from './actions/delete-item';
import { openItem } from './actions/open-item';
import { saveItem } from './actions/save-item';

export function serve (express, application) {
    application.use('/fs/static/', express.static(config.testDirectory));

    application.post('/fs*/copy', copyItem);
    application.delete('/fs*', deleteItem);
    application.put('/fs*', saveItem);
    application.get('/fs*', openItem);
}
