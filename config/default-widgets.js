'use strict';

const defaults = require('evado/config/default-widgets');

module.exports = {

    ...defaults,

    'commonMenu': {
        modules: {
            'front': {
                separated: true
            }
        }
    }
};