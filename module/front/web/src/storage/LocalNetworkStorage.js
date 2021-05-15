/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.LocalNetworkStorage = class LocalNetworkStorage extends Front.NetworkStorage {

    static generateId () {
        return Date.now().toString();
    }

    constructor () {
        super(...arguments);
        this.storeKey = 'neuralNetworks';
    }

    list () {
        return Jam.localStorage.get(this.storeKey) || [];
    }

    has (id) {
        return this.constructor.indexOf(id, this.list()) !== undefined;
    }

    get (id) {
        const items = this.list();
        const index = this.constructor.indexOf(id, items);
        return items[index];
    }

    findByName (name) {
        const items = this.list();
        const index = this.constructor.indexOf(name, items, 'name');
        return items[index];
    }

    remove (id) {
        const items = this.list();
        const index = this.constructor.indexOf(id, items);
        if (typeof index === 'number') {
            items.splice(index, 1);
            this.updateInternal(items);
            this.triggerChange();
        }
    }

    create (data) {
        const items = this.list();
        data.id = this.constructor.generateId();
        items.push(data);
        return this.saveInternal(items, data.id);
    }

    update (data) {
        const items = this.list();
        const index = this.constructor.indexOf(data.id, items);
        items.splice(index, 1, data);
        return this.saveInternal(items, data.id);
    }

    saveInternal (data, id) {
        const error = this.updateInternal(data);
        if (error) {
            return $.Deferred().reject(error);
        }
        this.triggerChange();
        return $.Deferred().resolve(id);
    }

    updateInternal (data) {
        try {
            Jam.localStorage.set(this.storeKey, data);
        } catch (error) {
            console.error(error);
            return error instanceof DOMException
                ? 'Local storage exceeded the quota. Delete previous saves'
                : String(error);
        }
    }
};