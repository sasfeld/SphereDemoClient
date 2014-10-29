/**
 * Sphere Demo Client
 *
 * Unit tests of client adapter.
 *
 * Author: Sascha Feldmann (sascha.feldmann@gmx.de)
 */
var httpclient = require( '../../../client/http.js');

var client = httpclient.client;
var testUrl = "http://saschafeldmann.de";
var app = global.app;

exports.testDoGet = function (test) {
    test.expect(1);

    // do a GET request to the test URL, expect it to be HTML
    client.doGet(testUrl, function (response) {
        console.log('do get...');
        var responseStr = '';

        response.on('data', function (chunk) {
            responseStr += chunk;
        });

        response.on('end', function () {
            test.ok( responseStr.indexOf('</html>') > -1);
            test.done();
        });
    });
}

exports.testDoPost = function (test) {
    test.expect(1);

    // do a POST request to the test URL, expect it to be HTML
    client.doPost(testUrl, "", function (response) {
        console.log('do post...');
        var responseStr = '';

        response.on('data', function (chunk) {
            responseStr += chunk;
        });

        response.on('end', function () {
            test.ok( responseStr.indexOf('</html>') > -1);
            test.done();
        });
    });
}

exports.testDoPut = function (test) {
    test.expect(1);

    // do a PUT request to the test URL, expect it to be HTML
    client.doPut(testUrl, "", function (response) {
        console.log('do put...');
        var responseStr = '';

        response.on('data', function (chunk) {
            responseStr += chunk;
        });

        response.on('end', function () {
            test.ok( responseStr.indexOf('</html>') > -1);
            test.done();
        });
    });
}
