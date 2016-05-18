const sortEvents = function (events) {
  return events.sort(function compare(a, b) {
    if (a.version < b.version) {
      return -1;
    }

    if (a.version > b.version) {
      return 1;
    }

    throw new Error('This code should not be reached')
  })
}

module.exports = sortEvents
