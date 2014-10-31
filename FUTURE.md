# Future of DeLorean.js

## ES6 Syntax

### Importing
```js
import {Store, Dispatcher} from "delorean";
```

### Stores
```js
class TodoStore extends Store {

  constructor() {
    this.data = null;
  }

  get actions() {
    return {
      'incoming-data': 'setData'
    }
  }

  setData(data) {
    this.data = data;
    this.emit('change');
  }
}
```

### Dispatcher
```js
class TodoDispatcher  extends Dispatcher {

  get stores() {
    return {
      'increment': store
    }
  }

  set data(data) {
    this.dispatch('incoming-data', data);
  }
}
```
