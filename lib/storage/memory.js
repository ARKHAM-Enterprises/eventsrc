const sortEvents = require('../sort-events')

const createMemoryStorage = function () {
  var events = []

  const memoryStorage =  {
    persist: function (event) {
      const currentVersion = memoryStorage.getEvents(event.payload.id).length

      event.version = currentVersion + 1
      events = events.concat([event])
    },
    getEvents: function (id, version) {
      const notSortedEvents = events.filter(function (event) {
        const sameId = event.payload.id === id;

        if (!version) {
          return sameId;
        }

        return sameId && event.version <= version;
      });

      return sortEvents(notSortedEvents)
    }
  }

  return memoryStorage
}

module.exports = createMemoryStorage
