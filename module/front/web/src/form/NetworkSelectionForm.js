/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.NetworkSelectionForm = class NetworkSelectionForm extends Front.Form {

    init () {
        super.init();
        this.localAttr = this.getAttrHandler('localNetwork');
        this.remoteAttr = this.getAttrHandler('remoteNetwork');
        this.find('[data-command="deleteLocally"]').click(this.onDeleteLocally.bind(this));
        this.find('[data-command="deleteRemotely"]').click(this.onDeleteRemotely.bind(this));
        this.on('change', this.onChange.bind(this));
    }

    isSelected () {
        return this.remoteAttr.getValue() || this.localAttr.getValue();
    }

    getNetwork () {
        if (this.remoteAttr.getValue()) {
            return this.getRemoteNetwork();
        }
        if (this.localAttr.getValue()) {
            return this.getLocalNetwork();
        }
    }

    getLocalNetwork () {
        return this.front.localNetworkStorage.get(this.localAttr.getValue());
    }

    getRemoteNetwork () {
        return this.front.remoteNetworkStorage.get(this.remoteAttr.getValue());
    }

    onDeleteLocally () {
        this.deleteNetwork(this.localAttr.getValue(), this.front.localNetworkStorage);
    }

    onDeleteRemotely () {
        this.deleteNetwork(this.remoteAttr.getValue(), this.front.remoteNetworkStorage);
    }

    deleteNetwork (id, storage) {
        id ? Jam.dialog.confirmDeletion('Delete this neural network permanently?').then(() => storage.remove(id))
           : Jam.dialog.alert('Select a neural network');
    }

    onChange (event) {
        const attr = this.getAttrHandler(event.target.name);
        if (attr === this.localAttr && this.remoteAttr.getValue()) {
            this.remoteAttr.setValue(null);
        }
        if (attr === this.remoteAttr && this.localAttr.getValue()) {
            this.localAttr.setValue(null);
        }
    }

    select (id) {
        this.front.remoteNetworkStorage.has(id)
            ? this.remoteAttr.setValue(id).change()
            : this.localAttr.setValue(id).change();
    }
};