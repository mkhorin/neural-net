/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.TrainingForm = class TrainingForm extends Front.Form {

    validate () {
        if (super.validate(...arguments)) {
            return true;
        }
        this.scrollToError();
        return false;
    }
};