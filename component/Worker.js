/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class Worker extends Base {

    execute (script, workerData) {
        return new Promise((resolve, reject) => {
            try {
                const worker = new wt.Worker(script, {workerData});
                worker.on('message', resolve);
                worker.on('error', reject);
                worker.on('exit', this.onExit.bind(this, reject))
            } catch (err) {
                reject(err);
            }
        });
    }

    onExit (reject, code) {
        if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
        }
    }
};

const wt = require('worker_threads');