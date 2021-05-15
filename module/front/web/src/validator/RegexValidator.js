/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.RegexValidator = class RegexValidator extends Front.Validator {

    constructor (config) {
        super({
            pattern: null, // regex
            ...config
        });
    }

    validateValue (value) {
        if (typeof value !== 'string') {
            return 'Invalid value';
        }
        if (!this.pattern.test(value)) {
            return 'This value does not match the pattern';
        }
    }
};