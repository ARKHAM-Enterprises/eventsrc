# eventsrc.js

Extremely simple, storage agnostic event sourcing library.

* Allows for versioning of documents through events
* Lightweight without any dependencies
* Exposes a handful of methods

```js
import { createEventStore, createMemoryStorage } from 'eventsrc'

/*
 * This code creates a shopping cart event store
 * using a memory storage
 */
const cartEventStore = createEventStore({
  storage: createMemoryStorage(),

  /*
   * This reducer function (inspired by redux) always takes the latest
   * version of the document and the emitted event as arguments.
   * The return value is the new version of the document
   */
  reduce: function (doc = {}, event) {
    switch (event.type) {
      case 'CART_CREATED':
        return { items: event.payload.items }
      case 'ITEM_ADDED':
        return {
          ...doc
          items: doc.items.concat([event.payload.item])
        };
      default:
        return doc;
    }
  }
})

/*
 * Subscribe to any events that are emitted on the store
 */
cartEventStore.subscribe(event => {
  console.log(event)
})

/*
 * Emit an event with the key "CART_CREATED"
 * and a payload that contains the id, which always needs to be passed
 * and the items (see reduce method for logic)
 */
cartEventStore.emit('CART_CREATED', {
  id: 'newCartId',
  items: [{
    product: 'Awesome shoe',
    price: 40
  }]
})

/*
 * Emit a second event that adds another item to the cart
 */
cartEventStore.emit('ITEM_ADDED', {
  id: 'newCartId',
  item: {
    product: 'Another awesome shoe',
    price: 30
  }
})

console.log(cartEventStore.find('newCartId')) // holds two items
console.log(cartEventStore.find('newCartId', 1)) // holds only one item
```

## How to install

```bash
npm install eventsrc --save
```
