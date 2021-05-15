/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const copyright = `/* @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com> */\n`;

module.exports = {

    build: [{
        Class: 'Packer',
        sources: [
            'src/Front.js',
            'src/Element.js',
            'src/form/Form.js',
            'src/page/Page.js',
            'src/storage/NetworkStorage.js',
            'src/validator/Validator.js',
            'src'
        ],
        target: 'vendor/front.min.js',
        copyright
    }, {
        Class: 'Packer',
        sources: [
            'script/testingWorker.js',
            'src/network'
        ],
        target: 'vendor/testingWorker.min.js',
        copyright
    }, {
        Class: 'Packer',
        sources: [
            'script/trainingWorker.js',
            'src/network'
        ],
        target: 'vendor/trainingWorker.min.js',
        copyright
    }],
    deploy: {
        'vendor/zip.js': 'vendor/node_modules/@zip.js/zip.js/dist/zip.min.js'
    }
};