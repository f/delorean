React = require 'react'

################################################# Global Stores

MessageStore = Flux.createStore

  messages: [
    {text: 'hey'}
  ]

  actions:
    'message:receive': 'receiveMessage'
    'message:send': 'sendMessage'

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
    messages: MessageStore

  # sendMessage Action
  sendMessage: ({text, to})->
    console.log 'sending 1'
    @dispatch 'message:send', {text: text+'hoooy', to}

Messages2App = Flux.createApp

  # Bind stores
  getStores: ->
    messages: MessageStore

  # sendMessage Action
  sendMessage: ({text, to})->
    console.log 'sending 2'
    @dispatch 'message:send', {text: text+'heey', to}

############################################################# View

{ul, li, b} = React.DOM


MessagesView = React.createClass

  mixins: [Flux.mixin.react]

  render: ->
    ul onClick: @clicked,
      (li {}, item.text for item in @state.stores.messages.messages)

  clicked: ->
    @app.sendMessage
      text: Math.random().toString(), to: 'hehe'

Messages2View = React.createClass

  mixins: [Flux.mixin.react]

  render: ->
    ul onClick: @clicked,
      (li {}, (b {}, item.text) for item in @state.stores.messages.messages)

  clicked: ->
    @app.sendMessage
      text: Math.random().toString(), to: 'hehe'

React.renderComponent MessagesView(app: MessagesApp), document.getElementById('one')
React.renderComponent Messages2View(app: Messages2App), document.getElementById('two')
