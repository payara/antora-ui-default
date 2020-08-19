'use strict'

module.exports = (item, list) => {
  // split over commas, ignore blank space before and after commas and the start and end
  var itemsArray = list ? list.trim().split(/\s*,\s*/) : []
  return itemsArray.indexOf(item) >= 0
}
