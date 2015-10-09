
ligle-util
====================

[![Build Status](https://travis-ci.org/a-oak/ligle-util.svg?branch=master)](https://travis-ci.org/a-oak/ligle-util)
Copyright (c) 2015 [A-Oak](http://a-oak.com/) Co. Ltd.


## 安装
`npm install ligle-util`

https://www.npmjs.com/package/ligle-util

## 简介
ligle-engine使用的通用功能函数库

## 部分文档
* [`logger`](#logger)
* [`Class`](#Class)
* [`isEmpty`](#isEmpty)
* [`configure`](#configure)

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

---------------------------------------

<a name="configure" />
### configure(config, name, defaultCfg)
- config:全局的配置

- name:  对config[name]项进行配置。（注意：config[name]必须是object,否则defaultCfg会覆盖它）。如果name是空字符串。那么会对整个config进行配置。

- defaultCfg: 对config[name]项的内容进行赋值，如果config[name]中相应的项已经有了，那么就不使用默认值了。

- 返回：配置好的config。

```js
var config = {a:{xx:11,yy:22},b:{}};
var defaultCfg = {xx:12,zz:23};
// 对全局config中的a项进行配置
var cfg = configure(config,'a',defaultCfg);
// 结果：{ a: { xx: 11, yy: 22, zz: 23 }, b: {} }


config = {a:11,b:22};
defaultCfg = {a:1,b:2,c:3};
cfg = configure(config,'',defaultCfg);
// 结果：{ a: 11, b: 22, c: 3 }
```
