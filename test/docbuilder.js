var docbuilder = require('../_lib/docbuilder.js');
var rmdir = require('fs-extra').removeSync;
var fs = require('fs');
var expect = require('chai').expect;

describe('docbuilder', function(){
  var options = options = {
    src: 'test/fixtures',
    dest: 'test/_b',
    watch: false,
    serve: false,
    dump: false
  };
  before(function(done) {
    fs.mkdirSync('./test/_b');
    docbuilder(options, done);
  });
  after(function() {
    rmdir('./test/_b');
  });
  it('should create a metalsmith instance');
  it('should generate html pages', function() {
    expect(fs.existsSync('./test/_b/index.html')).to.be.true;
    expect(fs.readFileSync('./test/_b/index.html').toString()).to.include('<!doctype html>');
  });
  it('should group sub-directory files within collections');
  it('should order collection content by file name');
  it('should generate "permalink" type of link');
  it('should allow to include content by reference');
  it('should decorate html files');
  it('should parse markdown files')
})