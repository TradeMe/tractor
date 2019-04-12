// Dependencies:
import { serve } from '@tractor/server';
import { Tractor } from '@tractor/tractor';

export async function start (tractor: Tractor): Promise<void> {
    return serve(tractor);
}
