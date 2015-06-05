cordova.define("cordova/plugin/SmsInboxPlugin", function(require, exports, module) {
  var exec = require('cordova/exec');
  var SmsInboxPlugin = function() {};

    /**
     * Check if the device has a possibility to send and receive SMS
     */
    SmsInboxPlugin.prototype.isSupported = function (successCallback, failureCallback) {
        return exec(successCallback, failureCallback, 'SmsInboxPlugin', 'HasSMSPossibility', []);
    };

    /**
     * Check if the device has a possibility to send and receive SMS
     * the successCallback function receives one string as parameter
     * formatted such as: [phonenumber]>[message].
     * Example: +32472345678>Hello World
     */
    SmsInboxPlugin.prototype.startReception = function (successCallback, failureCallback) {
        return exec(successCallback, failureCallback, 'SmsInboxPlugin', 'StartReception', []);
    };

    /**
     * Stop the receiving sms.
     */
    SmsInboxPlugin.prototype.stopReception = function (successCallback, failureCallback) {
        return exec(successCallback, failureCallback, 'SmsInboxPlugin', 'StopReception', []);
    };

    /**
     * Get all existing SMS.
     */
    SmsInboxPlugin.prototype.getMessages = function (successCallback, failureCallback) {
        return exec(successCallback, failureCallback, 'SmsInboxPlugin', 'getMessages', []);
    };

    var smsinboxplugin = new SmsInboxPlugin();
    module.exports = smsinboxplugin;
});

var app = {
    scope: {
        messages: [
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
        errors: ""
    },
    // Application Constructor
    initialize: function() {
        console.log("Binding events");
        this.bindEvents();
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
        statusElement: null,
        listElement: null
    },
    changeStatus : function(statusString) {
        this.elem.statusElement.html(statusString);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = $(document.getElementById(id));
        this.elem.statusElement = $("#status");
        this.elem.listElement = $("#mainContent ul");

        console.log("Attempting to resolve the plugin");
        var smsInboxPlugin = cordova.require('cordova/plugin/SmsInboxPlugin');
        console.log("Getting messages");
        smsInboxPlugin.getMessages(function(result) {
            console.log(result);
            app.scope.messages = result;
            app.rebuildListDOM();
        }, function (result) {
            console.log(result);
            app.scope.errors = result;
            app.rebuildListDOM();
        });

        this.rebuildListDOM();
    },
    rebuildListDOM : function() {
        this.changeStatus("Loading things...");
        if (this.scope.errors) {
            this.changeStatus(this.scope.errors);
        } else {
            this.changeStatus("");
        }
        var builtDom = this.buildListDOM(this.scope.messages);
        this.elem.listElement.html(builtDom);
    },
    buildListDOM: function(messages) {
        console.log("Messages" + JSON.stringify(messages));
        var dom = "";
        _.each(messages, function(message) {
            dom += window.JST["www/template/listItem.html"](message);
        });
        console.log("dom:" + dom);
        return dom;
    }
};
