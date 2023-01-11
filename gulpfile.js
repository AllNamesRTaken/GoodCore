import gulp from 'gulp'
import { writeFileSync, readFileSync } from 'fs'
import rename from 'gulp-rename'
import pkg from './package.json' assert { type: 'json' }

let { task, parallel, series, src, dest } = gulp

let { version, name, unpkg, main, module, description } = pkg

let _version = version
version = _version.split('.').map((v) => parseInt(v) || 0)

task(
  'bump',
  parallel(function (cb) {
    version[2]++
    _version = version.join('.')
    writeFileSync('./package.json', JSON.stringify(pkg, null, 2), {
      encoding: 'utf8',
    })
    cb()
  })
)
task(
  'modifyBundle',
  parallel(function (cb) {
    var bundle = readFileSync(`./dist/lib/${name}.bundle.js`, 'utf8')
    var bundle = bundle.replace(
      'window, function()',
      `typeof(window) !== "undefined" ? window : typeof(global) !== "undefined" ? global : typeof(self) !== "undefined" ? self : undefined, function()`
    )
    var bundle = bundle.replace(
      'window,function()',
      `typeof(window) !== "undefined" ? window : typeof(global) !== "undefined" ? global : typeof(self) !== "undefined" ? self : undefined, function()`
    )
    writeFileSync(`./dist/lib/${name}.bundle.js`, bundle, { encoding: 'utf8' })
    cb()
  })
)
task(
  'package',
  series('bump', function () {
    return src(['./package.json', './README.md']).pipe(dest('dist/lib'))
  })
)
task(
  'copyDTS',
  parallel(() => {
    return src('./dts/**/*.d.ts').pipe(dest('dist/lib'))
  })
)
task(
  'copyWebpackExternalsFn',
  parallel(() => {
    return src('./src/lib/webpackExternals.js').pipe(dest('dist/lib'))
  })
)

