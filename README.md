![DeLorean Logo](https://raw.githubusercontent.com/f/delorean/master/docs/asset/delorean-logo.png)

# DeLorean.js

[![Build Status](https://travis-ci.org/f/delorean.svg?branch=master)](https://travis-ci.org/f/delorean)
 [![NPM version](https://badge.fury.io/js/delorean.js.svg)](http://badge.fury.io/js/delorean.js)
 ![Coverage](http://progressed.io/bar/86?title=coverage)

DeLorean is a tiny Flux pattern implementation.

  - **Unidirectional data flow**, it makes your app logic **simpler than MVC**,
  - Automatically listens data changes and keeps your data updated,
  - Makes data more **consistent** in your whole application,
  - It's framework agnostic, completely. There's **no view framework dependency**.
  - Too small, just **4K** gzipped.
  - Built-in **React.js** integration, easy to use with **Flight.js** and **Ractive.js** and probably all others.

### Tutorial

You can learn Flux and DeLorean.js in minutes. [Read the tutorial](./docs/tutorial.md)

## Using with Frameworks

  - [Try **React.js** example on JSFiddle](http://jsfiddle.net/fkadev/a2ms7rcc/)
  - [Try **Flight.js** example on JSFiddle](http://jsfiddle.net/fkadev/1cw9Leau/)
  - [Try **Ractive.js** example on JSFiddle](http://jsfiddle.net/PhilJ/2r1k2k90/2/)

---

## Install

You can install **DeLorean** with Bower:

```bash
bower install delorean
```

You can also install by NPM to use with **Browserify** *(recommended)*

```bash
npm install delorean.js
```

## Usage

Hipster way:

```js
var Flux = require('delorean.js').Flux;
// ...
```

Old-skool way:

```html
<script src="//rawgit.com/f/delorean/master/dist/delorean.min.js"></script>
<script>
var Flux = DeLorean.Flux;
// ...
</script>
```

## Overview

```javascript
/*
 * Stores are simple data buckets which manages data.
 */
var Store = Flux.createStore({
  data: null,
  setData: function (data) {
    this.data = data;
    this.emit('change');
  },
  actions: {
    'incoming-data': 'setData'
  }
});
var store = new Store();

/*
 * Dispatcher are simple action dispatchers for stores.
 * Stores handle the related action.
 */
var Dispatcher = Flux.createDispatcher({
  setData: function (data) {
    this.dispatch('incoming-data', data);
  },
  getStores: function () {
    return {increment: store};
  }
});

/*
 * Action Creators are simple controllers. They are simple functions.
 *  They talk to dispatchers. They are not required.
 */
var Actions = {
  setData: function (data) {
    Dispatcher.setData(data);
  }
};

// The data cycle.
store.onChange(function () {
  // End of data cycle.
  document.getElementById('result').innerText = store.store.data;
});

document.getElementById('dataChanger').onclick = function () {
  // Start data cycle:
  Actions.setData(Math.random());
};
```
[Run this example on JSFiddle](http://jsfiddle.net/fkadev/40cx3146/)

## Docs

You can read the [tutorial](./docs/tutorial.md) to learn how to start using
**DeLorean.js** with your favorite framework.

### Basic Concepts

  - [**Store**: A postbox](./docs/store.md)
  - [**Dispatcher**: The postman, drops mails to the postboxes](./docs/dispatcher.md)
  - [**View**: Box owner, checks box for the mail](./docs/views.md)
  - [**Action Creator**: The post office, manages postmans](./docs/actions.md)

Or you can visit [documents](./docs) page.

## Running the TodoMVC example

There is a simple TodoMVC example working with DeLorean.js

```bash
cd examples/todomvc
grunt
open index.html
```

## Name

The **flux capacitor** was the core component of Doctor Emmett Brown's time traveling **DeLorean time machine**

## License

[MIT License](http://f.mit-license.org)
