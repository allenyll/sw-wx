var amapFile = require('../../../lib/amap-wx.js');  //引入高德js
var config = require('../../../lib/config.js');      //引用我们的配置文件
var markersData = [];
Page({
  data: {
    markers: [],
    latitude: 32.026241,
    longitude: 118.798458,
    textData: {}
  },
  onLoad: function () {
    var that = this;
    var key = config.config.mapKey;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getRegeo({
      iconPath: "../../images/marker.png",
      iconWidth: 32,
      iconHeight: 32,
      success: function (data) {
        console.log(data);
        var marker = [{
          id: data[0].id,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          iconPath: data[0].iconPath,
          width: data[0].width,
          height: data[0].height
        }]
        that.setData({
          markers: marker
        });
        that.setData({
          latitude: data[0].latitude
        });
        that.setData({
          longitude: data[0].longitude
        });
        that.setData({
          textData: {
            name: data[0].name,
            desc: data[0].desc
          }
        })
      },
      fail: function(info){
        wx.showModal({title:info.errMsg})
      }
    })
  }
})
