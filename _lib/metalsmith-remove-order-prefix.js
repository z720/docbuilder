'use strict';

module.exports = function(files, metalsmith, done) { //rewrite path without order prefix
    var pattern = /^[0-9]+_(.*)/gi;
    for(var i in files) {
      var data = files[i], 
      newpath = i.split('/')
        .map(function(part) { 
          return part.replace(pattern, '$1');
        })
        .join('/');
      //TODO !!! duplicates / overwrite
      data.originalKey = i;
      delete files[i];
      files[newpath] = data;
    }
    done();
  }