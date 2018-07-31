// This is a hack to make `SELENIUM_PROMISE_MANAGER: false` work until
// https://github.com/angular/protractor/issues/4294 is fixed:
export function serialiseCommands () {
    const { browser } = global;

    let currentCommand = Promise.resolve();
    // Serialise all webdriver commands to prevent EPIPE errors
    const webdriverSchedule = browser.driver.schedule;
    browser.driver.schedule = (command, description) => {
        currentCommand = currentCommand.then(() =>
            webdriverSchedule.call(browser.driver, command, description)
            .then(result => {
                return result;
            })
            .catch(error => {
                throw error;
            })
        );
        return currentCommand;
    };
}
