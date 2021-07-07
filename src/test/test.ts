import {testGroup} from 'test-vir';
import {readPdfText} from '../index';

testGroup((runTest) => {
    runTest({
        description: 'can read dummy pdf file',
        expect: 'Dummy PDF file',
        test: async () => {
            const result = (await readPdfText('src/test/dummy.pdf'))[0].lines[0];
            return result;
        },
    });

    runTest({
        description: 'dummy pdf file has one page',
        expect: 1,
        test: async () => {
            return (await readPdfText('src/test/dummy.pdf')).length;
        },
    });

    runTest({
        description: 'first page of dummy pdf file has one line',
        expect: 1,
        test: async () => {
            return (await readPdfText('src/test/dummy.pdf'))[0].lines.length;
        },
    });
});
