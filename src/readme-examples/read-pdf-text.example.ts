import {readPdfText} from '../index.js';

async function main() {
    const pdfText: string = await readPdfText({url: 'path/to/pdf/file.pdf'});
    console.info(pdfText);
}

await main();
