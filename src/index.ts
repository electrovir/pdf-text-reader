import * as pdfjs from 'pdfjs-dist';

export type Page = {
    lines: string[];
};

/**
 * Read a pdf file and convert it into lines of text.
 *
 * If a URL is used to fetch the PDF data a standard XMLHttpRequest(XHR) is used, which means it must follow the
 * same origin rules that any XHR does e.g. No cross domain requests without CORS.
 *
 * Parameter documentation copied from getDocument's documentation in
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/pdfjs-dist/index.d.ts
 * @param source                   url or path as a string or other data types as seen in type below
 * @param pdfDataRangeTransport    Used if you want to manually server range requests for data in the PDF.  @ee viewer.js
 *                                     for an example of pdfDataRangeTransport's interface.
 * @param passwordCallback         Used to request a password if wrong or no password was provided.  The callback receives two
 *                                     parameters: function that needs to be called with new password and the reason.
 * @param progressCallback         Progress callback.
 * @return                         A promise that is resolved with an array of each page's text content.
 **/
export async function readPdfText(
    source: pdfjs.PDFSource | string | Uint8Array | BufferSource,
    pdfDataRangeTransport?: pdfjs.PDFDataRangeTransport,
    passwordCallback?: (fn: (password: string) => void, reason: string) => string,
    progressCallback?: (progressData: pdfjs.PDFProgressData) => void,
) {
    // as any here because "getDocument"'s type signature uses different overloads rather than a single union type
    const doc = await pdfjs.getDocument(source as any, pdfDataRangeTransport, passwordCallback, progressCallback)
        .promise;
    const pageCount = doc.numPages;

    const pages: Page[] = [];

    for (let i = 0; i < pageCount; i++) {
        pages.push(await parsePage(await doc.getPage(i + 1)));
    }

    return pages;
}

async function parsePage(pdfPage: pdfjs.PDFPageProxy): Promise<Page> {
    const rawContent = await pdfPage.getTextContent();
    const lineData: {[y: number]: pdfjs.TextContentItem[]} = {};

    for (let i = 0; i < rawContent.items.length; i++) {
        const item = rawContent.items[i];
        const y = item.transform[5];
        if (!lineData.hasOwnProperty(y)) {
            lineData[y] = [];
        }
        lineData[y].push(item);
    }

    const yCoords = Object.keys(lineData)
        .map(key => Number(key))
        // b - a here because the bottom is y = 0 so we want that to be last
        .sort((a, b) => b - a)
        // insert an empty line between any 2 lines where their distance is greater than the upper line's height
        .reduce((accum: number[], currentY, index, array) => {
            const nextY = array[index + 1];
            if (nextY != undefined) {
                const currentLineHeight: number = lineData[currentY].reduce(
                    (finalValue, current) => (finalValue > current.height ? finalValue : current.height),
                    -1,
                );

                // currentY - nextY because currentY will be higher than nextY
                if (Math.floor((currentY - nextY) / currentLineHeight) > 1) {
                    const newY = currentY - currentLineHeight;
                    lineData[newY] = [];
                    return accum.concat(currentY, newY);
                }
            }
            return accum.concat(currentY);
        }, []);

    const lines: string[] = [];
    for (let i = 0; i < yCoords.length; i++) {
        const y = yCoords[i];
        // sort by x position (position in line)
        const lineItems = lineData[y].sort((a, b) => a.transform[4] - b.transform[4]);
        let line = lineItems.length ? lineItems[0].str : '';
        for (let j = 1; j < lineItems.length; j++) {
            const item = lineItems[j];
            const lastItem = lineItems[j - 1];
            const xDiff = item.transform[4] - (lastItem.transform[4] + lastItem.width);

            // insert spaces for items that are far apart horizontally
            if (xDiff > item.height || xDiff > lastItem.height) {
                const spaceCountA = Math.ceil(xDiff / item.height);
                let spaceCount = spaceCountA;
                if (lastItem.height !== item.height) {
                    const spaceCountB = Math.ceil(xDiff / lastItem.height);
                    spaceCount = spaceCountA > spaceCountB ? spaceCountA : spaceCountB;
                }
                line += Array(spaceCount)
                    .fill('')
                    .join(' ');
            }
            line += item.str;
        }
        lines.push(line);
    }

    return {
        lines,
    };
}
