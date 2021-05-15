/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.RecognitionPage = class RecognitionPage extends Front.Page {

    static AUTO_RECOGNITION_DELAY = 500;

    init () {
        super.init();
        this.front.on('action:recognize', this.onActive.bind(this));
        this.drawing = this.getHandler(Front.Drawing);
        this.drawing.on('change', this.onChangeDrawing.bind(this));
        this.networkSelectionForm = this.getHandler(Front.NetworkSelectionForm);
        this.networkSelectionForm.on('change', this.onChangeNetwork.bind(this));
        this.recognitionResult = this.getHandler(Front.RecognitionResult);
        this.splash = this.getHandler(Front.Splash);
        this.find('[data-command="erase"]').click(this.onErase.bind(this));
        this.find('[data-command="recognize"]').click(this.onRecognize.bind(this));
    }

    afterInit () {
        this.$brushes = this.find('[name="brush"]');
        this.$brushes.change(this.onChangeBrush.bind(this));
        this.onChangeBrush();
    }

    onActive (event, data) {
        this.showPage(data);
    }

    onErase () {
        this.drawing.erase();
    }

    onChangeDrawing () {
        this.updateDrawing();
    }

    onChangeNetwork () {
        this.updateDrawing();
    }

    onRecognize () {
        const data = this.drawing.exportData();
        if (!data) {
            return Jam.dialog.alert('Draw a number from 0 to 9');
        }
        if (!this.networkSelectionForm.isSelected()) {
            return Jam.dialog.alert('Select a neural network');
        }
        $.when(this.networkSelectionForm.getNetwork()).then(network => {
            const outputs = this.recognize(data, network);
            this.recognitionResult.setValues(outputs);
            this.recognitionResult.activeValue
                ? this.splash.setValue(this.recognitionResult.activeNum)
                : this.splash.toggleFail(true);
            this.splash.show();
        });
    }

    recognize (inputData, networkData) {
        const network = new Front.Network;
        network.importData(networkData);
        return network.processInputs(inputData);
    }

    onChangeBrush () {
        this.drawing.setBrush(this.$brushes.filter(':checked').val());
    }

    updateDrawing () {
        this.recognitionResult.reset();
    }
};