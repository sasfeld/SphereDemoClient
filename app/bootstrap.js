/**
 * Sphere Demo Client
 *
 * Main class to run the application on a command line.
 *
 * Author: Sascha Feldmann (sascha.feldmann@gmx.de)
 */

var http = require('../client/http');

if (undefined === process.env.CONFIG_FILE) {
    var config = require('../config/config.json');
} else {
    var config = require(process.env.CONFIG_FILE);
}

var querystring = require('querystring');
var productCollection = require('../product/pagination/collection');

var httpClient = http.client;

App = function () {
    this.LOG_LEVEL_STDOUT = 'stdout';
    this.LOG_LEVEL_STDERR = this.LOG_LEVEL_STDOUT;
    this.ROOT_PATH = __dirname + '/../';
    this.EVENT_ON_SPHERE_AUTHENTICATION = 'on-sphere-authentication';

    this.sphere = {
        apiUrl : config.sphere.api_url,
        projectKey: config.sphere.project_key
    };

    this.observers = [];

    /**
     * Adapter to log message
     * @param message
     */
    this.logConsoleMessage = function(message) {
        console.log(message);
    };

    /**
     * Register models and call their bootstrap methods.
     */
    this.registerModels = function()
    {
        productCollection.collection.doBootstrap();
    };

    /**
     * Trigger an event and notify observers that have an event method.
     * @param eventName
     */
    this.triggerEvent = function(eventName)
    {
        for (var i=0; i < this.observers.length; i++) {
            var observer = this.observers[i];
            if ('function' === typeof observer.recieveEvent) {
                observer.recieveEvent(eventName);
            }
        }
    }

    /**
     * Connect using the sphere authentication endpoint.
     *
     * Save the access token so that it can be used on further requests.
     */
    this.connectToSphere = function() {
        global.app.logConsoleMessage('Connecting to sphere...');

        // build URL to authentication endpoint using config
        var uri = 'https://' + config.sphere.client_id + ':' + config.sphere.client_secret + '@' + 'auth.sphere.io/oauth/token';

        // add form-url-encoded parameters including the project key
        var params = {
            'grant_type' : 'client_credentials',
            'scope' : 'manage_project:' + config.sphere.project_key
        };

        // set request headers
        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': params.length
        };
        httpClient.setHeadersOnce(headers);
        // set adapter to https://github.com/request/request request module
        httpClient.setAdapter(httpClient.ADAPTER_REQUEST);

        // delegate to http client
        httpClient.doPost(uri, querystring.stringify(params), function(error, response, body) {
            global.app.logConsoleMessage('response from sphere io');
            var responseStr = JSON.parse(body);

           if (response.statusCode == 200) {
              global.app.logConsoleMessage('Authorized successfully!');

              // set access token in sphere record
              global.app.sphere.accessToken = responseStr.access_token;

              // notify observers
              global.app.triggerEvent(global.app.EVENT_ON_SPHERE_AUTHENTICATION);
           }
        });
    }
}

/**
 * Add an observer object that is notified on certain events.
 * @param observer
 */
App.prototype.addObserver = function(observer)
{
    this.observers.push(observer);
};

/**
 * Log a message of a certain level.
 *
 * @param message
 * @param level
 */
App.prototype.log = function(message, level)
{
    if ('string' != typeof message) {
        throw "Type of 'message' must be string";
    }

    var logLevel = level || this.LOG_LEVEL_STDOUT;

    switch (logLevel) {
        case this.LOG_LEVEL_STDOUT:
        default:
            this.logConsoleMessage(message);
            break;

    }
};

/**
 * Do the application bootstrap here.
 */
App.prototype.doBootstrap = function()
{
    this.registerModels();
    this.connectToSphere();
};

var appSingleton = new App();
global.app = appSingleton;

exports.app = appSingleton;