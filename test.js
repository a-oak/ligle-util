var expect = require('chai').expect;
var util = require('./index');

var configure = util.configure;
describe('configure()',function(){
  it('apply default config on specified field',function(){
    var config = {a:{xx:11,yy:22},b:{}};
    var defaultCfg = {xx:12,zz:23};
    var cfg = configure(config,'a',defaultCfg); // apply defaultCfg on field a
    expect(cfg).to.deep.equal({a:{xx:11,yy:22,zz:23},b:{}});
  });
  it('apply default config on whole scope',function(){
    var config = {a:11,b:22};
    var defaultCfg = {a:1,b:2,c:3};
    var cfg = configure(config,'',defaultCfg);// apply defaultCfg on whole scope
    expect(cfg).to.deep.equal({a:11,b:22,c:3});
  });
});

