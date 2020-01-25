# PDF Text Reader

Dead simple PDF text reader.

# Install

```
npm install pdf-text-reader
```

You'll probably get peer dependency warnings. You are safe to completely ignore these. You only need them if you want to use `pdf.js`'s more complicated specific types. To do that just install the correct version (as per the warning) of the [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) package. Installing it is completely unnecessary if you're simply reading PDFs from file paths or URLs.

# Usage

```typescript
import {readPdfText} from 'pdf-text-reader';

async function run() {
    const pages = await readPdfText('path/to/pdf/file.pdf');
    console.log(pages[0].lines);
}

run();
```

See [src/index.ts](src/index.ts) (in the git repo) or [dist/index.d.ts](dist/index.d.ts) (in the npm package) for detailed argument and return value typing.

# Details

This uses Mozilla's [pdf.js](https://github.com/mozilla/pdf.js/) through the [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) npm package. As such, any valid input to pdf.js's `getDocument` function are valid inputs to this package's `readPdfText` function. See [pdfjs-dist in DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/pdfjs-dist/index.d.ts) for info on that or, for just the type information, read [src/index.ts](src/index.ts) in this repo.

This package simply reads the output of `pdfjs.getDocument` and sorts it into lines based on the text vertical position in the document. It also inserts spaces for text on the same line that is far apart horizontally and new lines in between lines that are far apart vertically.

Example:

The text below in a PDF will be read as having spaces in between them even if the space characters aren't in the PDF.

```
cell 1               cell 2                 cell 3
```

The number of spaces to insert is calculated by a naive but extraordinarily simple calculation of `Math.ceil(distance-between-text/text-height)`.

# Low Level Control

If you need lower level parsing control, you can also use the exported `parsePageItems` function. This only reads one page at a time as seen below. This function is used by `readPdfText` so the output will be identical for the same pdf page.

You must also have the `pdfjs-dist` npm package to use this.

```typescript
import {parsePageItems} from 'pdf-text-reader';
import * as pdfjs from 'pdfjs-dist';

async function run() {
    const doc = await pdfjs.getDocument('myDocument.pdf').promise;
    const page = await doc.getPage(1);
    const content = await page.getTextContent();
    const items = content.items;
    const parsedPage = parsePageItems(items);
    console.log(parsedPage.lines);
}

run();
```

See [src/index.ts](src/index.ts) (in the git repo) or [dist/index.d.ts](dist/index.d.ts) (in the npm package) for detailed argument and return value typing.
