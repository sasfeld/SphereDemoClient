/**
 * Sphere Demo Client
 *
 * Product loader
 *
 * Author: Sascha Feldmann (sascha.feldmann@gmx.de)
 */

var client = require('../http');
var httpClient = client.client;
var querystring = require('querystring');


ProductLoader = function() {
    this.limit = undefined;
    this.offset = undefined;
}

ProductLoader.prototype.setLimitAndOffset = function(limit, offset)
{
  this.limit = limit;
  this.offset = offset;
}

ProductLoader.prototype.load = function(callbackFunction)
{
    var url = global.app.sphere.apiUrl + '/' + global.app.sphere.projectKey + '/product-projections';

    // use adapter from request module
    httpClient.setAdapter(httpClient.ADAPTER_REQUEST);

    // set limit and offset
    var queryParams = {
    };
    if (undefined !== this.limit) {
        queryParams['limit'] = this.limit;
    }
    if (undefined !== this.offset) {
        queryParams['offset'] = this.offset;
    }

    if ('limit' in queryParams || 'offset' in queryParams) {
        global.app.log('adding limit and offset');
        url += "?" + querystring.stringify(queryParams);
    }

    global.app.log('Loading products using URL: ' + url);

    // set access token in header
    httpClient.setHeadersOnce({
        'Authorization': 'Bearer ' + global.app.sphere.accessToken
    });

    // trigger GET
    httpClient.doGet(url, function(error, response, body)  {
        if (response.statusCode == 200) {
            console.log('original query: ' + body);
            callbackFunction(JSON.parse(body));
        }
    });
}

exports.loader = new ProductLoader();
