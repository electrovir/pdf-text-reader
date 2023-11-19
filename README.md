# PDF Text Reader

Dead simple PDF text reader.

# Install

```
npm install pdf-text-reader
```

# Usage

-   Read all pages into a single string with `readPdfText`:

    <!-- example-link: src/readme-examples/read-pdf-text.example.ts -->

    ```TypeScript
    import {readPdfText} from 'pdf-text-reader';

    async function main() {
        const pdfText: string = await readPdfText({url: 'path/to/pdf/file.pdf'});
        console.info(pdfText);
    }

    main();
    ```

-   Read a PDF into individual pages with `readPdfPages`:
    <!-- example-link: src/readme-examples/read-pdf-pages.example.ts -->

    ```TypeScript
    import {readPdfPages} from 'pdf-text-reader';

    async function main() {
        const pages = await readPdfPages({url: 'path/to/pdf/file.pdf'});
        console.info(pages[0]?.lines);
    }

    main();
    ```

See [the types](https://github.com/electrovir/pdf-text-reader/tree/master/src/read-pdf.ts) for detailed argument and return value types.

# Details

This uses Mozilla's [`pdf.js`](https://github.com/mozilla/pdf.js/) package through its [`pdfjs-dist`](https://www.npmjs.com/package/pdfjs-dist) distribution on npm.

This package simply reads the output of `pdfjs.getDocument` and sorts it into lines based on text position in the document. It also inserts spaces for text on the same line that is far apart horizontally and new lines in between lines that are far apart vertically.

Example:

The text below in a PDF will be read as having spaces in between them even if the space characters aren't in the PDF.

```
cell 1               cell 2                 cell 3
```

The number of spaces to insert is calculated by an extremely naive but very simple calculation of `Math.ceil(distance-between-text/text-height)`.

# Low Level Control

If you need lower level parsing control, you can also use the exported `parsePageItems` function. This only reads one page at a time as seen below. This function is used by `readPdfPages` so the output will be identical for the same pdf page.

You may need to independently install the [`pdfjs-dist`](https://www.npmjs.com/package/pdfjs-dist) npm package for this to work.

<!-- example-link: src/readme-examples/lower-level-controls.example.ts -->

```TypeScript
import * as pdfjs from 'pdfjs-dist';
import type {TextItem} from 'pdfjs-dist/types/src/display/api';
import {parsePageItems} from 'pdf-text-reader';

async function main() {
    const doc = await pdfjs.getDocument('myDocument.pdf').promise;
    const page = await doc.getPage(1); // 1-indexed
    const content = await page.getTextContent();
    const items: TextItem[] = content.items.filter((item): item is TextItem => 'str' in item);
    const parsedPage = parsePageItems(items);
    console.info(parsedPage.lines);
}

main();
```
