describe('Flux', function () {

  var initializeSpy = jasmine.createSpy('construction');
  var listenerSpy = jasmine.createSpy('change');
  var listenerSpy2 = jasmine.createSpy('change');

  var MyAppStore = DeLorean.Flux.createStore({
    list: [],
    initialize: initializeSpy,
    actions: {
      // Remember the `dispatch('addItem')`
      addItem: 'addItemMethod'
    },
    addItemMethod: function (data) {
      this.list.push('ITEM: ' + data.random);

      // You need to say your store is changed.
      this.emit('change');
    }
  });
  var myStore = new MyAppStore();

  var MyAppStore2 = DeLorean.Flux.createStore({
    list: [],
    initialize: initializeSpy,
    actions: {
      // Remember the `dispatch('addItem')`
      addItem: 'addItemMethod'
    },
    addItemMethod: function (data) {
      this.list.push('ANOTHER: ' + data.random);

      // You need to say your store is changed.
      this.emit('change');
    }
  });
  var myStore2 = new MyAppStore2();

  var MyAppDispatcher = DeLorean.Flux.createDispatcher({
    addItem: function (data) {
      this.dispatch('addItem', data);
    },

    getStores: function () {
      return {
        myStore: myStore,
        myStore2: myStore2
      };
    }
  });

  var ActionCreator = {
    addItem: function () {
      // We'll going to call dispatcher methods.
      MyAppDispatcher.addItem({random: 'hello world'});
    }
  };

  myStore.onChange(listenerSpy);
  myStore2.onChange(listenerSpy2);
  ActionCreator.addItem();

  it('store should be initialized', function () {
    expect(initializeSpy).toHaveBeenCalled();
  });

  it('should call run action creator', function () {
    expect(listenerSpy).toHaveBeenCalled();
    expect(listenerSpy2).toHaveBeenCalled();
  });

  it('should change data', function () {
    expect(myStore.store.list.length).toBe(1);
    expect(myStore2.store.list.length).toBe(1);

    ActionCreator.addItem();
    expect(myStore.store.list.length).toBe(2);
    expect(myStore2.store.list.length).toBe(2);

    expect(myStore.store.list[0]).toBe('ITEM: hello world');
    expect(myStore2.store.list[0]).toBe('ANOTHER: hello world');
  });

  it('dispatcher can listen events', function () {
    var spy = jasmine.createSpy('dispatcher listener');
    MyAppDispatcher.on('hello', spy);
    MyAppDispatcher.listener.emit('hello');

    expect(spy).toHaveBeenCalled();
  });

  it('dispatcher can listen events', function () {
    var spy = jasmine.createSpy('dispatcher listener');
    MyAppDispatcher.on('hello', spy);
    MyAppDispatcher.off('hello', spy);
    MyAppDispatcher.listener.emit('hello');

    expect(spy).not.toHaveBeenCalled();
  });

  myStoreWithScheme = new (DeLorean.Flux.createStore({
    scheme: {
      x: 'hello',
      y: 'world',
      z: function () {
        return this.x + ', ' + this.y;
      },
      t: {
        default: 'def',
        calculate: function (value) {
          return value.toUpperCase() + ' ' + this.z;
        }
      }
    }
  }));

  it('should be work with schemes', function () {
    expect(myStoreWithScheme.store.z).toBe('hello, world');
    myStoreWithScheme.set('y', 'moon');
    expect(myStoreWithScheme.store.z).toBe('hello, moon');
    myStoreWithScheme.set('x', 'salut');
    expect(myStoreWithScheme.store.z).toBe('salut, moon');
    expect(myStoreWithScheme.store.t).toBe('DEF salut, moon');
    myStoreWithScheme.set('t', 'hey');
    expect(myStoreWithScheme.store.t).toBe('HEY salut, moon');
  });

});
