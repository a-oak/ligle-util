var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

var options = {
  host: "115.28.149.231",
  port: 25,
  auth: {
    user: 'hi@ligle.net',
    pass: 'hi1ig1e',
  }
};
var transporter = nodemailer.createTransport(smtpTransport(options));
var emailFrom = 'no-reply@ligle.net';

var sendEmail = exports.sendEmail = function(to,subject,content,callback){
  var options = {
    from: emailFrom,
    to: to,
    subject: subject,
    html: content
  };
  transporter.sendMail(options, function(err, res){
    if(err) return callback(err);
    transporter.close(); // shut down the connection pool, no more messages
    callback(null, res);
  });
};

var templates = {};
templates.signUp = {
  subject: '欢迎注册 <%- appname %>',
  text: [
    '<h2>您好 <%- username %></h2>',
    '欢迎注册 <%- appname %>.',
    '<p> <%- link %> 完成注册.</p>',
    ' 或者在拷贝以下链接，在浏览器中打开',
    ' <%- url%>',
  ].join('<br />'),
  linkText: '点击这里'
};

// email already taken template
templates.occupy = {
  subject: '邮箱已经注册',
  text: [
    '<h2>您好 <%- username %></h2>',
    ' 您正在尝试注册 <%- appname %>.',
    '<p>您的邮箱已经注册，不能重复注册',
    ' 如果不是您本人进行注册，您可以忽略这封邮件</p>',
    ' 使用如下链接找回密码',
    ' <%- url%>',
    '<p>The <%- appname %> Team</p>'
  ].join('<br />')
};

// resend signUp template
templates.resend = {
  subject: '完成您的注册',
  text: [
    '<h2>您好 <%- username %></h2>',
    ' <%- link %>完成注册',
    ' 或者在拷贝以下链接，在浏览器中打开',
    ' <%- url%>',
    '<p>The <%- appname %> Team</p>'
  ].join('<br />'),
  linkText: '点击这里'
};

// forgot password template
templates.reset = {
  subject: '重置密码',
  text: [
    '<h2>您好 <%- username %></h2>',
    '<%- link %> 重置密码',
    ' 或者在拷贝以下链接，在浏览器中打开',
    ' <%- url%>',
    '<p>The <%- appname %> Team</p>'
  ].join('<br />'),
  linkText: '点击这里'
};
// obj需要提供appname, username, url
var sendTemplateEmail = exports.sendTemplateEmail=function(to,tmpName,obj,cb){
  fs.readFile(path.join(__dirname, 'emailBoiler.html'), 'utf8', function(err, data) {
    if (err) return cb(err);
    var tmp = templates[tmpName];
    var locals = {
      title: '',
      content: tmp.text
    };

    var html = ejs.render(data, locals);
    obj.link = '<a href="' + obj.url + '">' + tmp.linkText + '</a>';
    html = ejs.render(html,obj);

    var subject = ejs.render(tmp.subject,obj);

    sendEmail(to,subject,html,cb);
  });
};
