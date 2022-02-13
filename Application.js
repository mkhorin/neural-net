/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/Application');

module.exports = class NeuralNetApplication extends Base {

    constructor (config) {
        super({
            original: Base,
            ...config
        });
    }
};
module.exports.init(module);