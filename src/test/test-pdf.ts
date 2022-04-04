import {existsSync} from 'fs';
import {relative} from 'path';
import {readPdfText} from '../index';

export type TestPdfInput = {
    filePath: string;
    expectedContent: string;
    lineCounts: number[];
};

export function testPdf({filePath, expectedContent, lineCounts}: TestPdfInput) {
    const relativeFilePath = relative(process.cwd(), filePath);
    describe(`Testing ${relativeFilePath}`, () => {
        it(`can find ${relativeFilePath}`, () => {
            expect(existsSync(filePath)).toBe(true);
        });

        it(`can read all of ${relativeFilePath}`, async () => {
            expect((await readPdfText(filePath, true)).trim()).toBe(expectedContent);
        });

        it(`there are ${lineCounts.length} pages in ${relativeFilePath}`, async () => {
            expect((await readPdfText(filePath)).length).toBe(lineCounts.length);
        });

        it(`pages have expected line counts in ${relativeFilePath}`, async () => {
            expect((await readPdfText(filePath)).map((page) => page.lines.length)).toEqual(
                lineCounts,
            );
        });
    });
}
