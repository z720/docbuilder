var dumper = require('../_lib/metalsmith-dumper.js');
var fs     = require('fs');
var expect = require('chai').expect;

describe('metalsmith-dumper', function(){
  var noop = function() {};
  var options = { verbose: false, dump: true, dest: 'test/_' };
  var samplefiles = {
    'test.md': {
      'title': 'Test'
    }
  };
  var samplemetalsmith = {
    dummy: true
  };
  
  before(function() {
    if(!fs.existsSync('test/_')) {
      fs.mkdirSync('test/_');
    }
  });
  
  after(function() {
    fs.rmdirSync('test/_');
  })
  
  // Cleanup
  afterEach(function() {
    ['dump.json', 'custom-dump.json', 'test.json'].map(function(e) {
      if(fs.existsSync('./test/_/' + e)) {
        fs.unlinkSync('./test/_/' + e);
      }
    });
  });
  
  it('should output the files object if verbose', function() {
    var once = false, f = dumper({verbose: true, dump: false}, function(arg) {
      if(once) return;
      once = true;
      expect(arg).to.be.deep.equal(samplefiles);
    });
    f(samplefiles, samplemetalsmith, function() {
      expect(once).to.be.true;
    });
  });
  it('should not output the files object if silent', function() {
    var once = false, f = dumper({verbose: false, dump: false}, function(arg) {
      if(once) return;
      once = true;
      expect(arg).to.be.not.deep.equal(samplefiles);
    });
    f(samplefiles, samplemetalsmith, function() {
      expect(once).to.be.true;
    });
  });
  it('should generate a formatted JSON file with data and metalsmith if dump is enabled', function() {
    var f = dumper(options, noop), data = "";
    f(samplefiles, samplemetalsmith, function() {
      expect(fs.existsSync('./test/_/dump.json')).to.be.true;
      data = fs.readFileSync('./test/_/dump.json', 'utf8');
      expect(JSON.parse(data)).to.deep.equal({files: samplefiles, metalsmith: samplemetalsmith});
    });
  });
  it('should be possible to specify the filename generated', function(){
    var f = dumper(Object.assign(options, {dump: 'custom-dump.json'}), noop), data = "";
    f(samplefiles, samplemetalsmith, function() {
      expect(fs.existsSync('test/_/custom-dump.json')).to.be.true;
      data = fs.readFileSync('test/_/custom-dump.json', 'utf8');
      expect(JSON.parse(data)).to.deep.equal({files: samplefiles, metalsmith: samplemetalsmith});
    });
  });
  it('should not generate any file if dump is not enabled', function(){
    var f = dumper(Object.assign(options, {dump: false}), noop);
    expect(fs.existsSync('test/_/dump.json')).to.be.false;
    f(samplefiles, samplemetalsmith, function() {
      expect(fs.existsSync('test/_/dump.json')).to.be.false;
    });
  });
  it('should display a non-blocking error if file is not writable', function() {
    var f = dumper(Object.assign(options, {dump: 'test.json'}), function(arg1, arg2) {
      if(once) return;
      once = true;
      expect(arg1).to.have.string('Error');
    }), once = false;
    fs.mkdirSync('test/_/test.json');
    expect(function() { f(samplefiles, samplemetalsmith, function() {
      fs.rmdirSync('test/_/test.json');
    });
    }).not.to.throw('EEXIST');
  });
})