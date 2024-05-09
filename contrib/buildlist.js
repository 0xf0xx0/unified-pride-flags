function sortObjByKey(obj) {
    let entries = Object.entries(obj).sort((a, b) => {
        if (a[0] < b[0]) {
            return -1
        }
        return 1
    })
    return Object.fromEntries(entries)
}
function GCF(a, b) {
    if (b === 0) {
        return a
    }
    return GCF(b, a % b)
}

function cleanFlags(flagObj) {
    flagObj = sortObjByKey(flagObj)

    // format hex colors
    let cleanedFlags = {}
    for (let [name, flag] of Object.entries(flagObj)) {
        /// good heavens walter, i cannot decide between upper and lower
        flag.stripes = flag.stripes.map((hex) => hex.toLowerCase())

        if (flag.weights) {
            // find the gcf
            const gcf = flag.weights.reduce(GCF)
            if (gcf > 1) {
                // reduce if possible
                flag.weights = flag.weights.map(v => v / gcf)
            }
        }
        cleanedFlags[name] = flag
    }
    return cleanedFlags
}

function readJSONC(path) {
    path = join(__dirname, path)
    const jsonc = readFileSync(path, 'utf8')
    // TODO: this probably needs to be better
    const json = JSON.parse(jsonc.replace(/ {0,}\/\/.+/gm, '').replace(/\/\*.+?\*\//gim))
    return json
}

const { readFileSync, writeFileSync } = require('node:fs')
const YAML = require('yaml')
const { join } = require('node:path')
const flags = readJSONC('../unified-flags.jsonc')

const cleaned = cleanFlags(flags)
writeFileSync(join(__dirname, '../generated/unified-flags.json'), JSON.stringify(cleaned))
writeFileSync(join(__dirname, '../generated/unified-flags.yaml'), YAML.stringify(cleaned))
