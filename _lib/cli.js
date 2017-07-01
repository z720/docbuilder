#! /usr/bin/env node
// Command line handling ------------------------------------------------------
var program      = require('commander');
var meta         = require(__dirname + '/../package.json');
var docbuilder   = require('./docbuilder');

program
  .version(meta.version)
  .option('-s, --src [folder]', 'Source directory (default: src)', 'doc')
  .option('-d, --dest [folder]', 'Destination directory (default: _build)', '_build')
  .option('--watch', 'Start in watch mode, folders will be watched and content updated as files changes')
  .option('--serve [port]', 'Start a server on [port] (default to 9000)')
  .option('--verbose', 'Display underlying object')
  .option('--dump [file]', 'Dump core data to json (default: dump.json)')
  .parse(process.argv);

var options = {
    src: 'doc',
    dest: '_build',
    watch: false,
    serve: false,
    dump: false
};

Object.keys(program).forEach(function(key) {
   if( key in options ) {
       options[key] = program[key];
   } 
});

docbuilder(options);