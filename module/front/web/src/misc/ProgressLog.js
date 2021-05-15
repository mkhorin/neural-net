/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.ProgressLog = class ProgressLog extends Front.Element {

    init () {
        this.itemTemplate = this.getTemplate('item');
    }

    clear () {
        this.$container.empty();
    }

    append (message) {
        this.$container.append(this.createItem(message));
    }

    prepend (message) {
        this.$container.prepend(this.createItem(message));
    }

    createItem (message) {
        return Front.resolveTemplate(this.itemTemplate, {message});
    }
};