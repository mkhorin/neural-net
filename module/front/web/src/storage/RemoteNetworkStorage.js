/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.RemoteNetworkStorage = class RemoteNetworkStorage extends Front.NetworkStorage {

    static normalizeItems (items) {
        for (const item of items) {
            item.id = item._id;
            item.ready = false;
        }
        return items;
    }

    constructor () {
        super(...arguments);
        this.items = this.constructor.normalizeItems(this.front.getData('remoteNetworks'));
    }

    list () {
        return this.items;
    }

    has (id) {
        return this.constructor.indexOf(id, this.items) !== undefined;
    }

    get (id) {
        const index = this.constructor.indexOf(id, this.items);
        const item = this.items[index];
        return item && !item.ready
            ? $.get(this.getUrl('read'), {id}).then(this.onRead.bind(this, item))
            : $.Deferred().resolve(item);
    }

    getUrl (action) {
        return `neural-network/${action}`;
    }

    onRead (item, data) {
        data = Jam.Helper.parseJson(data);
        if (!data) {
            return $.Deferred().reject('Invalid data');
        }
        Object.assign(item, data);
        item.ready = true;
        return $.Deferred().resolve(item);
    }

    findByName (name) {
        const index = this.constructor.indexOf(name, this.items, 'name');
        return this.items[index];
    }

    remove (id) {
        const index = this.constructor.indexOf(id, this.items);
        if (this.items[index]) {
            $.post(this.getUrl('delete'), {id});
            this.items.splice(index, 1);
            this.triggerChange();
        }
    }

    create (data) {
        return this.saveInternal('create', data, id => {
            data.id = id;
            this.items.push(data);
        });
    }

    update (data) {
        return this.saveInternal('update', data, () => {
            const index = this.constructor.indexOf(data.id, this.items);
            this.items.splice(index, 1, data);
        });
    }

    saveInternal (method, data, handler) {
        const deferred = $.Deferred();
        $.post(this.getUrl(method), this.prepareSentData(data)).done(id => {
            handler(id);
            data.ready = true;
            this.triggerChange();
            deferred.resolve(data.id);
        }).fail(xhr => deferred.reject(xhr.responseText));
        return deferred;
    }

    prepareSentData (data) {
        const layers = {
            inputLayer: data.inputLayer,
            hiddenLayer: data.hiddenLayer,
            outputLayer: data.outputLayer
        };
        const network = {
            name: data.name,
            data: JSON.stringify(layers)
        };
        return {
            id: data.id,
            network
        };
    }
};