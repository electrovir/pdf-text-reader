import {existsSync} from 'fs';
import {join} from 'path';
import {testGroup} from 'test-vir';
import {readPdfText} from '../index';

const dummyFilePath = join(
    __dirname.replace(new RegExp(join(`(src|dist)`, 'test')), ''),
    'sample-files',
    'dummy.pdf',
);

testGroup((runTest) => {
    runTest({
        description: 'can find dummy file',
        expect: true,
        test: () => {
            return existsSync(dummyFilePath);
        },
    });

    runTest({
        description: 'can read dummy pdf file',
        expect: 'Dummy PDF file',
        test: async () => {
            const result = (await readPdfText(dummyFilePath))[0].lines[0];
            return result;
        },
    });

    runTest({
        description: 'dummy pdf file has one page',
        expect: 1,
        test: async () => {
            return (await readPdfText(dummyFilePath)).length;
        },
    });

    runTest({
        description: 'first page of dummy pdf file has one line',
        expect: 1,
        test: async () => {
            return (await readPdfText(dummyFilePath))[0].lines.length;
        },
    });
});
