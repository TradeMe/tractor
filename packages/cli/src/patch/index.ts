// Patches:
import { protractor4294 } from './protractor-4294';

export async function patch (): Promise<void> {
    await protractor4294();
}
