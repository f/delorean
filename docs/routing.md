# Routing

You can use any Router tool with DeLorean. In the example I use `director` as the router.

```js
var Router = require('director').Router;
```

You may trig the action from View. So you can just do something like that:

```js
var mainView = React.renderComponent(<ApplicationView dispatcher={TodoListDispatcher} />,
  document.getElementById('main'))

var appRouter = new Router({
  '/random': function () {
    TodoActionCreator.addTodo({text: Math.random()});
    location.hash = '/';
  }
});
```
