//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    canIuse: wx.canIUse("openBluetoothAdapter"),
    status:"",
    searching:"",
    message:"",
    connectedDeviceId:"",
    devices:[]
  },
  onLoad: function () {
    var _this = this;
    if (this.data.canIuse){
      wx.openBluetoothAdapter(function(res){
        wx.showToast({
          title: '蓝牙适配器启动',
        });
      })
    }else{
      wx.showModal({
        title: 'Tip',
        content: '当前微信版本过低，请升级微信后重试！',
      })
    }

    wx.onBluetoothAdapterStateChange(function (res) {
      _this.setData({
        status: res.available?"可用":"不可用",
        searching:res.discovering?"正在搜索":"已停止搜索"
      })
    });
    wx.onBeaconUpdate(function (beacons){
      console.log(res)
    });
    wx.onBeaconServiceChange(function (res){
      console.log(res)
    })

  },
  startBluetooth:function(){  
    var _this=this;
    wx.openBluetoothAdapter({
      success: function(res) {
        _this.setData({
          "message": "初始化蓝牙适配器成功！"+JSON.stringify(res)
        });
        wx.showToast({
          title: '蓝牙适配器初始化成功',
        })
      },
      fail:function(res){}
    })
  },
  closeBluetooth(){
    wx.closeBluetoothAdapter({
      success: function(res) {
        wx.showToast({
          title: '蓝牙适配器关闭',
        })
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
  getBluetoothState(){
    var _this=this;
    wx.getBluetoothAdapterState({
      success: function(res) {
        _this.setData({
          status: res.available ? "可用" : "不可用",
          searching: res.discovering ? "正在搜索" : "已停止搜索"
        })
      },
      fail: function(res){
        console.log(res)
      }
    })
  },
  startBluetoothDiscovery(){
    var _this=this;
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey:false,
      success: function(res) {
        _this.setData({
          "message":"搜索设备"
        });
        setTimeout(function(){
          wx.getBluetoothDevices({
            success: function (res) {
              console.log(res);
              _this.setData({
                message: "搜索到设备",
                devices: res.devices,
              });
            }
          })
        },1500);
        wx.onBluetoothDeviceFound(function (res) {
          var isnotExist = true;
          var id='';
          if (res.deviceId) {
            for (var i = 0; i < _this.data.devices.length; i++) {
              if (res.deviceId == _this.data.devices[i].deviceId) {
                isnotExist = false
              }
            }
            if (isnotExist)
              id = res.deviceId;
              _this.data.devices.push(res)
          }else if (res.devices) {
            for (var i = 0; i < _this.data.devices.length; i++) {
              if (res.devices[0].deviceId == _this.data.devices[i].deviceId) {
                isnotExist = false
              }
            }
            if (isnotExist)
              id = res.devices[0].deviceId;
              _this.data.devices.push(res.devices[0])
          }else if (res[0]) {
            for (var i = 0; i < _this.data.devices.length; i++) {
              if (res[0].deviceId == _this.data.devices[i].deviceId) {
                isnotExist = false
              }
            }
            if (isnotExist)
              id = res[0].deviceId;
              _this.data.devices.push(res[0])
          }
          _this.setData({
            message: "附近设备数:" + _this.data.devices.length + ";搜索到新设备" + JSON.stringify(id),
            devices: _this.data.devices,
          });
          console.log(_this.data.devices)
        })
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
  stopBluetoothDiscovery(){
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
        wx.showToast({
          title: '已停止搜索',
        })
      },
    })
  },
  getBluetoothDevices:function(){
    var _this=this;
    wx.getBluetoothDevices({
      success:function(res){
        console.log(res);
        _this.setData({
          message:"搜索设备",
          devices:res.devices,
        });
      }
    })
  },
  getConnectedBluetoothDevices(){
    wx.getConnectedBluetoothDevices({
      success: function(res) {
        console.log(res)
      },
    })
  },
  linkTo(e){
    var _this=this;
    wx.createBLEConnection({
      deviceId: e.currentTarget.id,
      success: function(res) {
        console.log(res);
        _this.setData({
          "connectedDeviceId": e.currentTarget.id,
          "message": "已连接到：" + e.currentTarget.id
        })
      },
    })
    console.log(_this.data.connectedDeviceId);  
  },
  setScreenBrightness(){
    wx.setScreenBrightness({
      value: 0.2,
      success:function(res){
        console.log(res);
      }
    })
  },
  startBeaconDiscovery(){
    wx.startBeaconDiscovery({
      uuids: ["BB053A35-4E68-E5A6-6F6B-37A557FB2911"],
      success:function(res){
        console.log(res)
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
  stopBeaconDiscovery(){
    wx.stopBeaconDiscovery({
      success:function(res){
        console.log(res)
      }
    })
  },
  getBeacons(){
    wx.getBeacons({
      success:function(res){
        console.log(res);
      }
    })
  }
})
