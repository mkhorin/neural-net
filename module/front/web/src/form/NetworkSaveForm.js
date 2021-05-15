/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.NetworkSaveForm = class NetworkSaveForm extends Front.Form {

    getName () {
        return this.getValue('name');
    }

    setDefaultName (neurons) {
        this.setValue('name', `Neurons-${neurons}`);
    }
};