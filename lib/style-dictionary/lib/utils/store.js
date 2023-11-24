const { minimatch } = require("minimatch");

// eslint-disable-next-line no-undef
class FileMap extends Map {  
    rm(path) {
        const keys = [...this.keys()].filter(minimatch.filter(path, { matchBase: true }))
        for(const key of keys){
            this.delete(key)
        }
    }

    glob(path) {
        return [...this.keys()].filter(minimatch.filter(path, { matchBase: true }))
    }

    exist(path) {
        const keys = [...this.keys()].filter(minimatch.filter(path, { matchBase: true }))
        return !!keys.length
    }

    getJSON(key) {
        return JSON.parse(this.get(key))
    }
}

const fs = new FileMap();

module.exports = {
    fs
}