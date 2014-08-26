document.getElementById('addItem').onclick = function () {
  ActionCreator.addItem();
};

var ActionCreator = {
  addItem: function () {
    // We'll going to call dispatcher methods.
    MyAppDispatcher.addItem({random: Math.random()});
  }
};

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
