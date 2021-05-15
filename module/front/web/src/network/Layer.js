/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.NetworkLayer = class NetworkLayer {

    constructor (params) {
        this.params = params;
        this.size = params.size || 0;
        this.neurons = this.createNeurons();
    }

    createNeurons () {
        const neurons = [];
        for (let i = 0; i < this.size; ++i) {
            neurons.push(this.createNeuron(i));
        }
        return neurons;
    }

    createNeuron (index) {
        return new Front.Neuron(index, this.params);
    }

    createSynapses (layer) {
        for (const neuron of this.neurons) {
            neuron.createSynapses(layer.size);
        }
    }

    exportData () {
        return this.neurons.map(neuron => neuron.exportData());
    }

    importData (data) {
        this.size = data.length;
        this.neurons = this.createNeurons();
        for (let i = 0; i < this.size; ++i) {
            this.neurons[i].importData(data[i]);
        }
    }

    processInputs (inputs) {
        const results = [];
        for (const neuron of this.neurons) {
            results.push(neuron.processInputs(inputs));
        }
        return results;
    }

    validateWeights () {
        for (const neuron of this.neurons) {
            if (!neuron.validateWeights()) {
                return false;
            }
        }
        return true;
    }
};