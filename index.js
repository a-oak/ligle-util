
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


var exportObj;
module.exports = function(cfg){
  if(exportObj) return null;
  if(!cfg) cfg = {};
  var defualtCfg = require('./cfg.js');

  exportObj={};
  // configure
  exportObj.configure = configure;
  exportObj.allConfigure = allConfigure;

  // logger
  exportObj.logger = require('./logger.js')(cfg.logger);

  // class
  //exportObj.Class = require('./class.js')(cfg.cls);
  
  return exportObj;
};



