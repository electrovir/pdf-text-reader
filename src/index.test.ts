import {describe, it} from '@augment-vir/test';

describe('index.ts', () => {
    it('can be imported', async () => {
        await import('./index.js');
    });
});
