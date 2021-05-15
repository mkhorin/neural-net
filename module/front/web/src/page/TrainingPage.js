/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.TrainingPage = class TrainingPage extends Front.Page {

    init () {
        super.init();
        this.front.on('action:train', this.onActive.bind(this));

        this.trainingForm = this.getHandler(Front.TrainingForm);
        this.progressLog = this.getHandler(Front.ProgressLog);
        this.progressView = this.getHandler(Front.ProgressView);
        this.saveForm = this.getHandler(Front.NetworkSaveForm);
        this.trainingDataSet = this.createTrainingDataSet();
        this.training = this.createTraining();

        this.on('click', '[data-command="train"]', this.onTrain.bind(this));
        this.on('click', '[data-command="reset"]', this.onResetForm.bind(this));
        this.on('click', '[data-command="stop"]', this.onStop.bind(this));
        this.on('click', '[data-command="saveLocally"]', this.onSaveLocally.bind(this));
        this.on('click', '[data-command="saveRemotely"]', this.onSaveRemotely.bind(this));
        this.on('click', '[data-command="closeSave"]', this.onCloseSave.bind(this));
    }

    onActive (event, data) {
        this.showPage(data);
    }

    onTrain () {
        if (this.trainingForm.validate()) {
            this.progressLog.clear();
            this.progressLog.append(Jam.t('Preparing a training dataset...'));
            this.progressView.reset();
            this.training.start(this.trainingForm.serialize());
            this.toggleTraining(true);
        }
    }

    createTrainingDataSet () {
        return new Front.NumericDataSet({
            url: this.getData('dataSet')
        });
    }

    createTraining () {
        return new Front.WebWorker({
            script: 'trainingWorker.min',
            dataSet: this.trainingDataSet,
            onComplete: this.onCompleteTraining.bind(this),
            onError: this.onErrorTraining.bind(this),
            onLog: this.onLogTraining.bind(this),
            onProgress: this.onProgressTraining.bind(this)
        });
    }

    onCompleteTraining (data) {
        this.network = data;
        this.saveForm.reset();
        this.saveForm.setDefaultName(data.hiddenLayer.length);
        this.progressView.reset(100);
        this.toggleCompleted(true);
    }

    onErrorTraining (message) {
        Jam.dialog.error(message);
        this.toggleTraining(false);
    }

    onLogTraining () {
        this.progressLog.append(...arguments);
    }

    onProgressTraining () {
        this.progressView.setValue(...arguments);
    }

    toggleCompleted (state) {
        this.toggleClass('completed', state);
    }

    toggleTraining (state) {
        this.toggleClass('training', state);
        this.toggleCompleted(false);
        this.trainingForm.toggleDisabled(state);
    }

    onResetForm () {
        this.trainingForm.reset();
    }

    onStop () {
        this.training.stop();
        this.toggleTraining(false);
    }

    onSaveLocally () {
        this.saveNetwork(this.front.localNetworkStorage);
    }

    onSaveRemotely () {
        this.saveNetwork(this.front.remoteNetworkStorage);
    }

    saveNetwork (storage) {
        if (!this.saveForm.validate()) {
            return false;
        }
        this.network.name = this.saveForm.getName();
        this.network.id = storage.findByName(this.network.name)?.id;
        if (!this.network.id) {
            return this.performNetworkSave('create', storage);
        }
        Jam.dialog.confirm('Overwrite an existing network?').then(() => {
            this.performNetworkSave('update', storage);
        });
    }

    performNetworkSave (method, storage) {
        storage[method](this.network).then(networkId => {
            this.front.showPage('testing', {networkId});
            this.toggleTraining(false);
        }).catch(message => {
            Jam.dialog.error(message);
        });
    }

    onCloseSave () {
        this.toggleTraining(false);
    }
};