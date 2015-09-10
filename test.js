var expect = require('chai').expect;
var should = require('chai').should();

var index = require('./index')();


////////////////// configure function //////////////////

var configure = index.configure;
var allConfigure = index.allConfigure;
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
describe('logger',function(){
  it('exist',function(){
    should.exist(index.logger);
  });
});

////////////////// Class //////////////////
describe('Class',function(){
  it('exist',function(){
    should.exist(index.Class);
  });
});

////////////////// util //////////////////
describe('util',function(){
  it('exist',function(){
    should.exist(index.isEmpty);
    should.exist(index.noop);
    should.exist(index.deepEqual);
    should.exist(index.deepCopy);
    should.exist(index.hashMD5);
    should.exist(index.createTimeStamp);
    should.exist(index.randCharAndDigit);
    should.exist(index.randChar);
    should.exist(index.randDigit);
    should.exist(index.makeCodeGen);
  });
});

////////////////// other //////////////////
describe('other',function(){
  it('exist',function(){
    should.exist(index.pageCalculate);
  });
  it('pageCalculate',function(){
    
  });
});

////////////////// email //////////////////
describe('email',function(){
  it('exist',function(){
    should.exist(index.sendEmail);
    should.exist(index.sendTemplateEmail);
  });
});

////////////////// sms //////////////////
describe('sms',function(){
  it('exist',function(){
    should.exist(index.sendSms);
    should.exist(index.sendSmsCode);
  });
});
