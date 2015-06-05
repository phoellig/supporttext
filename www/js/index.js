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
    elem : {
        statusElement: null
    },
    changeStatus : function(statusString) {
        this.statusElement.html(statusString);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = $(document.getElementById(id));
        this.changeStatus("Loading things...");

        var listElement = $("#mainContent ul");
        var builtDom = this.buildListDOM(this.sampleMessages);
        listElement.html(builtDom);
        this.changeStatus("");
    },
    sampleMessages : [
        {
            title : "Not A Real Title",
            blurb : "Very important stuff has failed",
            time: "6:56 AM EST"
        },
        {
            title : "Test title B",
            blurb : "Fallout 4 is released. Drop everything.",
            time: "6:20 PM CST"
        },
        {
            title : "Real title. Not a test.",
            blurb : "Please ignore this test.",
            time: "5:20 AM PDT"
        }
    ],
    buildListDOM: function(messages) {
        var dom = "";
        _.each(messages, function(message) {
            dom += window.JST["www/template/listItem.html"](message);
        });
        console.log("dom:" + dom);
        return dom;
    }
};
