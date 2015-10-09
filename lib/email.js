var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');


var index = require('./index.js')();

var exportObj;
module.exports = function(cfg){
  if(exportObj) {
    return exportObj;
  }
  exportObj = {};
  var transporter = nodemailer.createTransport(smtpTransport(cfg.options));

  var sendEmail = function(to,subject,content,callback){
    var options = {
      from: cfg.emailFrom,
      to: to,
      subject: subject,
      html: content,
    };
    transporter.sendMail(options, function(err, res){
      if(err) {
        return callback(err);
      }
      transporter.close(); // shut down the connection pool, no more messages
      callback(null, res);
    });
  };

  // obj需要提供appname, username, url
  var sendTemplateEmail =function(to,tmpName,obj,cb){
    fs.readFile(
      path.join(__dirname, 'emailBoiler.html'),
      'utf8',
      function(err, data) {
        if (err){
          return cb(err);
        }
        var tmp = cfg.templates[tmpName];
        var locals = {
          title: '',
          content: tmp.text,
        };

        var html = ejs.render(data, locals);
        obj.link = '<a href="' + obj.url + '">' + tmp.linkText + '</a>';
        html = ejs.render(html,obj);

        var subject = ejs.render(tmp.subject,obj);

        sendEmail(to,subject,html,cb);
      }
    );
  };

  exportObj.sendEmail = sendEmail;
  exportObj.sendTemplateEmail = sendTemplateEmail;
  return exportObj;
};

