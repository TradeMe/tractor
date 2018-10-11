// Dependencies:
import { getConfig } from '@tractor/config-loader';
import { container } from '@tractor/dependency-injection';
import { getPlugins } from '@tractor/plugin-loader';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

global.expect = chai.expect;
chai.use(chaiAsPromised);

export function world () {
    var di = container();
    var plugins = getPlugins();
    var config = getConfig();

    let { browser } = global;
    di.constant({ browser, config });

    plugins.map(plugin => {
        global[plugin.description.variableName] = di.call(plugin.create);
    });
}
