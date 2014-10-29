/**
 * Sphere Demo Client
 *
 * Main class to run the application on a command line.
 *
 * Author: Sascha Feldmann (sascha.feldmann@gmx.de)
 */

const LOG_LEVEL_STDOUT = 'stdout';

App = function () {
    this.ROOT_PATH = __dirname + '/../';

    /**
     * Adapter to log message
     * @param message
     */
    this.logConsoleMessage = function(message) {
        console.log();
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

}

var appSingleton = new App();
exports.app = appSingleton;