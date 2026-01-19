import {readPdfPages} from '../index.js';

async function main() {
    const pages = await readPdfPages({url: 'path/to/pdf/file.pdf'});
    console.info(pages[0]?.lines);
}

await main();
