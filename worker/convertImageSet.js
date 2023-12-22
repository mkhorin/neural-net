/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const {workerData, parentPort} = require('worker_threads');
const fs = require('fs');
const sharp = require('sharp');
const AdmZip = require('adm-zip');
const {file} = workerData;

console.log(`Unzipping archive: ${file}`);

const zip = new AdmZip(`${file}.zip`);
const entries = zip.getEntries();
const map = JSON.parse(fs.readFileSync(`${file}.json`));

console.log(`Found entries: ${entries.length}`);
console.log(`Normalizing data...`);

const items = [];
const promises = [];
for (const entry of entries) {
    if (map.hasOwnProperty(entry.name)) {
        promises.push(sharp(entry.getData()).grayscale().raw().toBuffer());
        items.push([null, map[entry.name]]);
    }
}
Promise.all(promises).then(values => {
    for (let i = 0; i < values.length; ++i) {
        items[i][0] = values[0];
    }
    parentPort.postMessage(items);
}).catch(err => {
   throw err;
});