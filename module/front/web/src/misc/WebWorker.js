/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.WebWorker = class WebWorker {

    constructor (params) {
        this.params = params;
        this.active = false;
    }

    isActive () {
        return this.active;
    }

    start (data) {
        this.stop();
        this.workerParams = data;
        this.params.dataSet.load()
            .then(this.startWorker.bind(this))
            .catch(this.onError.bind(this));
    }

    startWorker (inputs) {
        if (this.workerParams) {
            this.active = true;
            this.worker = new Worker(this.resolveWorkerScript());
            this.worker.addEventListener('error', this.onError.bind(this));
            this.worker.addEventListener('message', this.onMessage.bind(this));
            this.worker.postMessage({
                params: this.workerParams,
                inputs
            });
        }
    }

    resolveWorkerScript () {
        return Front.SCRIPT.replace('front.min', this.params.script);
    }

    stop () {
        this.active = false;
        this.workerParams = null;
        this.worker?.terminate();
    }

    onError (data) {
        this.params.onError(data.message);
        this.stop();
    }

    onMessage ({data}) {
        if (data.error) {
            this.params.onError(data.error);
            return this.stop();
        }
        if (data.result) {
            this.params.onComplete(data.result);
            return this.stop();
        }
        if (data.log && this.params.onLog) {
            return this.params.onLog(data.log);
        }
        if (data.progress && this.params.onProgress) {
            return this.params.onProgress(data.progress);
        }
        this.params.onMessage?.(data);
    }
};