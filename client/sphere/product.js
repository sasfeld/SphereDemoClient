/**
 * Sphere Demo Client
 *
 * Product loader
 *
 * Author: Sascha Feldmann (sascha.feldmann@gmx.de)
 */

var client = require('../http');
var httpClient = client.client;

var app = global.app;

ProductLoader = function() {

    this.accessToken = app.sphere.accessToken;
    this.endpoint = app.sphere.apiUrl;
    this.projectConfigKey = app.sphere.projectKey;
}

ProductLoader.prototype.load = function()
{
    var url = this.endpoint + '/' + this.projectConfigKey + '/product-projections';

    httpClient.doGet(url, function (response) {

    });
}
