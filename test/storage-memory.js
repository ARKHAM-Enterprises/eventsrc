import test from 'ava'
import createMemoryStorage from '../lib/storage/memory'

test('memory storage', (t) =>  {
  const memoryStorage = createMemoryStorage()

  memoryStorage.persist({
    key: 'TEST_EVENT_CREATED',
    payload: {
      id: 'myEvent',
      data: [0, 1]
    }
  })

  memoryStorage.persist({
    key: 'TEST_EVENT_CREATED',
    payload: {
      id: 'myEvent2',
      data: [0, 2]
    }
  })

  memoryStorage.persist({
    key: 'TEST_EVENT_CHANGED',
    payload: {
      id: 'myEvent',
      data: [1, 2]
    }
  })

  let events = memoryStorage.getEvents('myEvent')

  t.deepEqual(events.length, 2)
  t.deepEqual(events[0].version, 1)
  t.deepEqual(events[0].key, 'TEST_EVENT_CREATED')
  t.deepEqual(events[0].payload, { id: 'myEvent', data: [0, 1] })
  t.deepEqual(events[1].version, 2)
  t.deepEqual(events[1].key, 'TEST_EVENT_CHANGED')

  events = memoryStorage.getEvents('myEvent2')
  t.deepEqual(events.length, 1)
  t.deepEqual(events[0].version, 1)
  t.deepEqual(events[0].payload, { id: 'myEvent2', data: [0, 2] })
  t.deepEqual(events[0].key, 'TEST_EVENT_CREATED')
})
