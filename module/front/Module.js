/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/base/BaseModule');

module.exports = class FrontModule extends Base {

    constructor (config) {
        super({
            ...config
        });
    }
};
module.exports.init(module);