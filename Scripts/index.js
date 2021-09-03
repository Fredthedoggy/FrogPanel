const parse = require('parse-diff')
const fs = require('fs')

function formatPatch(patch) {
    let output = "";
    const files = parse(patch);
    output = output.concat(`FrogPanel's Readable Patch File, from https://github.com/Fredthedoggy/frogpanel\nTo Install, Just Follow The File Names, and Line Numbers, and You'll be Good to Go!\n-----------------------------------------------------`)
    files.forEach(file => {
        let shownFile = false;
        file.chunks.forEach(chunk => {
            let shownLine = false;
            let add = undefined;
            chunk.changes.forEach(change => {
                if (!change.content.slice(1, change.content.length).replace(/\s/g, '').length) return
                if (!shownFile) {
                    shownFile = true
                    output = output.concat(`\n\nOpen / Create The File "${file.to}"\n`)
                }
                if (!shownLine) {
                    shownLine = true
                    output = output.concat(`\n-------------------\nGo to Line ${chunk.oldStart + 1}`)
                }
                const changeAdd = change.type === 'add';
                if (add !== changeAdd) {
                    if (changeAdd) {
                        output = output.concat(`\n-------\nAdd The Following Code:\n-------`)
                    } else {
                        output = output.concat(`\n-------\nDelete The Following Code:\n-------`)
                    }
                }
                add = changeAdd;
                output = output.concat(`\n${change.content.slice(1, change.content.length)}`)
            })
        })
        output = output.concat(`\n-----------------------------------------------------`)
    });
    output = output.concat(`\n\nYou're All Done!\nNice Job!`)
    return output
}

if (fs.existsSync('Readable')) {
    fs.rmdirSync('Readable', { recursive: true })
}
fs.mkdirSync('Readable')
fs.readdirSync('Patches').forEach(patch => {
    if (!patch.endsWith('.patch')) return;
    fs.writeFileSync(`Readable/${patch.slice(0, patch.length - 5)}txt`, formatPatch(fs.readFileSync(`Patches/${patch}`).toString()))
})
