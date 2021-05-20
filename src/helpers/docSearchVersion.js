'use strict'

module.exports = (pageVersion, enterprise) => {
  if (pageVersion === 'master') {
    return (enterprise) ? 'enterprise-latest' : 'community-latest'
  } else {
    return pageVersion
  }
}
