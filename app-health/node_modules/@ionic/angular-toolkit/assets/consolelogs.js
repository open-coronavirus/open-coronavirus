// Script injected by @ionic/angular-toolkit to send console logs back
// to a websocket server so they can be printed to the terminal
window.Ionic = window.Ionic || {}; window.Ionic.ConsoleLogServer = {
  start: function(config) {
    var self = this;

    this.socket = new WebSocket('ws://' + window.location.hostname + ':' + String(config.wsPort));
    this.msgQueue = [];

    this.socket.onopen = function() {
      self.socketReady = true;

      self.socket.onclose = function() {
        self.socketReady = false;
        console.warn('Console log server closed');
      };
    };

    this.patchConsole();
  },

  queueMessageSend: function(msg) {
    this.msgQueue.push(msg);
    this.drainMessageQueue();
  },

  drainMessageQueue: function() {
    var msg;
    while (msg = this.msgQueue.shift()) {
      if (this.socketReady) {
        try {
          this.socket.send(JSON.stringify(msg));
        } catch(e) {
          if (!(e instanceof TypeError)) {
            console.error('ws error: ' + e);
          }
        }
      }
    }
  },

  patchConsole: function() {
    var self = this;

    function _patchConsole(consoleType) {
      console[consoleType] = (function() {
        var orgConsole = console[consoleType];
        return function() {
          orgConsole.apply(console, arguments);
          var msg = {
            category: 'console',
            type: consoleType,
            data: []
          };
          for (var i = 0; i < arguments.length; i++) {
            msg.data.push(arguments[i]);
          }
          if (msg.data.length) {
            self.queueMessageSend(msg);
          }
        };
      })();
    }

    // https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-console/#supported-methods
    var consoleFns = ['log', 'error', 'exception', 'warn', 'info', 'debug', 'assert', 'dir', 'dirxml', 'time', 'timeEnd', 'table'];
    for (var i in consoleFns) {
      _patchConsole(consoleFns[i]);
    }
  },
};

Ionic.ConsoleLogServer.start(Ionic.ConsoleLogServerConfig || {});
