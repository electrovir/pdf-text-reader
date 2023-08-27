import {assert} from 'chai';
import {existsSync} from 'fs';
import {join} from 'path';
import {ReadonlyDeep} from 'type-fest';
import {PdfProgressData, readPdfPages, readPdfText} from './read-pdf';
import {nodeModulesDir, sampleFilesDir} from './repo-paths.test-helper';

type PdfTestFile = {
    filePath: string;
    expectedContent: string;
    lineCounts: number[];
    pdfPassword?: string | undefined;
};

const testFiles = [
    {
        filePath: join(sampleFilesDir, 'dummy.pdf'),
        expectedContent: 'Dummy PDF file',
        lineCounts: [1],
    },
    {
        filePath: join(sampleFilesDir, 'dummy-with-password.pdf'),
        expectedContent: 'Dummy PDF file',
        lineCounts: [1],
        pdfPassword: 'test password',
    },
    {
        filePath: join(sampleFilesDir, 'pdfkit-out.pdf'),
        // cspell:disable
        expectedContent: `Some text with an embedded font!
PNG and JPEG images:
Here is some vector graphics...

And here is some wrapped text...
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in
suscipit purus. Vestibulum ante ipsum primis in faucibus orci luctus et
ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi
aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit.
Ut nec accumsan nisl. Suspendisse rhoncus nisl posuere tortor
tempus et dapibus elit porta. Cras leo neque, elementum a rhoncus ut,
vestibulum non nibh. Phasellus pretium justo turpis. Etiam vulputate,
odio vitae tincidunt ultricies, eros odio dapibus nisi, ut tincidunt lacus
arcu eu elit. Aenean velit erat, vehicula eget lacinia ut, dignissim non
tellus. Aliquam nec lacus mi, sed vestibulum nunc. Suspendisse
potenti. Curabitur vitae sem turpis. Vestibulum sed neque eget dolor
dapibus porttitor at sit amet sem. Fusce a turpis lorem. Vestibulum ante
ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
Mauris at ante tellus. Vestibulum a metus lectus. Praesent tempor
purus a lacus blandit eget gravida ante hendrerit. Cras et eros metus.
Sed commodo malesuada eros, vitae interdum augue semper quis.
Fusce id magna nunc. Curabitur sollicitudin placerat semper. Cras et
mi neque, a dignissim risus. Nulla venenatis porta lacus, vel rhoncus
lectus tempor vitae. Duis sagittis venenatis rutrum. Curabitur tempor
massa tortor.
Rendering some SVG paths...
Here is a link!
One
Two
Three`,
        // cspell:enable
        lineCounts: [
            2,
            23,
            1,
            4,
        ],
    },
] as const satisfies ReadonlyDeep<PdfTestFile[]>;

function forEachTestFile<T>(
    callback: (testFile: ReadonlyDeep<PdfTestFile>) => T,
): T extends Promise<any> ? Promise<Awaited<T>[]> : T[] {
    let hasPromise = false;
    const mapped = testFiles.map((testFile) => {
        const result = callback(testFile);
        if (result instanceof Promise) {
            hasPromise = true;
        }
        return result;
    });
    if (hasPromise) {
        return Promise.all(mapped) as T extends Promise<any> ? Promise<Awaited<T>[]> : T[];
    } else {
        return mapped as T extends Promise<any> ? Promise<Awaited<T>[]> : T[];
    }
}

describe(readPdfPages.name, () => {
    it('outputs expected pages', async () => {
        await forEachTestFile(async ({filePath, pdfPassword, lineCounts}) => {
            const pages = await readPdfPages({
                url: filePath,
                password: pdfPassword,
            });
            assert.lengthOf(
                pages,
                lineCounts.length,
                `file does not have expected line count: '${filePath}'`,
            );
            assert.deepStrictEqual(
                pages.map((page) => page.lines.length),
                lineCounts,
                `file does not have expected line lengths: '${filePath}'`,
            );
        });
    });

    it('sends back progress data', async () => {
        const allProgressData: PdfProgressData[] = [];
        await readPdfPages({
            url: testFiles[0].filePath,
            progressCallback(progressData) {
                allProgressData.push(progressData);
            },
        });

        assert.isAbove(allProgressData.length, 0, 'got no progress data');
    });
});

describe('PDF test files', () => {
    it('all exist', () => {
        forEachTestFile(({filePath}) => {
            assert.isTrue(existsSync(filePath), `test file not found: '${filePath}'`);
        });
    });
});

describe(readPdfText.name, () => {
    it('outputs expected strings', async () => {
        await forEachTestFile(async ({expectedContent, filePath, pdfPassword}) => {
            const stringOutput = await readPdfText({
                filePath,
                password: pdfPassword,
                pathToPdfJsDistNodeModule: nodeModulesDir,
            });
            assert.strictEqual(
                stringOutput.trim(),
                expectedContent,
                `file does not have expected content: '${filePath}'`,
            );
        });
    });
});
