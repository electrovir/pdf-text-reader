import {readPdfText} from '..';

async function run() {
    const pages = await readPdfText('path/to/pdf/file.pdf');
    console.log(pages[0]?.lines);
}

run();
