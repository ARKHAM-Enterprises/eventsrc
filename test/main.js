import test from 'ava'
import {
  createEventStore,
  createMemoryStorage
} from '../lib/main'

test('invalid createEventStore', t => {
  t.throws(() => createEventStore({}))
  t.throws(() => createEventStore({ storage: createMemoryStorage() }))
  t.throws(() => createEventStore({ reduce: () => {} }))
})

test('subscribe', t => {
  t.pass(2)

  const store = createEventStore({
    storage: createMemoryStorage(),
    reduce() {}
  })

  const expectedEvents = [
    {
      key: 'EVENT_HAPPENED',
      version: 1,
      payload: {
        id: 'id',
        data: 'wow'
      }
    },
    {
      key: 'EVENT_HAPPENED',
      version: 2,
      payload: {
        id: 'id',
        data: 'wow2'
      }
    }
  ]

  store.subscribe(e => {
    t.deepEqual(e, expectedEvents.shift())
  })

  store.emit('EVENT_HAPPENED', {
    id: 'id',
    data: 'wow'
  })

  store.emit('EVENT_HAPPENED', {
    id: 'id',
    data: 'wow2'
  })
})


test('find', t => {
  const store = createEventStore({
    storage: createMemoryStorage(),
    reduce(doc, event) {
      if ('EVENT_CREATED' === event.key) {
        return {
          initial: true,
          name: event.payload.name
        }
      } else if ('EVENT_NAME_CHANGED' === event.key) {
        return Object.assign({}, doc, {
          name: event.payload.name
        })
      }

      return doc
    }
  })

  const id = 'documentId'

  store.emit('EVENT_CREATED', {
    id,
    name: 'name v1'
  })

  store.emit('EVENT_NAME_CHANGED', {
    id,
    name: 'name v2'
  })

  store.emit('SOME_NON_EXISTING_EVENT', { id })

  const latestDoc = store.find(id)
  const secondDoc = store.find(id, 2)
  const firstDoc = store.find(id, 1)

  t.is(latestDoc.initial, true)
  t.is(latestDoc.name, 'name v2')
  t.is(secondDoc.initial, true)
  t.is(secondDoc.name, 'name v2')
  t.is(firstDoc.initial, true)
  t.is(firstDoc.name, 'name v1')
})
