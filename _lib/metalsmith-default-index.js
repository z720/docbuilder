'use strict';

module.exports = function(files, metalsmith, done) { // Auto index if none
    if(!("index.html" in files) && !("index.md" in files)) {
      files['index.md'] = {
        title: "Index",
        contents: Buffer("Set a proper home by placing a " + 
                         "`index.html` or `index.md` file in folder: `" + 
                         [ process.cwd(), metalsmith._source].join('/') + "`"
                         )
      };
    }
    done();
  }