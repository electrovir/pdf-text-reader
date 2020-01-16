import {readPdfText} from '../index';

(async () => {
    const result = (await readPdfText('src/test/dummy.pdf'))[0].lines[0];
    if (result !== 'Dummy PDF file') {
        throw new Error(`Dummy pdf read failed with result: ${result}`);
    }
})();
