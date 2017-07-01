var CircularJSON = require('circular-json');
var fs           = require('fs');
var chalk        = require('chalk');

module.exports = function(options, output) {
  return function(files, metalsmith, done) {
    if(options.verbose) output(files);
    if(options.dump === true) {
      options.dump = 'dump.json';
    }
    if(options.dump) {
      var fname = [options.dest, options.dump ].join('/');
      fs.writeFile(fname, CircularJSON.stringify({files: files, metalsmith: metalsmith}, null, 4), 'utf-8', function(err) {
        if (err) {
          output(chalk.red("Export Error: "), err);
        } else {
          output("Data exported to %s", chalk.blue(fname));
        }
      });
    }
    setImmediate(done);
  }
};