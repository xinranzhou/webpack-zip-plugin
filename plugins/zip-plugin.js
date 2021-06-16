const JSZip = require('jszip')
const zip = new JSZip()
const path = require('path')
const RawSource = require('webpack-sources').RawSource
module.exports = class ZipPlugin {
    constructor(opt) {
        this.opt = opt
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
            const folder = zip.folder(this.opt.filename)
            for (const name in compilation.assets) {
                const source = compilation.assets[name].source()
                folder.file(this.opt.filename, source)
            }
            zip.generateAsync({
                type: 'nodebuffer'
            }).then((content) => {
                const outPath = path.join(
                    compilation.options.output.path,
                    `${this.opt.filename}.zip`
                )
                const relativePath = path.relative(
                    compilation.options.output.path,
                    outPath
                )
                compilation.assets[relativePath] = new RawSource(content)
                callback()
            })
        })
    }
}