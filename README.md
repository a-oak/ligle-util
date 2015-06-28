
ligle util
====================

## 简介
通用功能函数库

## 文档
* [`logger`](#logger)
* [`Class`](#Class)
* [`isEmpty`](#isEmpty)

---------------------------------------

<a name="logger" />
### logger(name, level)
name:指定名字
level:指定输出等级

---------------------------------------

<a name="Class" />
### Class
这个对象用来生成类。用法：

```js
var Person = Class.extend({
  init: function(isDancing){
    this.dancing = isDancing;
  },
  dance: function(){
    return this.dancing;
  }
});
 
var Ninja = Person.extend({
  init: function(){
    this._super( false );
  },
  dance: function(){
    // Call the inherited version of dance()
    return this._super();
  },
  swingSword: function(){
    return true;
  }
});
 
var p = new Person(true);
p.dance(); // => true
 
var n = new Ninja();
n.dance(); // => false
n.swingSword(); // => true
 
// Should all be true
p instanceof Person && p instanceof Class &&
n instanceof Ninja && n instanceof Person && n instanceof Class
```
---------------------------------------

<a name="isEmpty" />
### isEmpty(obj)
判断对象是否为空
