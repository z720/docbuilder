var fs = require('fs');
module.exports = function(folder) {
  var files =  fs.readdirSync(folder), collections = {}, idx;
  for (idx in files) {
    var fi = files[idx];
    if (fi != 'node_modules' 
      && fi.substr(0,1) != '_' 
      && fi.substr(0,1) != '.' 
      && fs.statSync(folder + '/' + fi).isDirectory()
      && fs.readdirSync(folder + '/' + fi).length > 0) {
      collections[fi] = {
        pattern: [ fi + '/**.md', fi + '/**.html' ],
        sortBy: 'originalKey'
      }
    }
  }
  return collections;
}