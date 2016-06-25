const sortEvents = require('../sort-events')

const createMeteorMongoStorage = function (collection, storeName) {
  return {
    persist: function (event) {
      event.at = new Date()
      event.storeName = storeName
      collection.insert(event)
    },
    getEvents: function (id, version) {
      var selector = {
        'payload.id' : id,
        storeName: storeName
      }

      if (version) {
        selector.version = { $lte: version }
      }

      const events = collection.find(selector, {
        sort: { version: -1 }
      }).fetch()

      return sortEvents(events)
    },
    getAllEvents: function () {
      return collection.find({ storeName: storeName }, {
        sort: { at: 1 }
      }).fetch()
    },
    _collection: collection
  }
}

module.exports = createMeteorMongoStorage
