Prior to `1.0`, icrementing the second decimal place indicates a potential breaking change.

**0.8.x to 0.9.x**

- Stores are now singletons. The dispatcher's `getStores` method must go from...
```javascript
getStores: function ()
  return{
    myStore: MyStore()
  }
}
```
to...
```javascript
getStores: function ()
  return{
    myStore: MyStore
  }
}
```
where `MyStore` is the output of `Flux.createStore`

- Scheme values are now set on a `store.state` object rather than directly on the store itself. If you are using `scheme`, and accessing and scheme properties directly within a store (rather than just through `this.set`), you will need to update your code to access the property from the `state` object...
```javascript
this.mySchemeProp.push(newValue);
```
needs to become...
```javascript
this.state.mySchemeProp.push(newValue);
```