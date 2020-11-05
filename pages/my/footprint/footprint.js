const http = require('../../../utils/http.js');  // 引入
const dialog = require('../../../utils/dialog.js'); // 引入
var app = getApp();
Page({
  data: {
    footprintList: [],
  },
  getFootprintList() {
    let that = this;
    http('/api-web/footprint/getFootprint/'+app.globalData.userInfo.id, null, null, 'post').then(res => {
      if (res.success) {
        console.log(res.object)
        that.setData({
          footprintList: res.object
        })
      }
    })
  },
  deleteItem (event){
    let that = this;
    let footprint = event.currentTarget.dataset.footprint;
    var touchTime = that.data.touch_end - that.data.touch_start;
    console.log(touchTime);
    //如果按下时间大于350为长按  
    if (touchTime > 350) {
      wx.showModal({
        title: '',
        content: '要删除所选足迹？',
        success: function (res) {
          if (res.confirm) {
            var param = {
              customerId: app.globalData.userInfo.id,
              goodsId: footprint.goodsId,
              type: footprint.type
            }
            http('/api-web/footprint/deleteFootprint/', param, null, 'post').then(res => {
              if (res.success) {
                dialog.showToast('删除成功','success', '', 2000);
                that.getFootprintList();
              }
            })
          }
        }
      });
    } else {
      wx.navigateTo({
        url: '/pages/goods/goods?id=' + footprint.goodsId,
      });
    }
    
  },
  onLoad: function (options) {
    this.getFootprintList();
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
  },
  //按下事件开始  
  touchStart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
  },
  //按下事件结束  
  touchEnd: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
  }, 
})