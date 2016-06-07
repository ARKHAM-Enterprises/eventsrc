const sortEvents = require('../sort-events')

const createMeteorMongoStorage = function (collection) {
  return {
    persist: function (event) {
      collection.insert(event)
    },

    getEvents: function (id, version) {
      var selector = { 'payload.id' : id }

      if (version) {
        selector.version = { $lte: version }
      }

      const events = collection.find(selector, {
        sort: { version: -1 }
      }).fetch()

      return sortEvents(events)
    },
    _collection: collection
  }
}

module.exports = createMeteorMongoStorage
