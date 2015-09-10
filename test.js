var expect = require('chai').expect;

var util = require('./index')();


////////////////// configure function //////////////////

var configure = util.configure;
var allConfigure = util.allConfigure;
describe('configure function',function(){
  it('configure',function(){
    var config = {a:11,b:22};
    var defaultCfg = {a:1,b:2,c:3};
    var cfg = configure(config,defaultCfg);// apply defaultCfg on whole scope
    expect(cfg).to.deep.equal({a:11,b:22,c:3});
  });
  it('allConfigure',function(){
    var config = {a:11,b:{b1:2}};
    var defaultCfg = {a:1,b:{b1:1,b2:3},c:3};
    var cfg = allConfigure(config,defaultCfg);// apply defaultCfg on whole scope
    expect(cfg).to.deep.equal({a:11,b:{b1:2,b2:3},c:3});
  });
});

////////////////// logger //////////////////
