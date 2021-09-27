/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.NumberValidator = class NumberValidator extends Front.Validator {

    constructor (config) {
        super({
            max: null,
            min: null,
            integerOnly: false,
            ...config
        });
    }

    validateValue (value) {
        const number = Number(value);
        if (isNaN(number)) {
            return 'Value must be a number';
        }
        if (this.integerOnly && !Number.isSafeInteger(number)) {
            return 'Number must be a integer';
        }
        if (typeof this.min === 'number' && number < this.min) {
            return ['Value must be no less than {min}', {
                min: this.min
            }];
        }
        if (typeof this.max === 'number' && number > this.max) {
            return ['Value must be no greater than {max}', {
                max: this.max
            }];
        }
    }
};