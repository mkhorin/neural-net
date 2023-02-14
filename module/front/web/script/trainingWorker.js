/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

addEventListener('message', ({data}) => {
    const result = new Front(data).train();
    postMessage({result});
    close();
}, false);

class Front {

    constructor ({params, inputs}) {
        this.params = params;
        this.inputs = inputs;
        this.stopErrorThreshold = params.stopErrorThreshold;
        this.startErrorThreshold = params.startErrorThreshold;
        this.progressStep = params.progressStep || 1000;
        this.maxProgressIterations = params.maxProgressIterations || 15;
        this.totalProgressSteps = this.maxProgressIterations * inputs.length;
        this.network = new Front.Network(this.params);
    }

    train () {
        let minError = Number.MAX_VALUE;
        let iterations = 0;
        while (minError > this.startErrorThreshold) {
            this.network.createSynapses();
            let error = this.iterateTraining();
            if (error < minError) {
                minError = error;
            }
            let log = `Initialization iteration: ${++iterations}. Error: ${error}. Min error: ${minError}`;
            postMessage({log});
        }
        iterations = 1;
        let previousError = null;
        while (true) {
            let error = this.iterateTraining(iterations);
            let log = `Training iteration: ${iterations}. Error: ${error}`;
            postMessage({log});
            if (previousError !== null) {
                if (previousError - error < this.stopErrorThreshold) {
                    break;
                }
            }
            previousError = error;
            ++iterations;
        }
        if (this.network.validateWeights()) {
            return this.network.exportData();
        }
        return {
            error: 'Invalid weights'
        };
    }

    iterateTraining (iterations = 0) {
        let counter = iterations * this.inputs.length;
        let error = 0;
        let inputs = Front.Network.shuffle(this.inputs);
        for (let [value, data] of inputs) {
            this.network.processInputs(data);
            error += this.network.processTrainingError(value);
            if (++counter % this.progressStep === 0) {
                const progress = this.calculateProgress(counter);
                postMessage({progress});
            }
        }
        return error / this.inputs.length;
    }

    calculateProgress (counter) {
        return Math.floor(counter * 100 / this.totalProgressSteps) % 100
    }
}