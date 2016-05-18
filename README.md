# eventsrc.js

Simple, straight forward event sourcing library.

```js
import { createEventStore, createMemoryStorage } from 'eventsrc'

const cartEventStore = createEventStore({
  storage: createMemoryStorage(),

  reduce: function (doc = {}, event) {
    switch (event.type) {
      case 'CART_CREATED':
        return { items: event.payload.items }
      case 'ITEM_ADDED':
        return Object.assign({}, doc, {
          items: doc.items.concat([event.payload.item])
        });
      default:
        return doc;
    }
  }
})

cartEventStore.subscribe(event => {
  console.log(event)
})

cartEventStore.emit('CART_CREATED', {
  id: 'newCartId',
  items: [{
    product: 'Awesome shoe',
    price: 40
  }]
})

cartEventStore.emit('ITEM_ADDED', {
  id: 'newCartId',
  item: {
    product: 'Another awesome shoe',
    price: 30
  }
})

console.log(cartEventStore.find('newCartId'))
console.log(cartEventStore.find('newCartId', 1))
```
