import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

/**
 * Path to the repo's root. Does not use the package name because the source code could
 * theoretically be cloned into any folder. "src" is used for the ts source code files (so they CAN
 * be run directly without transpiling it into JS) and "dist" is used for the transpiled JS output
 * directory.
 */
const repoRootDir = dirname(dirname(fileURLToPath(import.meta.url)));

export const sampleFilesDir = join(repoRootDir, 'test-files');
export const nodeModulesDir = resolve(repoRootDir, 'node_modules', 'pdfjs-dist');
