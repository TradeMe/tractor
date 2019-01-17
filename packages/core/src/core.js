// Dependencies:
import stack from 'callsite';
import path from 'path';
import { Tractor } from './tractor';

export function tractor (configPath) {
    const [, callee] = stack();
    const cwd = path.dirname(callee.getFileName());
    return new Tractor(cwd, configPath);
}
