/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.TestingPage = class TestingPage extends Front.Page {

    init () {
        super.init();
        this.front.on('action:test', this.onActive.bind(this));

        this.networkSelectionForm = this.getHandler(Front.NetworkSelectionForm);
        this.networkSelectionForm.on('change', this.onStop.bind(this));
        this.progressLog = this.getHandler(Front.ProgressLog);
        this.progressView = this.getHandler(Front.ProgressView);
        this.testingDataSet = this.createTestingDataSet();
        this.testing = this.createTesting();

        this.on('click', '[data-command="stop"]', this.onStop.bind(this));
        this.on('click', '[data-command="start"]', this.onStart.bind(this));
    }

    onActive (event, data) {
        this.showPage(data);
    }

    activate (data) {
        super.activate(...arguments);
        this.selectNetwork(data?.networkId);
    }

    selectNetwork (id) {
        if (id && !this.testing.isActive()) {
            this.networkSelectionForm.select(id);
        }
    }

    onStop () {
        this.testing.stop();
        this.progressView.reset();
        this.toggleTesting(false);
    }

    onStart () {
        if (!this.networkSelectionForm.isSelected()) {
            return Jam.dialog.alert('Select a neural network');
        }
        this.progressView.reset();
        this.progressLog.clear();
        this.progressLog.append(Jam.t('Preparing a test dataset...'));
        this.toggleTesting(true);
        $.when(this.networkSelectionForm.getNetwork())
            .then(data => this.testing.start(data))
            .catch(this.onErrorTesting.bind(this));
    }

    createTestingDataSet () {
        return new Front.NumericDataSet({
            url: this.getData('dataSet')
        });
    }

    createTesting () {
        return new Front.WebWorker({
            script: 'testingWorker.min',
            dataSet: this.testingDataSet,
            onComplete: this.onCompleteTesting.bind(this),
            onError: this.onErrorTesting.bind(this),
            onLog: this.onLogTesting.bind(this),
            onProgress: this.onProgressTesting.bind(this)
        });
    }

    onCompleteTesting ({inputs, matches, errors}) {
        const percent = matches * 100 / inputs;
        this.find('.test-result').html(`${percent}%`);
        Jam.t(this.find('.test-errors').html(this.renderErrors(errors)));
        errors = inputs - matches;
        this.find('.test-info').html(Jam.t(['{errors} errors per {inputs} test digits:', {errors, inputs}]));
        this.networkSelectionForm.toggleDisabled(false);
        this.toggleCompleted(true);
    }

    renderErrors (errors) {
        const template = this.getTemplate('digitError');
        errors = errors.filter(counter => counter);
        errors = errors.map((counter, digit) => Jam.Helper.resolveTemplate(template, {digit, counter}));
        return errors.join('');
    }

    onErrorTesting (message) {
        Jam.dialog.error(message);
        this.toggleTesting(false);
    }

    onLogTesting () {
        this.progressLog.append(...arguments);
    }

    onProgressTesting () {
        this.progressView.setValue(...arguments);
    }

    toggleTesting (state) {
        this.toggleCompleted(false);
        this.toggleClass('testing', state);
        this.networkSelectionForm.toggleDisabled(state);
    }

    toggleCompleted (state) {
        this.toggleClass('completed', state);
    }
};