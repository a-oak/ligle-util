var crypto = require('crypto');
var request = require('request');
var util = require('util');
var moment = require('moment');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var log4js = require('log4js');
var deepEqual = require('deep-equal');
var deepCopy = require('deepcopy');
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');


/////////////////// 日志工具
// log4js。使用这个logger更加方便的控制日志。
// 以下几个是logger的等级：
// logger.trace(‘Entering cheese testing’);
// logger.debug(‘Got cheese.’);
// logger.info(‘Cheese is Gouda.’);
// logger.warn(‘Cheese is quite smelly.’);
// logger.error(‘Cheese is too ripe!’);
// logger.fatal(‘Cheese was breeding ground for listeria.’);
//关于log4js更多内容：
// http://m.blog.csdn.net/blog/hfty290/42843737
log4js.configure({
  appenders: [
    { type: 'console' }, //控制台输出
    {
      type: 'file', //文件输出
      filename: 'access.log', 
      maxLogSize: 10000000,
      backups:3
    }
  ]
});
exports.logger=function(name,level){
  var logger = log4js.getLogger(name);
  logger.setLevel(level);
  return logger;
};

var logger = exports.logger('util','TRACE');

///////////// 面向对象工具
// 面向对象的一些基础： prototype, instanceof, __proto__
// http://www.ibm.com/developerworks/cn/web/1306_jiangjj_jsinstanceof/
// 一些简要总结：
// 1. 类(Function)上的prototype <==> 对象（Object）上的__proto__
//    作为对象查找field的默认列表（类似lua的metatable）。
// 2. instanceof操作符
//    其实看的是对象的__proto__链上是否能与类的prototype相等。
// 3. 使用上
//    1. 希望被继承的（类似默认值的）方法和属性，保存在prototype中。
//       （注意，一般意义下的重新赋值，并不会改变默认值。通过__proto__修改会更改默认值，然而也只是更改这个类的默认值，基类的不动）
//    2. 只能被本类型对象使用的方法和属性，保存在this中。
//    3. 私有属性：在构造中定义局部变量，然后提供公有函数可以访问和修改它。（利用闭包）
//    4. 私有方法：模块文件内部定义一些函数进行使用就可以了。不对其导出。
//    5. 定义在类上的属性和方法：类似于C++中的类静态变量和函数。（不能通过对象访问）
// 关于caller和callee
// arguments有这两个属性。
//   callee是函数本身。
//   caller是调用本函数的函数。

// 采用这个继承模块：
// 没有使用标准库util。因为不够好用
// http://ejohn.org/blog/simple-javascript-inheritance/
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();
exports.Class = Class;


// 判断对象是否为空
// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

exports.isEmpty = isEmpty;

exports.noop = function(){};

exports.configure = function(config,defaultCfg){
  if(!config || typeof config !== "object") config={};
  for(var key in defaultCfg){
    config[key] = config[key] || defaultCfg[key];
  }
  return config;
};

exports.deepEqual = deepEqual;
exports.deepCopy = deepCopy;


/// 总结的常用函数
var hashMD5 = exports.hashMD5 = function(str){
  return crypto.createHash('md5').update(str).digest('hex');
};

var createTimeStamp = exports.createTimeStamp = function(fmt){
  return moment().format(fmt);
};
var randChar = exports.randChar = function (){
  return String.fromCharCode(parseInt(Math.random()*26)+65);
};
var randDigit = exports.randDigit = function (){
  return parseInt(Math.random()*10);
};

var randCharAndDigit = function(mode){
  if(Math.random()>0.5) return randChar();
  else return randDigit();
};

var makeCodeGen = exports.makeCodeGen = function(length,mode){
  length = length || 1;
  mode = mode || 'both';
  if(mode==='both'){
    return function(){
      var container = new Array(length);
      for(var i = 0; i<length; i++){
        container[i] = randCharAndDigit();
      }
      return container.join('');
    }
  }else if(mode==='digit'){
    return function(){
      var container = new Array(length);
      for(var i = 0; i<length; i++){
        container[i] = randDigit();
      }
      return container.join('');
    }
  }else{
    throw Error('support mode: digit/both; not support:'+mode);
  }
};


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

var options = {
  host: "115.28.149.231",
  port: 25,
  auth: {
    user: 'hi@ligle.net',
    pass: 'hi1ig1e',
  }
};
var transporter = nodemailer.createTransport(smtpTransport(options));
var emailFrom = 'no-reply@ligle.net';

var sendEmail = exports.sendEmail = function(to,subject,content,callback){
  var options = {
    from: emailFrom,
    to: to,
    subject: subject,
    html: content
  };
  transporter.sendMail(options, function(err, res){
    if(err) return callback(err);
    transporter.close(); // shut down the connection pool, no more messages
    callback(null, res);
  });
};

var templates = {};
templates.signUp = {
  subject: '欢迎注册 <%- appname %>',
  text: [
    '<h2>您好 <%- username %></h2>',
    '欢迎注册 <%- appname %>.',
    '<p> <%- link %> 完成注册.</p>',
    ' 或者在拷贝以下链接，在浏览器中打开',
    ' <%- url%>',
  ].join('<br />'),
  linkText: '点击这里'
};

// email already taken template
templates.occupy = {
  subject: '邮箱已经注册',
  text: [
    '<h2>您好 <%- username %></h2>',
    ' 您正在尝试注册 <%- appname %>.',
    '<p>您的邮箱已经注册，不能重复注册',
    ' 如果不是您本人进行注册，您可以忽略这封邮件</p>',
    ' 使用如下链接找回密码',
    ' <%- url%>',
    '<p>The <%- appname %> Team</p>'
  ].join('<br />')
};

// resend signUp template
templates.resend = {
  subject: '完成您的注册',
  text: [
    '<h2>您好 <%- username %></h2>',
    ' <%- link %>完成注册',
    ' 或者在拷贝以下链接，在浏览器中打开',
    ' <%- url%>',
    '<p>The <%- appname %> Team</p>'
  ].join('<br />'),
  linkText: '点击这里'
};

// forgot password template
templates.reset = {
  subject: '重置密码',
  text: [
    '<h2>您好 <%- username %></h2>',
    '<%- link %> 重置密码',
    ' 或者在拷贝以下链接，在浏览器中打开',
    ' <%- url%>',
    '<p>The <%- appname %> Team</p>'
  ].join('<br />'),
  linkText: '点击这里'
};
// obj需要提供appname, username, url
var sendTemplateEmail = exports.sendTemplateEmail=function(to,tmpName,obj,cb){
  fs.readFile(path.join(__dirname, 'emailBoiler.html'), 'utf8', function(err, data) {
    if (err) return cb(err);
    var tmp = templates[tmpName];
    var locals = {
      title: '',
      content: tmp.text
    };

    var html = ejs.render(data, locals);
    obj.link = '<a href="' + obj.url + '">' + tmp.linkText + '</a>';
    html = ejs.render(html,obj);

    var subject = ejs.render(tmp.subject,obj);

    sendEmail(to,subject,html,cb);
  });
};


//page calculate
var pageCalculate = exports.pageCalculate = function(curPage, totalNum){
  var pageNum = 2;
  var plus = totalNum%pageNum === 0?0:1;
  var totalPage = parseInt(totalNum/pageNum) +plus;
  if(totalPage <= 0) totalPage = 1;
  if(curPage >= totalPage) curPage = totalPage;
  if(curPage <= 1) curPage = 1;
  var skipNum = (curPage -1)*pageNum;
  var limitNum = pageNum;
  return {curPage:curPage, totalPage:totalPage, skipNum:skipNum, limitNum:limitNum}
}
