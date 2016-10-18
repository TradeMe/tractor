// Dependencies:
import ConsoleRenderer from './renderers/ConsoleRenderer';
import DiffReporter from './reporters/DiffReporter';

// Errors:
import tractorErrorHandler from 'tractor-error-handler';

function serve (express, application) {
    application.get('/visual-regression/report', getReport);
    application.put('/visual-regression/take-changes', takeChanges());

    let diffReporter = new DiffReporter();
    let consoleRenderer = new ConsoleRenderer();

    function getReport (request, response) {
        diffReporter.generateReport(consoleRenderer)
        .then(report => response.send(report))
        .catch(error => tractorErrorHandler.handle(response, error));
    }

    function takeChanges () {
        return function (request, response) {
            let { path } = request.body;
            console.log(path);
            response.sendStatus(200);
        };
    }
}

export default serve;
