/**
 * Sphere Demo Client
 *
 * Product model
 *
 * Author: Sascha Feldmann (sascha.feldmann@gmx.de)
 */

Product = function(name, description) {
    this.name = name;
    this.description = description;
    this.originalData = "";
}

/**
 * Set the original data from the data source of this product.
 * @param originalData
 */
Product.prototype.setOriginalData = function(originalData)
{
    this.originalData = originalData;
}


exports.productConstructor = Product;