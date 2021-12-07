;(function () {
  'use strict'

  var docsearch = require('@docsearch/js/dist/umd/index')

  function getCurrentVersion () {
    var docsVersion = null
    var versionMetaTag = document.querySelector('meta[name="docsearch:version"]')
    if (versionMetaTag) {
      docsVersion = versionMetaTag.content
    }
    if (!docsVersion) {
      var containerElement = document.getElementsByClassName('nav-container')[0]
      if (containerElement) {
        var versionAttribute = containerElement.attributes['data-version']
        if (versionAttribute) {
          docsVersion = versionAttribute.value
        }
      }
    }
    return docsVersion
  }

  var currentVersion = getCurrentVersion()
  var facetFilters = currentVersion ? ['version:' + currentVersion] : []

  var searchInput = document.getElementById('search-input')

  if (searchInput) {
    docsearch({
      appId: '0OK9AIS3C7',
      apiKey: '90a2e836fe5a35913c339fc9e12e3a27',
      indexName: 'payara',
      inputSelector: '#search-input',
      algoliaOptions: { facetFilters: facetFilters, hitsPerPage: 30 },
      debug: false, // Set debug to true if you want to inspect the dropdown
    })

    searchInput.focus()
  }
})()
