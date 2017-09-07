'use strict';

export interface Factory<T> {
    create (...args: Array<any>): T;
}
