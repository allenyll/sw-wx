const http = require('../../utils/http.js')  // 引入
const dialog = require('../../utils/dialog.js')  // 引入

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notices: [],
    banner: [],
    newGoods: [],
    hotGoods: [],
    navList: [],
    swiperCurrent: 0,
    showBack: false
  },

  //事件处理函数
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  tapBanner: function (e) {
    if (e.currentTarget.dataset.param == '') {
      return;
    }
    wx.navigateTo({
      url: param + "?id=" + e.currentTarget.dataset.id
    })
  },

  getData: async function() {
    var that = this
    var param = {
      adType: 'SW2601',
      msgType: 'SW2702'
    };
    // 通知
    await that.getMessages(param)
    // 轮播
    await that.getAds(param)
    // 新品
    await that.getNewGoods(param)
    // 热卖
    await that.getHotGoods(param)
    // 加载商品分类
    await that.getCategory(param)
  },

  getMessages: function(param) {
    var that = this
    return new Promise((resolve, reject) => {
      http('/api-web/message/getMessageListByType', param, '', 'post').then(res => {
        if (res.code == '100000') {
          that.setData({
            notices: res.data.messageList
          })
        } else {
          dialog.dialog('错误', '获取通知失败，请联系管理员!', false, '确定');
        }
        resolve(res)
      });
    })
  },

  getAds: function(param) {
    var that = this
    return new Promise((resolve, reject) => {
      http('/api-web/ad/getAdList', param, '', 'post').then(res => {
        if (res.code == '100000') {
          that.setData({
            banner: res.data.adList
          })
        } else {
          dialog.dialog('错误', '获取轮播图失败，请联系管理员!', false, '确定');
        }
        resolve(res)
      });
    })
  },

  getNewGoods: function(param) {
    var that = this
    return new Promise((resolve, reject) => {
      http('/api-web/goods/getGoodsListByType', {goodsType: 'new'}, '', 'post').then(res => { 
        if (res.code == '100000') { 
          that.setData({ 
            newGoods: res.data.goodsList 
          }) 
        } else { 
          dialog.dialog('错误', '获取新品失败，请联系管理员!', false, '确定'); 
        }
        resolve(res)
      })
    })
  },

  getHotGoods: function(param) {
    var that = this
    return new Promise((resolve, reject) => {
      http('/api-web/goods/getGoodsListByType', { goodsType: 'hot' }, '', 'post').then(res => {
        if (res.code == '100000') {
          that.setData({
            hotGoods: res.data.goodsList
          })
          console.log(that.data.hotGoods)
        } else {
          dialog.dialog('错误', '获取新品失败，请联系管理员!', false, '确定');
        }
        resolve(res)
      });
    })
  },

  getCategory: function(param) {
    var that = this
    return new Promise((resolve, reject) => {
      http('/api-web/category/tree', '', '', 'GET').then(res => {
        if (res.code == '100000') {
          that.setData({
            navList: res.data.list
          });
        }
        resolve(res)
      });
    })
  },

  clickCategory: function (event) {
    var id = event.currentTarget.dataset.id
    app.globalData.classId = id
    wx.switchTab({
      url: '/pages/class/class',
    })
  },

  /**
   * 获取滚动条当前位置
   * @param {*} e 
   */
  onPageScroll: function(e){
    if (e.scrollTop > 400) {
      this.setData({
        showBack: true
      })
    } else {
      this.setData({
        showBack: false
      })
    }
  },
  /**
   * 隐藏返回顶部按钮
   * @param e 
   */
  showBack: function(e) {
    console.log(e)
    this.setData({
      showBack: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navHeight: app.globalData.navHeight
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.getData();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
     // 停止下拉动作
     wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'SNU CHIC',
      desc: 'SNU CHIC',
      path: '/pages/index/index'
    }
  }
})