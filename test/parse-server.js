var assert = require('chai').assert;
var expect = require('chai').expect;
var parse = require('../_lib/parse-server');


describe('parse-server', function() {
    it('should return default values localhost:9000 (undefined)', function() {
      var p = parse();
      assert.equal("localhost", p.host);
      assert.equal(9000, p.port);
    });
    it('should return host with default port if no port provided (hostonly)', function() {
      var p = parse("hostonly");
      assert.equal("hostonly", p.host);
      assert.equal(9000, p.port);
    });
    it('should return localhost with specified port if only port provided (number / 8080)', function() {
      var p = parse("8080");
      assert.equal("localhost", p.host);
      assert.equal(8080, p.port);
    });
    it('should return host and port if specified (domain:8080)', function() {
      var p = parse("domain:8080");
      assert.equal("domain", p.host);
      assert.equal(8080, p.port);
    });
    it('should return "All interface" if domain=* (* or *:8080)', function() {
      var p  = parse("*:8080");
      assert.equal("::", p.host);
      assert.equal(8080, p.port);
      p  = parse("*");
      assert.equal("::", p.host);
      assert.equal(9000, p.port);
    });
    it('should keep all interface :: if given has a domain (:::8080)', function() {
      var p  = parse(":::8080");
      assert.equal("::", p.host);
      assert.equal(8080, p.port);
    });
    it('should accept an IP address as domain', function() {
      var p = parse("192.168.1.1");
      assert.equal("192.168.1.1", p.host);
      assert.equal(9000, p.port);
    });
    it('should accept an empty domain name as "All interface"', function() {
      var p  = parse(":8080");
      assert.equal("::", p.host);
      assert.equal(8080, p.port);
    });
    
    it("should allow to override default", function() {
      var p = parse(undefined, { host: 'another', port: 75});
      assert.equal("another", p.host);
      assert.equal(75, p.port);
      p = parse("hostonly", { host: 'another', port: 75});
      assert.equal("hostonly", p.host);
      assert.equal(75, p.port);
      p = parse("8080", { host: 'another', port: 75});
      assert.equal("another", p.host);
      assert.equal(8080, p.port);
    });
    it("should allow to override default partially", function() {
      var p = parse(undefined, { host: 'another'});
      assert.equal("another", p.host);
      assert.equal(9000, p.port);
      p = parse("hostonly", { host: 'another'});
      assert.equal("hostonly", p.host);
      assert.equal(9000, p.port);
      p = parse("8080", { host: 'another'});
      assert.equal("another", p.host);
      assert.equal(8080, p.port);
      
      p = parse(undefined, { port: 75});
      assert.equal("localhost", p.host);
      assert.equal(75, p.port);
      p = parse("hostonly", { port: 75});
      assert.equal("hostonly", p.host);
      assert.equal(75, p.port);
      p = parse("8080", { port: 75});
      assert.equal("localhost", p.host);
      assert.equal(8080, p.port);
    });
    it("should allow to add attributes to default", function() {
      var p = parse("8080", { host: '::1', verbose: true});
      expect(p).to.deep.equal({ host: '::1', port: 8080, verbose: true});
    });
    it("should only allow to add direct attributes to default",function() {
      var Def = function() {
        this.host = '*';
        this.port = 80;
        this.verbose = true
      }, p, def;
      Def.prototype.what = '?'; //inherited attribute
      def = new Def();
      p = parse("domain", def);
      expect(p).to.deep.equal({ host: 'domain', port: 80, verbose: true});
      assert.equal('?', def.what);
    });
});