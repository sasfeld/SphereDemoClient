/**
 * Sphere Demo Client
 *
 * Product model
 *
 * Author: Sascha Feldmann (sascha.feldmann@gmx.de)
 */



ProductCollection = function() {
    this.pages = array();
    this.productsPerPage = 10;

    this.loadProducts = function(page, productsPerPage) {

    }
}

ProductCollection.prototype.getByPage = function (page) {
    if (page in this.pages) {
        return this.pages[page];
    }

    return this.loadProducts(page, this.productsPerPage);
}
