/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.RecognitionResult = class RecognitionResult extends Front.Element {

    static ACTIVATION_VALUE = .5;

    constructor () {
        super(...arguments);
        this.$nums = this.find('.recognition-num');
    }

    reset () {
        for (const num of this.$nums) {
            this.renderOutput(null, $(num).removeClass('active'));
        }
    }

    setValues (outputs) {
        this.activeValue = null;
        this.activeNum = null;
        for (let num = 0; num < outputs.length; ++num) {
            let value = outputs[num];
            this.renderOutput(value, this.$nums.eq(num));
            this.setActiveValue(value, num);
        }
        if (this.activeValue) {
            this.$nums.eq(this.activeNum).addClass('active');
        }
    }

    setActiveValue (value, num) {
        if (value < this.constructor.ACTIVATION_VALUE) {
            return;
        }
        if (this.activeValue === null) {
            this.activeValue = value;
            this.activeNum = num;
        } else {
            // activating multiple outputs means that the result becomes undefined
            this.activeValue = undefined;
            this.activeNum = undefined;
        }
    }

    renderOutput (value, $num) {
        $num.find('.recognition-output').html(this.formatValue(value));
    }

    formatValue (value) {
        if (typeof value !== 'number') {
            return '';
        }
        if (value > .99) {
            value = .99;
        }
        return Math.round(value * 100);
    }
};