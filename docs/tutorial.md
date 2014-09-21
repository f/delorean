# Tutorial

You can easily start using **DeLorean.js**.

First of all, let's create the DOM (view) we'll need.

```html
<!doctype html>
<html>
  <head>
    <script src="//rawgit.com/f/delorean/master/dist/delorean.min.js"></script>
  </head>
  <body>
    <ul id="list"></ul>
    <button id="addItem">Add Random Item</button>

    <script src="js/app.js"></script>
  </body>
</html>

```

Now, let's create an `app.js` file.

### Step 1: Action Creation

And then let's handle the events:

```javascript
document.getElementById('addItem').onclick = function () {
  ActionCreator.addItem();
};
```

Sure, it will create an error when you click the button:

```
ReferenceError: ActionCreator is not defined
```

Then let's create an **Action Creator** called `ActionCreator`. Action Creators
are simple JavaScript objects. You can use them as **controllers**.

```javascript
var ActionCreator = {
  addItem: function () {
    // We'll going to call dispatcher methods.
    MyAppDispatcher.addItem({random: Math.random()});
  }
};
```

### Step 2: Dispatching Actions to the Stores

But now, we'll need a dispatcher. Now we'll use DeLorean's dispatcher.

```javascript
var MyAppDispatcher = DeLorean.Flux.createDispatcher({
  addItem: function (data) {
    this.dispatch('addItem', data);
  }
});
```

It's now looking like actually another action creator but dispatchers are
units that informs stores one by one. So we need to define the special function
called `getStores`.

```javascript
var MyAppDispatcher = DeLorean.Flux.createDispatcher({
  addItem: function (data) {
    this.dispatch('addItem', data);
  },

  getStores: function () {
    return {
      myStore: myStore
    }
  }
});
```

### Step 3: Stores to Manage Data

Now let's create the store. You need to define an object called `actions`. It's
simply forwarders for dispatcher. When a dispatcher connected to the store
dispatches an event, the `actions` object will forward it to the related method
with arguments.

Also you have to call `this.emit('change')` when you update your data.

```javascript
var MyAppStore = DeLorean.Flux.createStore({
  list: [],
  actions: {
    // Remember the `dispatch('addItem')`
    'addItem': 'addItemMethod'
  },
  addItemMethod: function (data) {
    this.list.push('ITEM: ' + data.random);

    // You need to say your store is changed.
    this.emit('change');
  }
});
var myStore = new MyAppStore();
```

### Step 4: Completing the Cycle: Views

Now everything seems okay, but **we didn't completed the cycle yet**.

```javascript
var list = document.getElementById('list');

// Store emits the `change` event when changed.
myStore.onChange(function () {
  list.innerHTML = ''; // Best thing for this example.

  myStore.store.list.forEach(function (item) {
    var listItem = document.createElement('li');
    listItem.innerHTML = item;
    list.appendChild(listItem);
  });
});
```

### Step 5: Using `scheme`s

You already know stores, now let's learn how to manage easier.

```javascript
var MyAppStore = DeLorean.Flux.createStore({
  scheme: {
    list: {
      default: [],
      calculate: function (value) {
        return value.concat().map(function (item) {
          return 'ITEM: ' + item;
        });
      }
    }
  },
  actions: {
    // Remember the `dispatch('addItem')`
    'addItem': 'addItemMethod'
  },
  addItemMethod: function (data) {
    // It automatically emits change event.
    this.set('list', this.list.concat(data.random));
  }
});
var myStore = new MyAppStore();
```
