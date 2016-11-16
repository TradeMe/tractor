// Constants:
import config from './config';

// Dependencies:
import { deleteItem } from './actions/delete-item';
import { moveItem } from './actions/move-item';
import { openItem } from './actions/open-item';
import { refactorItem } from './actions/refactor-item';
import { saveItem } from './actions/save-item';

export function serve (express, application) {
    application.use('/fs/static/', express.static(config.testDirectory));

    application.delete('/fs*', deleteItem);
    application.post('/fs/move*', moveItem);
    application.get('/fs*', openItem);
    application.post('/fs/refactor*', refactorItem);
    application.put('/fs*', saveItem);
}
