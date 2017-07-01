var assert = require('chai').assert;
var expect = require('chai').expect;
var remove = require('../_lib/metalsmith-remove-order-prefix');

describe('metalsmith-remove-order-prefix', function() {
    var files = {
        'HTML/01_zzz.md': {},
        'HTML/02_aaa.md': {},
        'Unordered/index.md': {}
    };
    remove(files, undefined, function(){});
    it('should remove the numbered prefix in the file path.', function() {
        assert.property(files, 'HTML/zzz.md');
        assert.notProperty(files, 'HTML/01_zzz.md');
        assert.property(files, 'HTML/aaa.md');
        assert.notProperty(files, 'HTML/02_aaa.md');
        assert.property(files['HTML/zzz.md'], 'originalKey');
        assert.equal(files['HTML/zzz.md'].originalKey, 'HTML/01_zzz.md');
        /*assert.deepEqual(files, {
            'HTML/zzz.md': { originalKey: 'HTML/01_zzz.md' },
            'HTML/aaa.md': { originalKey: 'HTML/02_aaa.md' 'HTML/01_zzz.md'},
            'Unordered/index.md': {}
        });*/
        
    });
    it('should keep the path untouched if its not prefixed by a number.', function() {
        assert.property(files, 'Unordered/index.md');
    });
  }
);