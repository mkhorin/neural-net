/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Validator = class Validator {

    constructor (config) {
        Object.assign(this, config);
    }

    validate (value, attr) {
        const error = this.validateValue(value);
        if (!error) {
            return true;
        }
        attr.addError(error);
        return false;
    }

    validateValue () {}
};