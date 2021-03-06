var app = getApp();
const http = require('../../utils/http.js')  // 引入
const dialog = require('../../utils/dialog.js')  // 引入

Page({
  data: {
    navList: [],
    categoryList: [],
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    goodsCount: 0,
    scrollHeight: 0,
    classId: ''
  },
  onLoad: function (options) {
    this.setData({ 
      navHeight: app.globalData.navHeight
    })
  },

  onPullDownRefresh() {  
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    // 增加下拉刷新数据的功能
    var self = this;
    this.getCategory();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  getCategory: function () {
    var that = this
    var param = {}
    wx.showLoading({
      title: '加载中...',
    });
    // 加载商品分类
    http('/api-web/category/tree', param, '', 'GET').then(res => {
      if (res.code == '100000') {
        var list = res.data.list;
        if (that.data.classId) {
          for (var i=0; i<list.length; i++) {
            if (list[i].id === that.data.classId) {
              that.setData({
                navList: res.data.list,
                currentCategory: list[i]
              });
            }
          }
        } else {
          that.setData({
            navList: res.data.list,
            currentCategory: res.data.list[0]
          });
        }
        wx.hideLoading();
      } else {
        wx.hideLoading();
      }
    });
  },
  getCurrentCategory: function (id) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    http('/api-web/category/'+id, '', '', 'get')
      .then(function (res) {
        that.setData({
          currentCategory: res.data.tree[0]
        });
        wx.hideLoading();
      });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.setData({ 
      classId: app.globalData.classId
    })
    this.getCategory();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  clickCategory: function (event) {
    console.log(event);
    var that = this;
    var currentTarget = event.currentTarget;
    if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
      return false;
    }

    this.getCurrentCategory(event.currentTarget.dataset.id);
  }
})

