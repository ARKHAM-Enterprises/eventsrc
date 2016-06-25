const createMemoryStorage = require('./storage/memory')
const createMeteorMongoStorage = require('./storage/meteor-mongo')

const createEmitter = function () {
  return {
    subscriptions: [],

    emit: function (event) {
      this.subscriptions.forEach(function (func) { func(event) })
    },

    on: function (func) {
      this.subscriptions.push(func)
    }
  }
}

const createStore = function (config) {
  if (!config.storage || !config.reduce) {
    throw new Error('Configure a storage and a reducer to use eventsrc!')
  }

  const emitter = createEmitter()
  const storage = config.storage

  return {
    emit: function (key, payload) {
      const event = {
        key: key,
        payload: payload
      }

      if (!payload.id) {
        throw new Error('Payload needs to have an id set');
      }

      storage.persist(event)
      emitter.emit(event)
    },
    subscribe: function (func) {
      emitter.on(func)
    },
    find: function (documentId, version) {
      const events = storage.getEvents(documentId, version)

      if (events.length === 0) {
        return null
      }

      return events.reduce(function (doc, event) {
        return config.reduce(doc, event)
      }, undefined)
    },
    restore: function () {
      const events = storage.getAllEvents()

      events.forEach(function (event) {
        emitter.emit(event)
      })
    },
    storage: storage
  }
}

module.exports = {
  createEventStore: createStore,
  createMemoryStorage: createMemoryStorage,
  createMeteorMongoStorage: createMeteorMongoStorage
}
