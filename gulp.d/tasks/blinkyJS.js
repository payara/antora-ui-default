'use strict'

const uglify = require('gulp-uglify')
const vfs = require('vinyl-fs')

module.exports = (src, dest) => () =>
  vfs
    .src(src)
    .pipe(uglify({ output: { comments: /^! / } }))
    .pipe(vfs.dest(dest))
