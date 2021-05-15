/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class WeightDrawer extends Base {

    constructor (config) {
        super({
            root: 'temp/weight-draw',
            height: 28,
            width: 28,
            ...config
        });
    }

    async drawLayer (layer, name) {
        for (const neuron of layers.neurons) {
            await this.drawNeuron(neuron, name);
        }
    }

    async drawNeuron (neuron, name = '') {
        const file = this.module.getPath(this.root, name, neuron.index);
        const pixels = this.getPixels(neuron);
        await sharp(new Uint8Array(pixels), {
            raw: {
                width: this.width,
                height: this.height,
                channels: 1
            }
        }).png().grayscale().toFile(`${file}.png`);
    }

    getPixels (neuron) {
        const [min, max] = neuron.calculateExtremeWeights();
        const interval =  max - min;
        const pixels = [];
        for (const weight of neuron.weights) {
            pixels.push(Math.floor((weight - min) * 255 / interval));
        }
        return pixels;
    }
};

const sharp = require('sharp');