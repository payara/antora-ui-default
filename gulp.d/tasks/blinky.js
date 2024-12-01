'use strict'

const vfs = require('vinyl-fs')

module.exports = (src, dest) => () =>
  vfs
    .src(src)
    .pipe(vfs.dest(dest))
