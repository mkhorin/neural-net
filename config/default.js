'use strict';

module.exports = {

    title: 'NeuralNet',

    components: {
        'db': {
            settings: {
                'database': process.env.MONGO_NAME || 'neural-net',
            }
        },
        'cookie': {
            secret: 'neural-net.sign' // key to sign cookie
        },
        'session': {
            secret: 'neural-net.sign' // key to sign session ID cookie
        },
        'i18n': {
            language: 'en'
        },
        'router': {
            defaultModule: 'front'
        }
    },
    modules: {
        'account': {
            Class: require('evado-module-account/Module')
        },
        'admin': {
            Class: require('evado-module-admin/Module')
        },
        'front': {
            Class: require('../module/front/Module')
        }
    },
    users: require('./default-users'),
    security: require('./default-security'),
    sideMenu: require('./default-sideMenu'),
    tasks: require('./default-tasks'),
    widgets: require('./default-widgets'),
    params: {
        'enablePasswordReset': false,
        'enableSignUp': false,
        'enableSignUpVerification': false,
        'languageToggle': true
    }
};