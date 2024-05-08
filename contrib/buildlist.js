function sortObj(obj) {
    let entries = Object.entries(obj).sort((a,b) => {
        if (a[0] < b[0]) {
            return -1
        }
        return 1
    })
    return Object.fromEntries(entries)
}
function cleanFlags(flagObj) {
    flagObj = sortObj(flagObj)
    
    // format hex colors
    let formattedEntries = []
    for (let [name, obj] of Object.entries(flagObj)) {
        obj.stripes = obj.stripes.map(v => v.toLowerCase())
        formattedEntries.push([name, obj])
    }
    return Object.fromEntries(formattedEntries)
}
function readJSONC(path) {
    path = join(__dirname, path)
    const jsonc = readFileSync(path, 'utf8')
    // TODO: this probably needs to be better
    const json = JSON.parse(jsonc.replace(/ {0,}\/\/.+/gm, '').replace(/\/\*.+?\*\//igm))
    return json
}
const {readFileSync, writeFileSync} = require('node:fs')
const YAML = require('yaml')
const {join} = require('node:path')
const flags = readJSONC('../unified-flags.jsonc')

const cleaned = cleanFlags(flags)
writeFileSync(join(__dirname, '../unified-flags.json'), JSON.stringify(cleaned, null, 4))
writeFileSync(join(__dirname, '../unified-flags.yaml'), YAML.stringify(cleaned, null, 4))