# DeLorean.js

[![Build Status](https://travis-ci.org/deloreanjs/delorean.svg?branch=master)](https://travis-ci.org/deloreanjs/delorean)
 [![NPM version](https://badge.fury.io/js/delorean.js.svg)](http://badge.fury.io/js/delorean.js)
 ![Coverage](http://progressed.io/bar/84?title=coverage)

DeLorean is a tiny Flux pattern implementation.

  - **Unidirectional data flow**, it makes your app logic **simpler than MVC**,
  - Automatically listens to data changes and keeps your data updated,
  - Makes data more **consistent** across your whole application,
  - It's framework agnostic, completely. There's **no view framework dependency**.
  - Very small, just **5K** gzipped.
  - Built-in **React.js** integration, easy to use with **Flight.js** and **Ractive.js** and probably all others.
  - Improve your UI/data consistency using **rollbacks**.

### Tutorial

You can learn Flux and DeLorean.js in minutes. [Read the tutorial](./docs/tutorial.md)

## Using with Frameworks

  - [Try **React.js** example on JSFiddle](http://jsfiddle.net/smadad/m2r0xo70/3/)
  - [Try **Flight.js** example on JSFiddle](http://jsfiddle.net/smadad/hz9nahga/1/)
  
---

## Install

You can install **DeLorean** with Bower:

```bash
bower install delorean
```

You can also install by NPM to use with **Browserify** *(recommended)*

```bash
npm install delorean
```

## Usage

Hipster way:

```js
var Flux = require('delorean').Flux;
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
var Flux = DeLorean.Flux;
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
var store = Store;

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
  document.getElementById('result').innerText = store.data;
});

document.getElementById('dataChanger').onclick = function () {
  // Start data cycle:
  Actions.setData(Math.random());
};
```
[Run this example on JSFiddle](http://jsfiddle.net/smadad/tL4mctjd/1/)

## Docs

You can read the [tutorial](./docs/tutorial.md) to get started
**DeLorean.js** with your favorite framework.

### Basic Concepts

  - [**Store**: A postbox](./docs/stores.md)
  - [**Dispatcher**: The postman, drops mail in the postboxes](./docs/dispatchers.md)
  - [**View (or Component)**: Box owner, checks the box for mail](./docs/views.md)
  - [**Action Creator**: The post office, manages postmen](./docs/actions.md)

Or you can visit [documents](./docs) page.

## Running the TodoMVC example

There is a simple TodoMVC example working with DeLorean.js

```bash
cd examples/todomvc
grunt
open index.html
```

## Authors

  - Fatih Kadir Akin [@f](https://github.com/f)
  - Burak Can [@burakcan](https://github.com/burakcan)
  - Darcy Adams [@darcyadams](https://github.com/darcyadams)

## Contributors

  - Tom Moor [@tommoor](https://github.com/tommoor)
  - Tim Branyen [@tbranyen](https://github.com/tbranyen)
  - Quang Van [@quangv](https://github.com/quangv)
  - James H. Edwards [@incrediblesound](https://github.com/incrediblesound)
  - Fehmi Can Sağlam [@fehmicansaglam](https://github.com/fehmicansaglam)
  - Serge van den Oever [@svdoever](https://github.com/svdoever)
  - Markus Ast [@rkusa](https://github.com/rkusa)

## Contribution

```bash
git clone git@github.com:deloreanjs/delorean.git
cd delorean
git checkout -b your-feature-branch
```

After you make some changes and add your test cases to the `test/spec/*Spec.js`
files. please run:

```bash
grunt
grunt test
```

When it's all OK, [open a pull request](https://github.com/deloreanjs/delorean/compare/).

## License

[MIT License](http://f.mit-license.org)

## Name

The **flux capacitor** was the core component of Doctor Emmett Brown's **DeLorean time machine**

## Links about DeLorean.js

 - [http://dailyjs.com/2014/08/19/delorean-cash/](http://dailyjs.com/2014/08/19/delorean-cash/)
 - [https://reactjsnews.com/the-state-of-flux/](https://reactjsnews.com/the-state-of-flux/)
 - [http://facebook.github.io/react/blog/2014/10/17/community-roundup-23.html](http://facebook.github.io/react/blog/2014/10/17/community-roundup-23.html)
 - [https://scotch.io/tutorials/getting-to-know-flux-the-react-js-architecture](https://scotch.io/tutorials/getting-to-know-flux-the-react-js-architecture)
 - [http://thewebplatform.libsyn.com/flux-application-architecture-react](http://thewebplatform.libsyn.com/flux-application-architecture-react)
