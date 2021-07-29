import {join} from 'path';

/**
 * Path to the repo's root. Does not use the package name because the source code could
 * theoretically be cloned into any folder. "src" is used for the ts source code files (so they CAN
 * be run directly without transpiling it into JS) and "dist" is used for the transpiled JS output directory.
 */
const repoRootDir = __dirname.replace(/(?:src|dist).*/, '');

const sampleFilesDir = join(repoRootDir, 'sample-files');

export const dummyPdf = join(sampleFilesDir, 'dummy.pdf');
export const pdfkitOutputPdf = join(sampleFilesDir, 'pdfkit-out.pdf');
