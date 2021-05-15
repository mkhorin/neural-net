/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.InputNetworkLayer = class NetworkLayer {

    constructor (params) {
        this.size = params.size;
    }

    exportData () {
        return {
            size: this.size
        };
    }

    importData (data) {
        this.size = data.size;
    }

    processInputs (values) {
        const result = [];
        for (const value of values) {
            result.push(value / 255);
        }
        return result;
    }
};