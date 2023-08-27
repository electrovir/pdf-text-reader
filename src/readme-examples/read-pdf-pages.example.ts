import {readPdfPages} from '..';

async function main() {
    const pages = await readPdfPages({url: 'path/to/pdf/file.pdf'});
    console.info(pages[0]?.lines);
}

main();
