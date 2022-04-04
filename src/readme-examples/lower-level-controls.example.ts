import * as pdfjs from 'pdfjs-dist';
import {TextItem} from 'pdfjs-dist/types/src/display/api';
import {parsePageItems} from '..';

async function run() {
    const doc = await pdfjs.getDocument('myDocument.pdf').promise;
    const page = await doc.getPage(1);
    const content = await page.getTextContent();
    const items: TextItem[] = content.items.filter((item): item is TextItem => 'str' in item);
    const parsedPage = parsePageItems(items);
    console.log(parsedPage.lines);
}

run();
