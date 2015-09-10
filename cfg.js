
module.exports = {
  cls:{},
  logger:{},
  email:{
    routes:{
      signUp:'/regist',
      verify:'/verify',
      reset:'/forgot-password',
      verifyReset:'/verifyReset'
    },
    urlSent:{// 发送到邮件使用的路由
      signUp:'/verify',
      reset:'/verifyReset'
    },
    token:{
      expire:'1 day'
    },
    host:'http://localhost:4000'
  },
  cell:{
    routes:{
      signUp:'/registSMS',
      reset:'/forgotPwSMS'
    },
    token:{
      resendInterval:'60 s',
      expire:'10 min'
    },
    SMS:{
      server:"https://sandboxapp.cloopen.com",
      port:"8883",
      version:"2013-12-26",
      timeFmt:"YYYYMMDDHHmmss",
      accountSid:"aaf98f894dae9c16014db3891fc3045c",
      accountToken:"8a0d3b22dbcf4ed3848c837c7367179a",
      appId:"aaf98f894dae9c16014db3899afa045e",
      appToken:"99c4ba07c862cff55250ecb31af13cb9",
      codeLen:6,
      func:"SMS",
      funcDes:"TemplateSMS",
      templates:{
        code:'1'
      }
    }
  },
  coupon:{
    resendInterval: '60 s',
    sendNum: 3
  }
};
