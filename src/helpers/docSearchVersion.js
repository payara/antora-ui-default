'use strict'

module.exports = (pageVersion, edition) => {
  if (pageVersion === 'master') {
    return (edition) + '-latest'
  } else {
    return pageVersion
  }
}
