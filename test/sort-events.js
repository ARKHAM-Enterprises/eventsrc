import test from 'ava'
import sortEvents from '../lib/sort-events'

const getEvent = version => ({
  version,
  payload: {},
  id: 'testId'
})

test('sort events', t => {
  const events = [
    getEvent(2),
    getEvent(3),
    getEvent(1),
    getEvent(5),
    getEvent(4)
  ]

  const sortedEvents = [
    getEvent(1),
    getEvent(2),
    getEvent(3),
    getEvent(4),
    getEvent(5)
  ]

  t.deepEqual(sortEvents(events), sortedEvents)
})
