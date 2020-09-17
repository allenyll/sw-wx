const http = require('/http.js')  // 引入
const dialog = require('/dialog.js')  // 引入

function wxpay(app, money, orderId, redirectUrl, type) {
  let remark = "在线充值";
  let nextAction = {};
  let transactionId = '';
  if (orderId != 0) {
    remark = "支付订单 ：" + orderId;
    console.log(orderId)
  }
  wx.request({
    url: app.globalData.baseUrl + '/api-pay/pay/createUnifiedOrder',
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // 当method 为POST 时 设置以下 的header 
    header: { 
      'Authorization': app.globalData.bearer + wx.getStorageSync('token'),
      'content-type': 'application/x-www-form-urlencoded',
      'login-type': 'wx' 
      },
    data: {
      token: wx.getStorageSync('token'),
      amount: money,
      remark: remark,
      payName: "在线支付",
      nextAction: nextAction,
      openid: wx.getStorageSync('openid'),
      customerId: app.globalData.userInfo.pkCustomerId,
      orderId: orderId
    },
    //method:'POST',
    success: function (res) {
      if (res.data.code == '100000') {
        transactionId = res.data.transaction_id
        // 再次签名
        wx.request({
          url: app.globalData.baseUrl + '/api-pay/pay/sign',
          method: 'POST',
          header: { 
            'Authorization': app.globalData.bearer + wx.getStorageSync('token'),
            'content-type': 'application/x-www-form-urlencoded',
            'login-type': 'wx' 
          },
          data: {
            prepayId: res.data.prepayId
          },
          success: function(res){
            if(res.data.sign != ''){
              // 发起支付
              wx.requestPayment({
                timeStamp: res.data.timeStamp,
                nonceStr: res.data.nonceStr,
                package: res.data.package,
                signType: 'MD5',
                paySign: res.data.sign,
                fail: function (res) {
                  if ('order' == type) {
                    // 支付取消或者失败
                    // 将订单放入消息队列，定时取消未支付订单
                    const _param = {
                      orderId: orderId
                    }
                    http('/api-order/order/sendMessage', _param, '', 'post').then(_res => {
                      if (_res.code == '100000') {
                        if (redirectUrl != '') {
                          wx.redirectTo({
                            url: redirectUrl + '?id='+ escape(app.globalData.userInfo.pkCustomerId)
                          });
                        }
                      }
                    })
                  }
                  if (res.errMsg == 'requestPayment:fail cancel') {
                    dialog.dialog('提示', '您取消了支付', false, '确定');
                  } else {
                    dialog.dialog('提示', res.errMsg, false, '确定');
                  }
                },
                success: function () {
                  wx.showToast({ title: '支付成功' })
                  // 保存金额到用户账户中
                  if('charge' == type) {
                    const param = {
                      openid: wx.getStorageSync('openid'),
                      amount: money,
                      customerId: app.globalData.userInfo.pkCustomerId,
                      remark: remark
                    }
                    http('/api-member/customerBalance/updateBalance', param, '', 'post').then(res => {       
                      // 更新支付记录状态为成功
                      if(res.code == '100000'){
                        wx.redirectTo({
                          url: redirectUrl
                        });
                        // const _param = {
                        //   transactionId: transactionId
                        // }
                        // http('/api-pay/pay/updateStatus', _param, '', 'post').then(res => {
                        //   wx.redirectTo({
                        //     url: redirectUrl
                        //   });
                        // })
                      }
                    })
                  }else{
                    const _param = {
                      transactionId: transactionId,
                      type: type,
                      orderId: orderId
                    }
                    http('/api-pay/pay/updateStatus', _param, '', 'post').then(res =>                     {
                      wx.redirectTo({
                        url: redirectUrl + '?id='+ escape(app.globalData.userInfo.pkCustomerId)
                      });
                    })
                  }
                }
              })
            }
          }
        })
        
      } else {
        wx.showToast({ title: '服务器忙' + res.data.code + res.data.msg })
      }
    }
  })
}

module.exports = {
  wxpay: wxpay
}
