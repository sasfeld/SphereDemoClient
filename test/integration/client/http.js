/**
 * Sphere Demo Client
 *
 * Unit tests of client adapter.
 *
 * Author: Sascha Feldmann (sascha.feldmann@gmx.de)
 */
var httpclient = require( '../../../client/http.js');

var testUrl = "http://saschafeldmann.de";

exports.testDoGet = function (test) {
    test.expect(1);

    httpclient.doGet(testUrl, function (response) {
        var responseStr = '';

        response.on('data', function (chunk) {
            responseStr += chunk;
        });

        response.on('end', function () {
            test.ok( responseStr.indexOf('<html>') > -1);
            test.done();
        });
    });
}