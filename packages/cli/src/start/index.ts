// Dependencies:
import { inject } from '@tractor/dependency-injection';
import { server } from '@tractor/server';
import { Tractor } from '@tractor/tractor';

export const start = inject(async (tractor: Tractor): Promise<void> => tractor.call(server), 'tractor');
