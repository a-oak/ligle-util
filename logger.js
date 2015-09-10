var log4js = require('log4js');
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

var exportObj;
module.exports = function(cfg){
  if(exportObj) return exportObj;
  exportObj = {};

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
  exportObj.logger=function(name,level){
    var logger = log4js.getLogger(name);
    logger.setLevel(level);
    return logger;
  };
  return exportObj;
};


