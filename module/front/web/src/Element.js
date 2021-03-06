/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Element = class Element {

    constructor (container, front) {
        this.front = front;
        this.container = container;
        this.$container = $(container);
        this.$container.data('handler', this);
    }

    find () {
        return this.$container.find(...arguments);
    }

    getData (key) {
        return this.$container.data(key);
    }

    getDataUrl (action) {
        return this.front.getData('dataUrl') + action;
    }

    getMetaUrl (action) {
        return this.front.getData('metaUrl') + action;
    }

    getClosestHandler (Class) {
        return Front.findHandler(Class, this.$container.parents('[data-handler]'));
    }

    getHandler (Class) {
        return Front.findHandler(Class, this.find(`[data-handler]`));
    }

    createHandlers () {
        Front.createHandlers(this.front, this.container);
    }

    getTemplate (name) {
        return Front.getTemplate(name, this.container);
    }

    resolveTemplate (name, ...args) {
        return Front.resolveTemplate(this.getTemplate(name), ...args);
    }

    renderError (data) {
        return `${data.statusText}: ${data.responseText}`;
    }

    on () {
        this.$container.on(...arguments);
    }

    trigger () {
        this.$container.trigger(...arguments);
    }

    toggleClass () {
        this.$container.toggleClass(...arguments);
    }
};