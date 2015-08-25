# Future of DeLorean.js

## ES6 Syntax

### Importing
```js
import {Store, Dispatcher} from "delorean";
```

### Stores
```js
/*
 * Stores are simple data buckets which manages data.
 */
@Store({
  actions: {
    'incoming-data': 'setData'
  }
})
class TodoStore {

  constructor() {
    this.data = null;
  }

  setData(data) {
    this.data = data;
    this.emit('change');
  }
}
```

### Dispatcher
```js
/*
 * Dispatchers are simple action dispatchers for stores.
 * Stores handle the related action.
 */
@Dispatcher({
  stores: {
    'increment': store
  }
})
class TodoDispatcher {
  setData(data) {
    this.dispatch('incoming-data', data);
  }
}
```

### Action Creators
```js
/*
 * Action Creators are simple controllers. They are simple functions.
 *  They talk to dispatchers. They are not required.
 */
var Actions = {
  setData(data) {
    Dispatcher.setData(data);
  }
  
  getDataFromServer() {
    fetch('/somewhere', (data)=> {
      Dispatcher.setData(data);
    });
  }
}
```

### Misc ...
```js
// The data cycle.
store.onChange(() => {
  // End of data cycle.
  document.getElementById('result').innerText = store.store.data;
});

document.getElementById('dataChanger').onclick = () => {
  // Start data cycle:
  Actions.setData(Math.random());
};
```
