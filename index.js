
/////////////////// 日志工具
// log4js。使用这个logger更加方便的控制日志。
// 以下几个是logger的等级：
// logger.trace(‘Entering cheese testing’);
// logger.debug(‘Got cheese.’);
// logger.info(‘Cheese is Gouda.’);
// logger.warn(‘Cheese is quite smelly.’);
// logger.error(‘Cheese is too ripe!’);
// logger.fatal(‘Cheese was breeding ground for listeria.’);
var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' }, //控制台输出
    {
      type: 'file', //文件输出
      filename: 'access.log', 
      maxLogSize: 1024,
      backups:3,
      category: 'normal' 
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

exports.configure = function(config,name,defaultCfg){
  if(!config) config={};
  var obj;
  if(name){
    if(!(config[name] instanceof Object)) config[name]={};
    for(var key in defaultCfg){
      config[name][key] = config[name][key] || defaultCfg[key];
    }
  }
  else{
    for(var key in defaultCfg){
      config[key] = config[key] || defaultCfg[key];
    }
  }
  return config;
};

