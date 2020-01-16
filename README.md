# PDF Text Reader

Dead simple PDF text reader.

# Install

```
npm install pdf-text-reader
```

You'll probably get peer dependency warnings. You are safe to completely ignore these. You only need them if you want to use `pdf.js`'s more complicated specific types. To do that just install the correct version (as per the warning) of the [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) package. Installing it is completely unnecessary if you're simply reading PDFs from file paths or URLs.

# Usage

There is only one exported function:

```typescript
import {readPdfText} from 'pdf-text-reader';

(async () => {
    const pages = await readPdfText('path/to/pdf/file.pdf');
    console.log(pages[0].lines);
})();
```

See [src/index.ts](src/index.ts) for detailed argument and return value typing.

# Details

This uses Mozilla's [pdf.js](https://github.com/mozilla/pdf.js/) through the [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) npm package. As such, any valid input to pdf.js's `getDocument` function are valid inputs to this package's `readPdfText` function. See [pdfjs-dist in DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/pdfjs-dist/index.d.ts) for info on that or, for just the type information, read [src/index.ts](src/index.ts) in this repo.

This package simply reads the output of `pdfjs.getDocument` and sorts it into lines based on the text vertical position in the document. It also inserts spaces for text on the same line that is far apart horizontally.

Example:

The text below in a PDF will be read as having spaces in between them even if the space characters aren't in the PDF.

```
cell 1               cell 2                 cell 3
```

The number of spaces to insert is calculated by a naive but extraordinarily simple calculation of `Math.ceil(distance-between-text/text-height)`.
