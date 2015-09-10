var crypto = require('crypto');
var util = require('util');
var deepEqual = require('deep-equal');
var deepCopy = require('deepcopy');
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
