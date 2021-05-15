/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.NetworkStorage = class NetworkStorage {

    static compareNames (a, b) {
        return !a.localeCompare(b, 'en', {sensitivity: 'base'});
    }

    static indexOf (value, items, key = 'id') {
        for (let i = 0; i < items.length; ++i) {
            if (items[i][key] === value) {
                return i;
            }
        }
    }

    constructor (front) {
        this.front = front;
        this.$virtual = $('<div/>');
    }

    on () {
        this.$virtual.on(...arguments);
    }

    trigger () {
        this.$virtual.trigger(...arguments);
    }

    triggerChange () {
        this.trigger('change');
    }
};