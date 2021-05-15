/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/base/BaseController');

module.exports = class DefaultController extends Base {

    async actionIndex () {
        const isGuest = this.user.isGuest();
        const remoteNetworks = await this.getRemoteNetworkItems();
        return this.render('index', {isGuest, remoteNetworks});
    }

    async getRemoteNetworkItems () {
        const model = this.spawn('model/NeuralNetwork');
        const items = await model.find().select('name').raw().all();
        if (items.length) {
            items[items.length - 1].selected = true;
        }
        return items;
    }
};
module.exports.init(module);