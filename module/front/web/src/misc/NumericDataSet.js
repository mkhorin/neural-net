/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.NumericDataSet = class NumericDataSet {

    constructor (params) {
        this.params = params;
    }

    load () {
        if (!this._loading) {
            this._loading = $.Deferred();
            this.loadZip(this.params.url)
                .then(this.prepareData.bind(this))
                .catch(this.onError.bind(this));
        }
        return this._loading;
    }

    async loadZip (url) {
        const reader = new zip.ZipReader(new zip.HttpReader(url));
        return reader.getEntries().then(this.prepareEntries.bind(this));
    }

    prepareEntries (entries) {
        return entries[0].getData(new zip.TextWriter);
    }

    prepareData (text) {
        this._items = JSON.parse(text);
        this._loading.resolve(this._items)
    }

    onError (data) {
        this._loading.reject(data);
    }
};