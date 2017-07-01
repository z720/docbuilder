var assert = require('chai').assert;
var expect = require('chai').expect;
var builder = require('../_lib/collections-builder');
var fs = require('fs');
var fixtureDir = __dirname + '/fixtures';

before(function() {
  fs.mkdirSync(fixtureDir + '/Empty');
});

describe('collectionsBuilder', function() {
  var collections = builder(fixtureDir);
  it('should generate collections from first level folder from the provided folder', function() {
    assert.property(collections, 'HTML');
    assert.property(collections, 'Collection');
    assert.deepEqual(collections['Collection'], {
      pattern: [ 'Collection/**.md', 'Collection/**.html' ],
      sortBy: 'originalKey'
    });
    assert.property(collections, 'Markdown');
  });
  it('should ony add a collection if there is at least one HTML or MD file in the folder', function() {
    assert.notProperty(collections, 'Empty');
  })
  it('should ignore directories starting with . or _', function(){
    var ignored =  ['.ignored-collection', '_ignored-collection', 'node_modules'];
    ignored.map(function(item) {
      assert.notProperty(collections, ignored);
    });
  })
})

after(function() {
  fs.rmdirSync(fixtureDir + '/Empty');
});