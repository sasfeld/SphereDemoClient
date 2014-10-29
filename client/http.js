/**
 * Sphere Demo Client
 *
 * Main class to run the application on a command line.
 *
 * Author: Sascha Feldmann (sascha.feldmann@gmx.de)
 */
var http = require('http');
var urlUtil = require('url');

/*
 * Constants
 */
const HTTP_METHOD_POST = 'POST';
const HTTP_METHOD_GET = 'GET';
const HTTP_METHOD_PUT = 'PUT';
const HTTP_METHOD_DELETE = 'DELETE';


/**
 * Constructor function for the client prototype.
 * @constructor
 */
Client = function() {

    /**
     * Do an HTTP request.
     *
     * @param url string
     * @param method string
     * @param body string|undefined should be some string content (example: serialized JSON) on POST and PUT requests
     * @param callbackFunction callbackFunction that will be called on response
     */
    this.doRequest = function(url, method, body, callbackFunction)
    {
        if ('string' !== typeof url) {
            throw "Paramater 'url' must be of type string.";
        }
        if ('string' !== typeof method) {
            throw "Paramater 'method' must be of type string.";
        }

        body = body || "";

        var parsedUrl = urlUtil.parse(url);
        var port = parsedUrl.port || 80;

        global.app.log('hostname: ' + parsedUrl.hostname);
        global.app.log('port: ' + port);
        global.app.log('path: ' + parsedUrl.path);
        global.app.log('method: ' + method)
        global.app.log('auth: ' + parsedUrl.auth)

        var httpOptions = {
            host: parsedUrl.hostname,
            port: port,
            path: parsedUrl.path,
            auth: parsedUrl.auth || '',
            method: method
        };

        var request = http.request(httpOptions, callbackFunction);
        try {
            if ('' !== body) {
                request.write(body);
            }
            request.end();
        } catch ( e ) {
        }
    }
}

/**
 * Do a POST request.
 * @param url string
 * @param body string
 * @param callbackFunction the callback function that is called on response changes.
 */
Client.prototype.doPost = function(url, body, callbackFunction)
{
    this.doRequest(url, HTTP_METHOD_POST, body, callbackFunction);
}

/**
 * Do a GET request.
 * @param url
 * @param callbackFunction the callback function that is called on response changes.
 */
Client.prototype.doGet = function(url, callbackFunction)
{
    this.doRequest(url, HTTP_METHOD_GET, undefined, callbackFunction);
}

/**
 * Do a PUT request.
 *
 * @param url
 * @param body
 * @param callbackFunction the callback function that is called on response changes.
 */
Client.prototype.doPut = function(url, body, callbackFunction)
{
    this.doRequest(url, HTTP_METHOD_PUT, body, callbackFunction);
}

/*
 * Module variables
 */
var clientSingleton = new Client();
exports.client = clientSingleton;
