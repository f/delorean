if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        FNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof FNOP && oThis ? this : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    FNOP.prototype = this.prototype;
    fBound.prototype = new FNOP();

    return fBound;
  };
}

describe('Flux', function () {

  var initializeSpy = jasmine.createSpy('construction');
  var listenerSpy = jasmine.createSpy('change');

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

  var MyAppDispatcher = DeLorean.Flux.createDispatcher({
    addItem: function (data) {
      this.dispatch('addItem', data);
    },

    getStores: function () {
      return {
        myStore: myStore
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
  ActionCreator.addItem();

  it('store should be initialized', function () {
    expect(initializeSpy).toHaveBeenCalled();
  });

  it('should call run action creator', function () {
    expect(listenerSpy).toHaveBeenCalled();
  });

  it('should change data', function () {
    expect(myStore.store.list.length).toBe(1);

    ActionCreator.addItem();
    expect(myStore.store.list.length).toBe(2);

    expect(myStore.store.list[0]).toBe('ITEM: hello world');
  });

});
