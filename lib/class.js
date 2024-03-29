
var index = require('./index.js')();

var exportObj;
module.exports = function(cfg){
  // jscs:disable
  /* jshint ignore:start */
  if(exportObj) return exportObj;
  exportObj = {};

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


  exportObj.Class = Class;
  // adding code here
  return exportObj;
  /* jshint ignore:end */
  // jscs:enable
};
