'use strict';

export interface Parser<T> {
    parse (...args: Array<any>): T;
}
