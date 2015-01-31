describe('Flux', function () {

  var initializeSpy = jasmine.createSpy('construction');
  var listenerSpy = jasmine.createSpy('change');
  var listenerSpy2 = jasmine.createSpy('change');
  var calculateSpy = jasmine.createSpy('calculate');

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

  MyStoreWithScheme = DeLorean.Flux.createStore({
    scheme: {
      greeting: 'hello',
      place: {
        default: 'world'
      },
      otherPlace: 'outerspace',
      greetPlace: {
        deps: ['greeting', 'place'],
        default: 'hey',
        calculate: function (value) {
          return value.toUpperCase() + ' ' + this.greeting + ', ' + this.place;
        }
      },
      parsedValue: function (value) {
        return {
          a: value.b,
          b: value.a
        };
      },
      randomProp: 'random',
      anotherCalculated: {
        deps: ['randomProp'],
        default: null,
        calculate: calculateSpy
      },
      dependentOnCalculated: {
        deps: ['greetPlace'],
        calculate: function () {
          return this.greetPlace;
        }
      },
      objectDefault: {
        default: {
          name: 'Test default objects get cloned'
        }
      }
    }
  });
  var myStoreWithScheme = new MyStoreWithScheme();
  describe('scheme', function () {
    it('should cause default and calculated scheme properties to be created on instantiation', function () {
      expect(myStoreWithScheme.store.greeting).toBe('hello');
      expect(myStoreWithScheme.store.place).toBe('world');
      expect(myStoreWithScheme.store.greetPlace).toBe('HEY hello, world');
    });

    it('should clone defaults that are objects, rather than applying them direclty', function () {
      expect(myStoreWithScheme.store.scheme.objectDefault.default).not.toBe(myStoreWithScheme.store.objectDefault);
    });

    it('should re-calculate scheme properties with #calculate and deps defined', function () {
      myStoreWithScheme.set('greeting', 'goodbye');
      expect(myStoreWithScheme.store.greetPlace).toBe('HEY goodbye, world');
    });

    it('should set scheme set scheme properties that are functions to the return value', function () {
      var input = {
        a: 'a',
        b: 'b'
      };
      myStoreWithScheme.set('parsedValue', input);
      expect(myStoreWithScheme.store.parsedValue.a).toBe(input.b);
    });

    it('should be able to accept an object when setting scheme', function () {
      myStoreWithScheme.set({
        greeting: 'aloha',
        place: 'Hawaii'
      });
      expect(myStoreWithScheme.store.greeting).toBe('aloha');
      expect(myStoreWithScheme.store.place).toBe('Hawaii');
      expect(myStoreWithScheme.store.greetPlace).toBe('HEY aloha, Hawaii');
    });

    it('should call calculate only in instantiation and when a dependency is set', function () {
      expect(calculateSpy.calls.length).toBe(1); // should have been called once on intantiation
      myStoreWithScheme.set('otherPlace', 'hey');
      expect(calculateSpy.calls.length).toBe(1); // should not have been called again, because otherPlace is not a dep
    });

    it('should allow setting calculated properties directly', function () {
      myStoreWithScheme.set('greetPlace', 'Ahoy');
      expect(myStoreWithScheme.store.greetPlace).toBe('AHOY aloha, Hawaii');
    });

    it('should allow a calculated property to be dependent on another calculated property', function () {
      myStoreWithScheme.set({
        greeting: 'hola',
        place: 'Spain'
      });
      expect(myStoreWithScheme.store.dependentOnCalculated).toBe('AHOY hola, Spain');
    });
  });

  describe('multiple stores', function () {
    var MyStore = DeLorean.Flux.createStore({
      hello: null
    });

    it('should not share state', function () {
      var store1 = MyStore().store;
      store1.hello = 'world';
      expect(store1.hello).toEqual('world');

      var store2 = MyStore().store;
      expect(store2.hello).toEqual(null);
    });
  });

});
