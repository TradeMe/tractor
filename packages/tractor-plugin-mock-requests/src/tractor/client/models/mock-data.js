// Module:
import { MockRequestsModule } from '../mock-requests.module';

var createMockRequestConstructor = function () {
    return class MockDataModel {
        constructor (file) {
            this.file = file;

            this.json = '{}';
            this.name = '';
        }

        get json () {
            return this.isUnparseable || this._json;
        }

        set json (newValue) {
            this._json = this._toJSON(newValue);
        }

        get data () {
            return this.json;
        }

        get meta () {
            return this.name ? this._toMeta() : null;
        }

        _toJSON (json) {
            this.isUnparseable = null;
            try {
                return JSON.stringify(JSON.parse(json), null, '    ');
            } catch (e) {
                this.isUnparseable = json;
            }
        }

        _toMeta () {
            return JSON.stringify({
                name: this.name
            });
        }
    }
};

MockRequestsModule.factory('MockDataModel', createMockRequestConstructor);
