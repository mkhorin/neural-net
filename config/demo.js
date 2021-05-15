'use strict';

module.exports = {

    parent: 'default',
    port: 3000,

    params: {
        'static': {
            options: {
                maxAge: 8 * 60 * 60 * 1000
            }
        }
    },
    users: require('demo-users')
};