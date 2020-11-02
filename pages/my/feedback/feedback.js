
var app = getApp();

Page({
  data: {
    array: ['请选择反馈类型', '商品相关', '物流状况', '客户服务', '优惠活动', '功能异常', '产品建议', '其他'],
    type: '',
    index: 0,
    inputTxt: '',
    content: '',
    contentLen: 0
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      type: this.data.array[e.detail.value]
    })
  },
  setMobileNumber: function(e) {
    this.setData({
      //更新页面input框显示
      inputTxt: e.detail.value
    })
  },
  clearMobileNumber: function(){
    this.setData({
      //更新页面input框显示
      inputTxt: ''
    })
  },
  /*动态计算能够输入的字数*/
  checkLength: function(e) {
    var that = this
    var maxChars = 500
    if (e.detail.value.length > maxChars) {
      e.detail.value = e.detail.value.substring(0, maxChars)
    }
    that.setData({
      content: e.detail.value,
      contentLen: e.detail.value.length
    })
  },
  submitFeed: function() {
    console.log(this.data)
  },
  onLoad: function (options) {
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  }
})