// Standard dependencies
var fs           = require('fs');
var util         = require('util');
var process      = require('process');
var meta         = require(__dirname + '/../package.json');
var sitemeta     = {}; 
var chalk        = require('chalk');
var elapsedLabel = chalk.blue('Finished in ');

console.time(elapsedLabel);

if(fs.existsSync(process.cwd() + '/docbuilder.json')) {
  sitemeta = require(process.cwd() + '/docbuilder.json');
}

sitemeta.generatorname = util.format("%s - %s", meta.name, meta.version);
sitemeta.generatorurl  = meta.repository.url;

// encapsulate Console.log 
var _consolelog = console.log;
/*console.log = function(...args) {
  var m = args;
  m[0] = m[0].replace('[metalsmith-serve]', '>');
  return output(...m);
}*/
function output(text, ...args) {
  _consolelog("%s " + text, chalk.green(meta.name), ...args);
}
function error(text, ...args) {
  console.error("%s %s: %s", chalk.green(meta.name), chalk.red('Error'), text, ...args)
}

// Metalsmith + plugins
var Metalsmith   = require('metalsmith');
var markdown     = require('metalsmith-markdown');
var layouts      = require('metalsmith-layouts');
var collections  = require('metalsmith-collections');
var headings     = require('metalsmith-headings');
var permalinks   = require('metalsmith-permalinks');
var drafts       = require('metalsmith-drafts');
var include      = require('metalsmith-include-content');
var assets       = require('metalsmith-assets');
var watch        = require('metalsmith-watch');
var serve        = require('metalsmith-serve');
var buildCollectionsFromDirectory = require('./collections-builder');
var removePrefix = require('./metalsmith-remove-order-prefix');
var dumper       = require('./metalsmith-dumper');
var defaultIndex = require('./metalsmith-default-index');
// Register Templating system
//var Handlebars   = 
require('handlebars');
//var helpers      = 
require('handlebars-helpers')(); //register helpers


module.exports = function(options, done) {

output(chalk.gray("Building from %s to %s..."), chalk.blue(options.src), chalk.blue(options.dest));

// Metalsmith ------------------------------------------------------------------


// Errors
if(!fs.existsSync(process.cwd() + '/' + options.src)) {
  error(options.src + ' not found');
  process.exit(1);
}

var ms = Metalsmith(process.cwd())         // __dirname defined by node.js: 
                                           // name of current working directory
  .metadata(sitemeta)
  .source(options.src)            // source directory
  .destination(options.dest)     // destination directory
  .clean(true)                // clean destination before
  .use(drafts())              // Exclude drafts from generation
  .use(defaultIndex)
  .use(assets({
    "source": __dirname + "/../_assets",
    "destination": "_assets"
  }));
if (fs.existsSync( "./_assets")) { 
  ms.use(assets({
    "source": "./_assets",
    "destination": "_assets"
  }))
}
ms.use(collections(buildCollectionsFromDirectory(options.src)))
  //.use(include())             // Resolve include
  .use(markdown())            // transpile all md into html
  .use(headings('h2'))        // Extract level nav
  .use(removePrefix)
  .use(permalinks({ }))          // permalinks!
  .use(dumper(options, output))
  .use(layouts({              // wrap layouts around html
    engine: 'handlebars',     // use the layout engine you like
    directory: __dirname + '/../_layouts',    // use a specific directory for layouts
    'default': 'layout.html', // default layout
    pattern: [ '**/*.md', '**/*.html' ]
  }));
  
if(options.watch) {
  ms.use(
      watch({
        paths: {
          "${source}/**/*": true,
          "_assets/**/*": true,
          "_layouts/**/*": "**/*.{md,html}"
        },
        livereload: false,
        log: output
      })
    );
}

if (options.serve) {
  ms.use(serve({
    port: parseInt(options.serve) > 0 ? parseInt(options.serve) : 9000 ,
    verbose: true
  }))
}

if (options.watch || options.serve) {
output(
    "%s: %s", 
    chalk.gray('Watch / Serve mode'),
    chalk.green("press Ctrl+C to stop")
  );
}

ms.build(function(err) {      // build process
    if (err) throw err;       // error handling is required
    setImmediate(done);
    if(!options.watch) console.timeEnd(elapsedLabel);
  });
}