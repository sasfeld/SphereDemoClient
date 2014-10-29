/**
 * Sphere Demo Client
 *
 * Unit tests suite.
 *
 * Author: Sascha Feldmann (sascha.feldmann@gmx.de)
 */
var app = require('../app/bootstrap');

try {
    // default CLI reporter
    var reporter = require('nodeunit').reporters.default;
} catch(e) {
    console.log("Cannot find nodeunit module.");
    console.log("You can download submodules for this project by doing:");
    console.log("");
    console.log("    git submodule init");
    console.log("    git submodule update");
    console.log("");
    process.exit();
}

// do application bootstrap
app.app.doBootstrap();

process.chdir(__dirname);
reporter.run(['test']);