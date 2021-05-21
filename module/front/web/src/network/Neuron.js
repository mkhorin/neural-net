/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Neuron = class Neuron {

    constructor (index, params) {
        this.index = index;
        this.bias = params.bias;
        this.minInitialWeight = params.minInitialWeight;
        this.maxInitialWeight = params.maxInitialWeight;
        this.weights = [];
    }

    createSynapses (size) {
        this.weights = [];
        for (let i = 0; i < size; ++i) {
            this.weights.push(this.getInitialWeight());
        }
    }

    getInitialWeight () {
        return (this.maxInitialWeight - this.minInitialWeight) * Math.random() + this.minInitialWeight;
    }

    exportData () {
        return [this.bias, this.weights];
    }

    importData (data) {
        this.bias = data[0];
        this.weights = data[1];
    }

    processInputs (inputs) {
        this.inputs = inputs;
        this.sum = this.calculateSum();
        this.output = this.calculateOutput();
        return this.output;
    }

    calculateSum () {
        let sum = 0;
        for (let i = 0; i < this.weights.length; ++i) {
            sum += this.inputs[i] * this.weights[i];
        }
        return sum + this.bias;
    }

    calculateOutput () {
        return this.sum < 0 ? 0 : this.sum; // ReUL
    }

    calculateDerivative () {
        return this.sum < 0 ? 0 : 1; // ReUL derivative
    }

    calculateSigmoidOutput () {
        return 1 / (1 + Math.exp(-this.sum));
    }

    calculateSigmoidDerivative () {
        return this.output * (1 - this.output);
    }

    calculateExtremeWeights () {
        let min = 0, max = 0;
        for (let weight of this.weights) {
            if (min > weight) {
                min = weight;
            }
            if (max < weight) {
                max = weight;
            }
        }
        return [min, max];
    }

    validateWeights () {
        for (let weight of this.weights) {
            if (isNaN(weight) || weight === Infinity) {
                return false;
            }
        }
        return true;
    }
};