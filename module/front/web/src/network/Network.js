/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Network = class Network {

    static INPUT_LAYER_SIZE = 784;
    static OUTPUT_LAYER_SIZE = 10;

    static shuffle (items) {
        let i = items.length;
        while (i) {
            const j = Math.floor((i--) * Math.random());
            const temp = items[i];
            items[i] = items[j];
            items[j] = temp;
        }
        return items;
    }

    constructor (params = {}) {
        this.params = params;
        this.learningRate = params.learningRate;
        this.inputLayer = this.createInputLayer();
        this.hiddenLayer = this.createHiddenLayer();
        this.outputLayer = this.createOutputLayer();
    }

    createInputLayer () {
        return new Front.InputNetworkLayer({
            size: this.constructor.INPUT_LAYER_SIZE
        });
    }

    createHiddenLayer () {
        return new Front.NetworkLayer({
            size: this.params.neurons,
            bias: this.params.hiddenLayerBias,
            minInitialWeight: this.params.minInitialWeight,
            maxInitialWeight: this.params.maxInitialWeight
        });
    }

    createOutputLayer () {
        return new Front.NetworkLayer({
            size: this.constructor.OUTPUT_LAYER_SIZE,
            bias: this.params.outputLayerBias,
            minInitialWeight: this.params.minInitialWeight,
            maxInitialWeight: this.params.maxInitialWeight
        });
    }

    createSynapses () {
        this.hiddenLayer.createSynapses(this.inputLayer);
        this.outputLayer.createSynapses(this.hiddenLayer);
    }

    getActiveNeuron () {
        let active = null;
        for (let neuron of this.outputLayer.neurons) {
            if (!active || active.output < neuron.output) {
                active = neuron;
            }
        }
        return active;
    }

    exportData () {
        return {
            inputLayer: this.inputLayer.exportData(),
            hiddenLayer: this.hiddenLayer.exportData(),
            outputLayer: this.outputLayer.exportData()
        };
    }

    importData (data) {
        this.inputLayer.importData(data.inputLayer);
        this.hiddenLayer.importData(data.hiddenLayer);
        this.outputLayer.importData(data.outputLayer);
    }

    processInputs (data) {
        data = this.inputLayer.processInputs(data);
        data = this.hiddenLayer.processInputs(data);
        return this.outputLayer.processInputs(data);
    }

    processTrainingError (target) {
        let totalError = 0;
        for (let outputNeuron of this.outputLayer.neurons) {
            let error = (target === outputNeuron.index ? 1 : 0) - outputNeuron.output;
            outputNeuron.delta = error * outputNeuron.calculateDerivative() * this.learningRate;
            totalError += error * error * .5;
        }
        for (let hiddenNeuron of this.hiddenLayer.neurons) {
            let error = 0;
            for (let outputNeuron of this.outputLayer.neurons) {
                error += outputNeuron.delta * outputNeuron.weights[hiddenNeuron.index];
            }
            let delta = error * hiddenNeuron.calculateDerivative();
            for (let i = 0; i < hiddenNeuron.weights.length; ++i) {
                hiddenNeuron.weights[i] += delta * hiddenNeuron.inputs[i];
            }
        }
        for (let outputNeuron of this.outputLayer.neurons) {
            for (let i = 0; i < outputNeuron.weights.length; ++i) {
                outputNeuron.weights[i] += outputNeuron.delta * outputNeuron.inputs[i];
            }
        }
        return totalError;
    }

    validateWeights () {
        return this.hiddenLayer.validateWeights()
            && this.outputLayer.validateWeights();
    }
};