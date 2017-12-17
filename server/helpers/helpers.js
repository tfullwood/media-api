const _ = require('lodash')

function trim(val) {
  if (val) {
    return _.trim(val)
  } else {
    return val
  }
}

module.exports = {
  trim
}
