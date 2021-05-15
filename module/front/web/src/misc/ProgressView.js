/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.ProgressView = class ProgressView extends Front.Element {

    init () {
        this.$progress = this.find('.progress-bar');
    }

    reset (value = 0) {
        this.setValue(value);
    }

    setValue (value) {
        value = value > 100 ? 100 : value;
        this.$progress.css('width', `${value}%`);
    }
};