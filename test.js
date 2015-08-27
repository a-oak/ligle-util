var expect = require('chai').expect;
var util = require('./index');

var configure = util.configure;
describe('configure()',function(){
  it('apply default config',function(){
    var config = {a:11,b:22};
    var defaultCfg = {a:1,b:2,c:3};
    var cfg = configure(config,defaultCfg);// apply defaultCfg on whole scope
    expect(cfg).to.deep.equal({a:11,b:22,c:3});
  });
});

