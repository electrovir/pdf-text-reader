import {RunOptions} from 'npm-check-updates';
import {baseNcuConfig} from 'virmator/dist/compiled-base-configs/base-ncu';

export const ncuConfig: RunOptions = {
    ...baseNcuConfig,
    // exclude these
    reject: [
        ...baseNcuConfig.reject,
        /**
         * Different versions of this have global pollution issues we're currently on a version that
         * doesn't.
         */
        'pdfjs-dist',
    ],
    // include only these
    filter: [],
};
