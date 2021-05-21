/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

addEventListener('message', ({data}) => {
    const result = new Front(data).test();
    postMessage({result});
    close();
}, false);

class Front {

    constructor ({params, inputs}) {
        this.inputs = inputs;
        this.params = params;
        this.progressStep = params.progressStep || 1000;
        this.network = new Front.Network;
        this.network.importData(this.params);
    }

    test () {
        postMessage({
            log: `Test iteration: 1`
        });
        let counter = 0, matches = 0;
        let errors = Array(10).fill(0);
        for (let [value, data] of this.inputs) {
            this.network.processInputs(data);
            let active = this.network.getActiveNeuron();
            active?.index === value
                ? ++matches
                : ++errors[value];
            if (++counter % this.progressStep === 0) {
                postMessage({
                    progress: counter * 100 / this.inputs.length
                });
            }
        }
        return {
            inputs: this.inputs.length,
            matches,
            errors
        };
    }
}