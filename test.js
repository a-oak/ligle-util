var ligle = {};
ligle.util = require('./index');
var logger = ligle.util.logger('test','TRACE');
logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');


var configure = ligle.util.configure;


var config = {a:{xx:11,yy:22},b:{}};
var defaultCfg = {xx:12,zz:23};
// 对全局config中的a项进行配置
var cfg = configure(config,'a',defaultCfg);
// 结果：{ a: { xx: 11, yy: 22, zz: 23 }, b: {} }
logger.info(cfg);

config = {a:11,b:22};
defaultCfg = {a:1,b:2,c:3};
cfg = configure(config,'',defaultCfg);
logger.info(cfg);
