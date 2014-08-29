/** @jsx React.DOM */

var firebase = new Firebase("https://deloreanjs.firebaseio.com/");

var Flux = DeLorean.Flux;

var Messages = Flux.createStore({
  actions: {
    'NEW_MESSAGE': 'newMessage'
  },

  messages: [],
  newMessage: function (message) {
    this.messages.push(message);
    this.emit('change');
  },

  getState: function () {
    return {
      messages: this.messages
    };
  }
});

var messages = new Messages();

var MessagesDispatcher = Flux.createDispatcher({
  newMessage: function (message) {
    this.dispatch('NEW_MESSAGE', message);
  },
  getStores: function () {
    return {
      messageStore: messages
    };
  }
});

var MessageActions = {
  newMessage: function (sender, text) {
    MessagesDispatcher.newMessage({sender: sender, text: text});
  },
  sendMessage: function (sender, text) {
    firebase.push({sender: sender, text: text});
  }
}

firebase.on('child_added', function (snapshot) {
  var message = snapshot.val();
  MessageActions.newMessage(message.sender, message.text);
});

var MessagesView = React.createClass({displayName: 'MessagesView',
  mixins: [Flux.mixins.storeListener],

  render: function () {
    var messages = this.stores.messageStore.store.messages.map(function (message) {
      return React.DOM.div(null, React.DOM.strong(null, message.sender, ": "), React.DOM.span(null, message.text));
    });
    return React.DOM.div(null, messages);
  }
});

var MessagesSender = React.createClass({displayName: 'MessagesSender',
  getInitialState: function () {
    return {message: ''};
  },
  handleChange: function () {
    var value = this.refs.message.getDOMNode().value;
    this.setState({message: value});
  },
  handleKeyUp: function (e) {
    if (e.keyCode == 13) {
      var message = this.state.message;
      MessageActions.sendMessage('someone', message);
      this.setState({message: ''});
    }
  },
  render: function () {
    return React.DOM.input({type: "text", 
                  ref: "message", 
                  onChange: this.handleChange, 
                  onKeyUp: this.handleKeyUp, 
                  value: this.state.message, 
                  className: "form-control", 
                  id: "message", placeholder: "write your message here"});
  }
});

React.renderComponent(MessagesView({dispatcher: MessagesDispatcher}), document.getElementById('messages'));
React.renderComponent(MessagesSender({dispatcher: MessagesDispatcher}), document.getElementById('sender'));
