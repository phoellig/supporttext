/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        console.log("Current JST are: " + window.JST);

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
