
// used to calculate configuration
var configure = function(config,defaultCfg){
  // 效果是
  // 只对defaultCfg中的值进行配置（defaultCfg必然是全部的可配置键值）
  if(!config || typeof config !== "object") config={};
  for(var key in defaultCfg){
    config[key] = config[key] || defaultCfg[key];
  }
  return config;
};
var allConfigure = function(config,defaultCfg){
  // 效果是
  // 1. 如果对应的key是object，那么两个object调用configure。
  // 2. 如果对应的key不是object。那么就普通的覆盖效果。
  // 3. 键值以defaultCfg为主。
  if(!config || typeof config !== "object") config={};
  for(var key in defaultCfg){
    if(typeof defaultCfg[key] ==="object"){
      config[key] = allConfigure(config[key],defaultCfg[key]);
    }else{
      config[key] = config[key] || defaultCfg[key];
    }
  }
  return config;
};

var extend = function(obj,ext){
  var k;
  for(k in ext){
    obj[k] = ext[k];
  }
};


var exportObj;
var exporter =  function(cfg){
  if(exportObj) return exportObj;
  if(!cfg) cfg = {};
  var defaultCfg = require('./cfg.js');
  cfg = allConfigure(cfg,defaultCfg);
  var tmp,_cfg;
  
  exportObj={};
  // configure
  exportObj.configure = configure;
  exportObj.allConfigure = allConfigure;

  // logger
  tmp = require('./logger.js')(cfg.logger);
  extend(exportObj,tmp);
  var logger = exports.logger = exportObj.logger(cfg.loggerName,cfg.loggerLevel);
  logger.trace(cfg);

  // class
  tmp = require('./class.js')(cfg.cls);
  extend(exportObj,tmp);


  // util
  tmp = require('./util.js')(cfg.util);
  extend(exportObj,tmp);

  // other
  tmp = require('./other.js')(cfg.other);
  extend(exportObj,tmp);

  // email
  tmp = require('./email.js')(cfg.email);
  extend(exportObj,tmp);

  // sms
  tmp = require('./sms.js')(cfg.sms);
  extend(exportObj,tmp);
  
  return exportObj;
};

// 用来在初始化的时候，配置使用
exporter.allConfigure = allConfigure;
exporter.configure = configure;
exporter.extend = extend;

module.exports = exporter;
