var request = require('request');
var moment = require('moment');
// TODO：配置整理到文件中去
var ServerIP = "https://sandboxapp.cloopen.com";
var ServerPort = "8883";
var SoftVersion = "2013-12-26";
var TimeFmt = 'YYYYMMDDHHmmss';
var AccountSid = "aaf98f894dae9c16014db3891fc3045c";
var AccountToken = "8a0d3b22dbcf4ed3848c837c7367179a";
var AppId = "aaf98f894dae9c16014db3899afa045e";
var AppToken = "99c4ba07c862cff55250ecb31af13cb9";
var smsCodeGen = makeCodeGen(6,'digit');
var Func = "SMS";
var Funcdes = "TemplateSMS";

/// 发送短信功能
var sendSmsCode = exports.sendSmsCode = function(to,expire,callback){
  // api的url
  var timeStamp = createTimeStamp(TimeFmt);
  var sigParameter = hashMD5(AccountSid+AccountToken+timeStamp).toUpperCase();
  var url = util.format(
    '/%s/Accounts/%s/%s/%s?sig=%s',
    SoftVersion,
    AccountSid,
    Func,
    Funcdes,
    sigParameter
  );
  // http包头
  var authBuff = new Buffer(AccountSid+':'+timeStamp);
  var authcode = authBuff.toString('base64');
  var headers = {
    'Accept':'application/json',
    'Content-Type':'application/json;charset=utf-8',
    'Authorization':authcode
  };
  
  var code = smsCodeGen();
  // api调用参数
  var body = {
    to:to,
    templateId:'1',
    appId:AppId,
    datas:[code.toString(),expire.toString()]
  };

  // request调用信息:post选项
  var postOptions = { 
    method: 'POST', 
    baseUrl:ServerIP+':'+ServerPort,
    url: url,
    json:true,
    body:body,
    headers:headers
  };
  request(postOptions, function(err,res,body){
    callback(err,code);
  });
};
exports.sendSmsCodeFake = function(to,expire,callback){
  var code = smsCodeGen();
  callback(null,code);
};
