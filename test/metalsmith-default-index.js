var assert = require('chai').assert;
var expect = require('chai').expect;
var defaultIndex = require('../_lib/metalsmith-default-index');

describe('metalsmith-default-index', function() {
    var fixtures = {
      "HTML/file.md": {},
    },
    metalsmithMock = function() {
      return {
        _source: __dirname + '/fixtures'
      }
    ;}
    it('should add an index if no file is available in metalsmith source root', function(done) {
      var files = fixtures;
      defaultIndex(files, metalsmithMock(), done);
      assert.equal('Index', files['index.md']['title']);
      assert.property(files['index.md'], 'title');
      assert.property(files['index.md'], 'contents');
    });
    it('should not add an index if a file is available in metalsmith source root (index.md)', function(done) {
      var files = { 'index.md': {} };
      defaultIndex(files, metalsmithMock(), done);
      assert.notProperty(files, 'index.html');
      assert.deepEqual({}, files['index.md']);
      assert.notProperty(files['index.md'], 'contents');
    });
     it('should not add an index if a file is available in metalsmith source root (index.html)', function(done) {
      var files = { 'index.html': {} };
      defaultIndex(files, metalsmithMock(), done);
      assert.property(files, 'index.html');
      assert.deepEqual({}, files['index.html']);
      assert.notProperty(files, 'index.md');
    });
  }
);