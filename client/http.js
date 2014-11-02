/**
 * Sphere Demo Client
 *
 * Main class to run the application on a command line.
 *
 * Author: Sascha Feldmann (sascha.feldmann@gmx.de)
 */
var http = require('http');
var https = require('https');
var urlUtil = require('url');
var request = require('request');

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
    this.ADAPTER_HTTP = 'http';
    this.ADAPTER_HTTPS = 'https';
    this.ADAPTER_REQUEST = 'request';

    this.headers = {};
    this.adapter = http;

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
            throw "Parameter 'url' must be of type string.";
        }
        if ('string' !== typeof method) {
            throw "Parameter 'method' must be of type string.";
        }

        // apply the correct adapter
        if (http == this.adapter || https == this.adapter) {
            this.useHttpOrHttpsAdapter(url, method, body, callbackFunction);
        }
        else if (request == this.adapter) {
            this.useRequestAdapter(url, method, body, callbackFunction);
        }
    }

    this.useHttpOrHttpsAdapter = function(url, method, body, callbackFunction)
    {
        body = body || "";

        var parsedUrl = urlUtil.parse(url);
        var port = parsedUrl.port || 80;

        global.app.log('hostname: ' + parsedUrl.hostname);
        global.app.log('port: ' + port);
        global.app.log('path: ' + parsedUrl.path);
        global.app.log('method: ' + method);
        global.app.log('auth: ' + parsedUrl.auth);
        global.app.log('body: ' + body);
        global.app.log('adapter: ' + (this.adapter == http ? 'http' : 'https'));

        var httpOptions = {
            host: parsedUrl.hostname,
            port: port,
            path: parsedUrl.path,
            auth: parsedUrl.auth || '',
            method: method,
            headers: this.headers
        };

        try {
            var request = this.adapter.request(httpOptions, callbackFunction);
            if ('' !== body) {
                request.write(body);
            }
            request.end();
        } catch ( e ) {
            global.app.log('Error at HTTP request: ' + e, global.app.LOG_LEVEL_STDERR);
        }

        request.on('error', function(e) {
            global.app.log('Error at HTTP request: ' + e.message);
        });
    }

    this.useRequestAdapter = function(url, method, body, callbackFunction)
    {
        var requestOptions = {
            uri: url,
            method: method,
            body: body,
            headers: this.headers,
            timeout: 20000
        };

        this.adapter(requestOptions, callbackFunction);
    }

    /**
     * Reset after request
     */
    this.reset = function()
    {
        this.headers = {};
        this.adapter = http;
    }
}

/**
 * Set the headers (simple javascript object literal).
 *
 * @param headers an literal object
 * @throws if wrong argument type is given
 */
Client.prototype.setHeadersOnce = function (headers)
{
   if ( 'object' !== typeof headers) {
       throw "Type of headers must be object";
   }

   this.headers = headers;
}

/**
 * Force the HTTPS adapter.
 */
Client.prototype.forceHttps = function ()
{
    this.adapter = https;
}

/**
 * Set the adapter that should be used for the next request.
 *
 * The default adapter is 'http'.
 *
 * @param adapter
 */
Client.prototype.setAdapter = function (adapter)
{
    switch (adapter) {
        case this.ADAPTER_HTTP:
            this.adapter = http;
            break;
        case this.ADAPTER_HTTPS:
            this.adapter = https;
            break;
        case this.ADAPTER_REQUEST:
            this.adapter = request;
            break;
        default:
            throw "Unsupported adapter given. Please use one of the Client ADAPTER_ constants";
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
