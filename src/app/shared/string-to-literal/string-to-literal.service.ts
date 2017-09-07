'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Constants:
const FALSE = 'false';
const NAN = 'NaN';
const NULL = 'null';
const TRUE = 'true';

@Injectable()
export class StringToLiteralService {
    public toLiteral (value: string): boolean | number | string {
        let bool = this.toBoolean(value);
        let num = this.toNumber(value);
        let nil = this.toNull(value);
        if (bool != null) {
            return bool;
        } else if (num != null) {
            return num;
        } else if (nil === null) {
            return nil;
        } else {
            return value;
        }
    }

    private toBoolean (value: string): boolean {
        if (value === TRUE) {
            return true;
        } else if (value === FALSE) {
            return false;
        }
    }

    private toNumber (value: string): number {
        let num = parseFloat(value);
        if (value === NAN) {
            return NaN;
        } else if (value && isNumber(num) && !Number.isNaN(num)) {
            return num;
        }
    }

    private toNull (value: string): any {
        if (value === NULL) {
            return null;
        }
    }
}

// TODO: Use angular utilities:
function isNumber(obj: any): boolean {
    return typeof obj === 'number';
}
