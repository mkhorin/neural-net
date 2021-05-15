/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.RecognitionResult = class RecognitionResult extends Front.Element {

    constructor () {
        super(...arguments);
        this.$nums = this.find('.recognition-num');
    }

    reset () {
        for (const num of this.$nums) {
            this.setOutput(null, $(num).removeClass('active'));
        }
    }

    setValues (outputs) {
        this.maxValue = 0;
        this.maxIndex = 0;
        for (let i = 0; i < outputs.length; ++i) {
            let output = outputs[i];
            this.setOutput(output, this.$nums.eq(i));
            if (output > this.maxValue) {
                this.maxValue = output;
                this.maxIndex = i;
            }
        }
        if (this.maxValue > 0) {
            this.$nums.eq(this.maxIndex).addClass('active');
        }
    }

    setOutput (value, $num) {
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