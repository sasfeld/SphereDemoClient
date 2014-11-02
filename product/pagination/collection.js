/**
 * Sphere Demo Client
 *
 * Product model
 *
 * Author: Sascha Feldmann (sascha.feldmann@gmx.de)
 */

var sys = require('sys');
var product = require('../product');
var Product = product.productConstructor;
var productClient = require('../../client/sphere/product');
var productLoader = productClient.loader;

ProductCollection = function() {
    this.pages = [];
    this.productsPerPage = 3;
    // this will be set on first products load
    this.numberOfPages = 0;

    var _this = this;
    /**
     * This method is called after the products were loaded from Sphere.IO.
     *
     * @param productsResponse object literal, see the Sphere.IO documentation on Products.
     */
    this.onProductsLoaded = function(productsResponse)
    {

        var pageNumber = Math.floor(productsResponse.offset / _this.productsPerPage) +1;
        var productResults = productsResponse.results;

        for (var i=0; i < productResults.length; i++) {
            var productResult = productResults[i];

            var newProduct = new Product();
            newProduct.setOriginalData(productResult);

            // store in page
            if (!(pageNumber in _this.pages)) {
                _this.pages[pageNumber] = [];
            }

            _this.pages[pageNumber].push(newProduct);
        }

        // set number of pages
        _this.numberOfPages = Math.round(productsResponse.total / _this.productsPerPage);

        _this.printPage(pageNumber);
    };

    /**
     * Print products on the given page.
     * @param pageNumber
     */
    this.printPage = function(pageNumber)
    {
        global.app.log("printing page " + pageNumber+ " of " + this.numberOfPages +": \n");

        if (!(pageNumber in this.pages)) {
            global.app.log("Page " + pageNumber + " is out of bounds");
        } else {
            for (var i = 0; i < this.pages[pageNumber].length; i++) {
                var product = this.pages[pageNumber][i];

                global.app.log("-> " + JSON.stringify(product.originalData) + "\n");
            }
        }

        // call onSphereAuthentication again
        this.onSphereAuthentication();
    }

    this.loadProducts = function(page, productsPerPage)
    {
        var offset = (page - 1) * productsPerPage;
        var limit = productsPerPage;

        productLoader.setLimitAndOffset(limit, offset);

        productLoader.load(this.onProductsLoaded);
    };
};

/**
 * This method is called on application bootstrap.
 */
ProductCollection.prototype.doBootstrap = function ()
{
    global.app.addObserver(this);
};

ProductCollection.prototype.getByPage = function (page) {
    if (page in this.pages) {
        global.app.log('loading from cache');
        this.printPage(page);
    } else {
        this.loadProducts(page, this.productsPerPage);
    }
};

/**
 * This method will be called after successful sphere authentication.
 */
ProductCollection.prototype.onSphereAuthentication = function()
{
    app.log('Please type in a page number (starting at 1) to get the products');

    var stdIn = process.openStdin();

    stdIn.removeAllListeners('data');

    var _this = this;
    stdIn.on("data", function(d) {
       var input = d.toString().substring(0, d.length - 1);
       process.stdin.pause();

        try {
            var pageNumber = parseInt(input);
        } catch (e) {
            app.log('Please type in a number.');
        }

        _this.getByPage(pageNumber);
    });
};

/**
 * Recieve an event by an observable.
 *
 * @param eventName
 */
ProductCollection.prototype.recieveEvent = function(eventName)
{
    if (app.EVENT_ON_SPHERE_AUTHENTICATION == eventName) {
        this.onSphereAuthentication();
    }
}

var collectionSingleton = new ProductCollection();
exports.collection = collectionSingleton;