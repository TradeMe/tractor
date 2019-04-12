// Config:
import { Tractor } from '@tractor/tractor';
import { getConfig } from '@tractor/config-loader';
import { Inject } from 'injection-js';
import { config } from './tractor/config';

config(getConfig());

import { plugin } from './protractor/plugin';
import { init } from './tractor/server/init';
import { run } from './tractor/server/run';
import { serve } from './tractor/server/serve';
import { upgrade } from './upgrade';

export class Plugin {
    static get parameters() {
        return [new Inject(Tractor)];
    }

    constructor (
        tractor
    ) {
        this.tractor = tractor;
    }

    plugin (protractorConfig) {
        return plugin(protractorConfig);
    }

    init () {
        return init(this.tractor.config);
    }

    run () {
        return run();
    }
    
    serve () {
        return serve();
    }

    upgrade () {
        return upgrade(this.tractor);
    }
}
