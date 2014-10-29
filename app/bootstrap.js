/**
 * Sphere Demo Client
 *
 * Main class to run the application on a command line.
 *
 * Author: Sascha Feldmann (sascha.feldmann@gmx.de)
 */

const LOG_LEVEL_STDOUT = 'stdout';

var http = require('../client/http');
var config = require('../config/config.json');

var httpClient = http.client;

App = function () {
    this.ROOT_PATH = __dirname + '/../';

    /**
    /**
     * Adapter to log message
     * @param message
     */
    this.logConsoleMessage = function(message) {
        console.log(message);
    }

    this.connectToSphere = function() {
        global.app.logConsoleMessage('Connecting to sphere...');

        var uri = 'https://' + config.sphere.client_id + ':' + config.sphere.client_secret + '@' + 'auth.sphere.io/oauth/token';

        var params = {
            'grant_type' : 'client_credentials',
            'scope' : 'manage_project:' + config.sphere.project_key
        };


        httpClient.doPost(uri, params, function(response) {
            global.app.logConsoleMessage('response from sphere io');
            var responseStr = '';

            response.on('end', function () {
                if (response.statusCode == 200) {
                    global.app.logConsoleMessage('Authorized successfully!');
                }
            });

        });
    }
}

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

    var level = level || LOG_LEVEL_STDOUT;

    switch (level) {
        case LOG_LEVEL_STDOUT:
        default:
            this.logConsoleMessage(message);
            break;

    }
}
/**
 * Do the application bootstrap here.
 */
App.prototype.doBootstrap = function()
{
    this.connectToSphere();
}

var appSingleton = new App();
global.app = appSingleton;
exports.app = appSingleton;