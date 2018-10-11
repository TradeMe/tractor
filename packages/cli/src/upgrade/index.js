// Dependencies:
import { upgradePlugins } from './upgrade-plugins';

export function upgrade (di) {
    return di.call(upgradePlugins);
}
upgrade['@Inject'] = ['di'];
