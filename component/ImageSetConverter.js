/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class ImageSetConverter extends Base {

    constructor (config) {
        super({
            source: 'asset/image/sample', // zip and json
            target: 'asset/sample',
            ...config
        });
    }

    async execute () {
        this.log('info', `Loading data...`);
        const items = await this.load();
        this.log('info', `Converting data...`);
        const data = await this.convert(items);
        await this.saveTarget(items);
    }

    async load () {
        const map = await FileHelper.readJsonFile(`${this.source}.json`);
        const zip = new AdmZip(`${this.source}.zip`);
        const entries = zip.getEntries();
        const items = [];
        this.log('info', `Loaded entries: ${entries.length}`);
        for (const entry of entries) {
            if (map.hasOwnProperty(entry.name)) {
                items.push([map[entry.name], entry.getData()]);
            } else {
                this.log('error', `Entry name not found: ${entry.name}`);
            }
        }
        return items;
    }

    async convert (items) {
        for (const item of items) {
            item[1] = Array.from(await sharp(item[1]).grayscale().raw().toBuffer());
        }
        return items;
    }

    saveTarget (data) {
        return fs.promises.writeFile(`${this.target}.json`, JSON.stringify(data));
    }

    log () {
        CommonHelper.log(this.module, this.constructor.name, ...arguments);
    }
};

const AdmZip = require('adm-zip');
const CommonHelper = require('areto/helper/CommonHelper');
const FileHelper = require('areto/helper/FileHelper');
const fs = require('fs');
const sharp = require('sharp');