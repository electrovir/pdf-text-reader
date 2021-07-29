import {existsSync} from 'fs';
import {relative} from 'path';
import {testGroup} from 'test-vir';
import {readPdfText} from '../index';

export type TestPdfInput = {
    filePath: string;
    expectedContent: string;
    lineCounts: number[];
};

export function testPdf({filePath, expectedContent, lineCounts}: TestPdfInput) {
    const relativeFilePath = relative(process.cwd(), filePath);
    testGroup({
        description: `Testing ${relativeFilePath}`,
        tests: (runTest) => {
            runTest({
                description: `can find ${relativeFilePath}`,
                expect: true,
                test: () => {
                    return existsSync(filePath);
                },
            });

            runTest({
                description: `can read all of ${relativeFilePath}`,
                expect: expectedContent,
                test: async () => {
                    return (await readPdfText(filePath, true)).trim();
                },
            });

            runTest({
                description: `there are ${lineCounts.length} pages in ${relativeFilePath}`,
                expect: lineCounts.length,
                test: async () => {
                    return (await readPdfText(filePath)).length;
                },
            });

            runTest({
                description: `pages have expected line counts in ${relativeFilePath}`,
                expect: lineCounts,
                test: async () => {
                    return (await readPdfText(filePath)).map((page) => page.lines.length);
                },
            });
        },
    });
}
