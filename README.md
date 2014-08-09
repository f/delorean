# DeLorean

DeLorean is a tiny Flux pattern implementation.

## Spec

### JavaScript

```javascript
/** @jsx React.DOM */

var Flux = require('delorean').Flux;

///////////////////////////////////////////////////// Global Stores

var MessageStore = Flux.createStore({

  messages: [],

  bindActions: function () {
    this.onAction('message:receive', this.receiveMessage);
    this.onAction('message:send', this.sendMessage);
  },

  receiveMessage: function (message) {
    this.messages.push({text: message.text, from: message.from, to: 'me'});
    this.emit('change');
  },

  sendMessage: function (message) {
    this.messages.push({text: message.text, to: message.to, from: 'me'});
    this.emit('change');
  },

  getState: function () {
    return {
      messages: this.messages
    };
  }
});

///////////////////////////////////////////// Create app with Actions

var MessagesApp = Flux.createApp({

  getStores: function () {
    return {
      messages: new MessageStore()
    };
  },

  sendMessage: function (message) {
    this.dispatch('message:send', {text: message.text, to: message.to});
  },

  recieveMessage: function (message) {
    this.dispatch('message:receive', {text: message.text, from: message.from});
  }
});

//////////////////////////////////////////////////////////////// View

MessagesView = React.createClass({

  render: function () {
    <div onClick={this.clicked}>Create New</div>
  },

  clicked: function () {
    this.app.actions.sendMessage({
      text: Math.random().toString(), from: 'hehe'
    });
  }
});

React.renderComponent(<MessagesView app={MessagesApp} />, document.body);
```

### CoffeeScript

```coffeescript
###* @jsx React.DOM ###

Flux = require 'reflux'

################################################# Global Stores

MessageStore = Flux.createStore

  messages: []

  bindActions: ->
    @onAction 'message:receive', @receiveMessage
    @onAction 'message:send', @sendMessage

  receiveMessage: ({text, from})->
    @messages.push {text, from, to: 'me'}
    @emit 'change'

  sendMessage: ({text, to})->
    @messages.push {text, to, from: 'me'}
    @emit 'change'

  getState: ->
    messages: @messages

########################################## Create app with Actions

MessagesApp = Flux.createApp

  # Bind stores
  getStores: ->
    messages: new MessageStore()

  # sendMessage Action
  sendMessage: ({text, to})->
    @dispatch 'message:send', {text, to}

  recieveMessage: ({text, from})->
    @dispatch 'message:receive', {text, from}

############################################################# View

MessagesView = React.createClass

  render: ->
    `<div onClick={this.clicked}>Create New</div>`

  clicked: ->
    @app.actions.sendMessage
      text: Math.random().toString(), from: 'hehe'

React.renderComponent `<MessagesView app={MessagesApp} />`, document.body

```

## Name

The **flux capacitor** was the core component of Doctor Emmett Brown's time traveling **DeLorean time machine**

## License

[MIT License](http://f.mit-license.org)
