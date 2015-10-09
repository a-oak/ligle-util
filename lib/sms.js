var request = require('request');
var moment = require('moment');
var util = require('util');

var index = require('./index.js')();

var getSmsInfo = function(body){
  if(body.statusCode==='000000') {
    return null;
  }
  return body.statusMsg;
};

var exportObj;
module.exports = function(cfg){
  if(exportObj) {
    return exportObj;
  }
  exportObj = {};
  var smsCodeGen = index.makeCodeGen(cfg.code.length,cfg.code.mode);

  /// 发送短信功能
  var sendSms = function(to,tempId,params,callback){
    // api的url
    var timeStamp = index.createTimeStamp(cfg.timeFmt);
    var sigParameter = index
      .hashMD5(cfg.accountSid+cfg.accountToken+timeStamp)
      .toUpperCase();

    var url = util.format(
      '/%s/Accounts/%s/%s/%s?sig=%s',
      cfg.softVersion,
      cfg.accountSid,
      cfg.func,
      cfg.funcdes,
      sigParameter
    );

    // http头
    var authBuff = new Buffer(cfg.accountSid+':'+timeStamp);
    var authcode = authBuff.toString('base64');

    // jscs:disable
    var headers = {
      'Accept':'application/json',
      'Content-Type':'application/json;charset=utf-8',
      'Authorization':authcode,
    };
    // jscs:enable

    var code = smsCodeGen();

    // api调用参数
    var body = {
      to:to,
      templateId:tempId.toString(),
      appId:cfg.appId,
      datas:params,
    };

    // request调用信息:post选项
    var postOptions = {
      method: 'POST',
      baseUrl:cfg.serverIP+':'+cfg.serverPort,
      url: url,
      json:true,
      body:body,
      headers:headers,
    };
    request(postOptions, function(err,res,body){
      err = getSmsInfo(body);
      callback(err,body);
    });
  };

  /// 发送短信功能
  var sendSmsCode = function(to,expire,callback){
    var code = smsCodeGen();
    var params = [code.toString(),expire.toString()];
    sendSms(to,cfg.templates.code,params,function(err,body){
      if(err){
        return callback(err);
      }
      return callback(null,code);
    });
  };

  var sendSmsCodeFake = function(to,expire,callback){
    var code = smsCodeGen();
    callback(null,code);
  };

  exportObj.sendSms = sendSms;
  exportObj.sendSmsCode = cfg.useFake ? sendSmsCodeFake:sendSmsCode;

  return exportObj;
};


