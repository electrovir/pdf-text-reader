import {dummyPdf, pdfkitOutputPdf} from './repo-paths';
import {testPdf, TestPdfInput} from './test-pdf';

const testFiles: TestPdfInput[] = [
    {
        filePath: dummyPdf,
        expectedContent: 'Dummy PDF file',
        lineCounts: [1],
    },
    {
        filePath: pdfkitOutputPdf,
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
];

testFiles.forEach((testFile) => testPdf(testFile));
