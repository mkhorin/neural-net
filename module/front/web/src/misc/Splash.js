/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Splash = class Splash extends Front.Element {

    constructor () {
        super(...arguments);
        this.$text = this.find('.splash-text');
        this.delay = parseInt(getComputedStyle(this.$container.get(0)).getPropertyValue('--fade-duration'));
    }

    setValue (value) {
        this.toggleFail(value === undefined);
        this.$text.html(value);
    }

    toggleFail (state) {
        this.toggleClass('fail', state);
    }

    show () {
        this.hide();
        this.toggleClass('active', true);
        this.timer = setTimeout(this.hide.bind(this), this.delay);
    }

    hide () {
        clearTimeout(this.timer);
        this.toggleClass('active', false);
    }
};