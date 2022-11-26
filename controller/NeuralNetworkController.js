/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/base/BaseController');

module.exports = class NeuralNetworkController extends Base {

    static getConstants () {
        return {
            BEHAVIORS: {
                'access': {
                    Class: require('areto/filter/AccessControl'),
                    rules: [{
                        actions: ['create', 'update', 'delete'],
                        permissions: ['manageNeuralNetworks']
                    }]
                }
            },
            METHODS: {
                'read': 'get',
                'create': 'post',
                'update': 'post',
                'delete': 'post'
            }
        };
    }

    async actionRead () {
        const {id} = this.getQueryParams();
        const model = await this.createModel().findById(id).one();
        if (!model) {
            throw new NotFound;
        }
        this.send(model.get('data'));
    }

    async actionCreate () {
        const model = this.createModel();
        await this.save(model);
    }

    async actionUpdate () {
        const {id} = this.getPostParams();
        const model = await this.createModel().findById(id).select('name').one();
        if (!model) {
            throw new NotFound;
        }
        await this.save(model);
    }

    async actionDelete () {
        const {id} = this.getPostParams();
        const model = await this.createModel().findById(id).select('name').one();
        if (!model) {
            throw new NotFound;
        }
        await model.delete();
        this.send('Ok');
    }

    async save (model) {
        const {network} = this.getPostParams();
        model.setSafeAttrs(network);
        if (!await model.save()) {
            const error = model.getFirstError();
            return this.send(this.translate(error), 400);
        }
        this.send(model.getId());
    }
};
module.exports.init(module);

const NotFound = require('areto/error/http/NotFound');