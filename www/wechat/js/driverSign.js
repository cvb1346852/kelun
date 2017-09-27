/**
 * Created by will_zhang on 12/22/2016.
 */
//获取用户openid
var openid;
$.getUserInfo('shipment',0,function(){
    //微信ID
    openid = userInfo.openid;
    if(userInfo.user_type != 3){
        $("#about").hide();
        $.alert("获取用户信息失败");
        return false;
    }else{
        getTrucks();

    }
});
$.openPopup('#full');
//获取微信js签名
var url = window.location.href;
function getTrucks(){
    $.sendData('wechat','getJsSignature',{url:url},'shipment',function(json){
        wx.config({
            debug: false,
            appId: json.appId,
            timestamp: json.timestamp,
            nonceStr: json.nonceStr,
            signature: json.signature,
            jsApiList: [
                'getLocation'
            ]
        });
        wx.ready(function(){
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    var speed = res.speed; // 速度，以米/每秒计
                    var accuracy = res.accuracy; // 位置精度
                    $('#lng').val(longitude);
                    $('#lat').val(latitude);
                    $.sendData('api','getAddressByLngLat',{lng:longitude,lat:latitude},'shipment',function(data){
                        $('#address').val(data.address);
                        driverSign();
                    });
                }
            });
        });
    });
}
function driverSign(){
    var data = {};
    data.phone = userInfo.phone;
    data.address = $('#address').val();
    data.lng = $('#lng').val();
    data.lat = $('#lat').val();
    address =  $('#address').val();
    var str;
    if(address.indexOf("市") > 0){
         str = address.substr(0,address.indexOf("市")+1);
    }else if(address.indexOf("区") > 0){
        str = address.substr(0,address.indexOf("区")+1);
    }
    $("#urlInfo").html("正在为您跳转"+str+"货源列表");
    //$("#urlInfo").html("正在为您跳转本地货源列表");
    $.sendData('truck_source','driverSign',data,'',function(json){
        setTimeout(function (){gotoUrl()},1000);
    });
}
function gotoUrl(){
    window.location.href = "orderSource.html?openid="+openid ;
}