cordova.define("cordova/plugin/SmsInboxPlugin", function(require, exports, module) {
  var exec = require('cordova/exec');
  var SmsInboxPlugin = function() {};

  /**
   * Check if the device has a possibility to send and receive SMS
   */
  SmsInboxPlugin.prototype.isSupported = function(successCallback,failureCallback) {
    return exec(successCallback, failureCallback, 'SmsInboxPlugin', 'HasSMSPossibility', []);
  }

  /**
   * Check if the device has a possibility to send and receive SMS
   * the successCallback function receives one string as parameter
   * formatted such as: [phonenumber]>[message].
   * Example: +32472345678>Hello World
   */
  SmsInboxPlugin.prototype.startReception = function(successCallback,failureCallback) {
    return exec(successCallback, failureCallback, 'SmsInboxPlugin', 'StartReception', []);
  }

  /**
   * Stop the receiving sms.
   */
  SmsInboxPlugin.prototype.stopReception = function(successCallback,failureCallback) {
    return exec(successCallback, failureCallback, 'SmsInboxPlugin', 'StopReception', []);
  }
  
  /**
   * Get all existing SMS.
   */
  SmsInboxPlugin.prototype.getMessages = function(successCallback,failureCallback) {
    return exec(successCallback, failureCallback, 'SmsInboxPlugin', 'getMessages', []);
  }

  var smsinboxplugin = new SmsInboxPlugin();
  module.exports = smsinboxplugin;
});


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        console.log("Attempting to resolve the plugin");
        var smsInboxPlugin = cordova.require('cordova/plugin/SmsInboxPlugin');
        smsInboxPlugin.getMessages(function(result) {
        	console.log(result);
        	app.messages = result;
        }, function (result) {
            console.log(result);
        	app.errors = result;
        });
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
		
        console.log('Received Event: ' + id);
    }
};
