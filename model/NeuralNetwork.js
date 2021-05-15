/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/db/ActiveRecord');

module.exports = class NeuralNetwork extends Base {

    static getConstants () {
        return {
            TABLE: 'neuralNetwork',
            ATTRS: [
                'name',
                'data'
            ],
            RULES: [
                [['name', 'data'], 'required'],
                ['name', 'regex', {pattern: /^[a-z0-9\- ]{1,32}$/i}],
                ['name', 'unique'],
                ['data', 'string']
            ]
        };
    }

    validateInputLayer (attr) {
        const value = this.get(attr);
        if (value?.size !== this.INPUT_SIZE) {
            this.addError(attr, 'Invalid input layer');
        }
    }

    validateHiddenLayer (attr, {min, max}) {
        const neurons = this.get(attr);
        if (!Array.isArray(neurons) || neurons.length < min || neurons.length > max) {
            this.addError(attr, 'Invalid hidden layer');
        } else if (this.validateNeurons(neurons, this.INPUT_SIZE)) {
            this.addError(attr, 'Invalid hidden neurons');
        }
    }

    validateOutputLayer (attr) {
        const neurons = this.get(attr);
        if (!Array.isArray(neurons) || neurons.length !== this.OUTPUT_SIZE) {
            this.addError(attr, 'Invalid output layer');
        } else if (this.validateNeurons(neurons, this.get('hiddenLayer').length)) {
            this.addError(attr, 'Invalid output neurons');
        }
    }

    validateNeurons (neurons, size) {
        for (const neuron of neurons) {
            if (!this.validateNeuron(neuron, size)) {
                return false;
            }
        }
        return true;
    }

    validateNeuron (data, size) {
        return Array.isArray(data)
            && typeof data[0] === 'number'
            && Array.isArray(data[1])
            && data[1].length === size
            && this.validateWeights(data[1]);
    }

    validateWeights (weights) {
        for (const weight of weights) {
            if (typeof weight !== 'number') {
                return false;
            }
        }
        return true;
    }
};
module.exports.init(module);