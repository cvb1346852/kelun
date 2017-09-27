//获取用户信息,并且初始化菜单 参数1 微信号版本 物流版-shipment，货主版-consign，参数2 是否初始化下方菜单1-是，0-否
/*$.getUserInfo('shipment', 1, function () {

});*/
//获取微信js签名
var url = window.location.href;
$.sendData('wechat','getJsSignature',{url:url},'shipment',function(json){
    wx.config({
        debug: false,
        appId: json.appId,
        timestamp: json.timestamp,
        nonceStr: json.nonceStr,
        signature: json.signature,
        jsApiList: [
            'scanQRCode',
            'closeWindow',
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
                $.sendData('wechat','getAddressByLngLat',{lng:longitude,lat:latitude},'shipment',function(data){
                    $('#address').val(data.address);
                    $('#time').val(data.time);
                });
            }
        });

        //扫码操作
        $("#scan_button").on('click', function(){
            subcontract();
        });
    });

});

function subcontract(){
    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
            
            //二维码图片解析后的地址
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            /*var order_code =result;*/
            var order_code_arr = result.split(',');
            var order_code = $('#order_code').val();
            var order_id=order_code_arr[1].replace(/\b(0+)/gi,"");
            if(order_code != ''){
                order_code += ','+order_id;
            }else{
                order_code +=order_id;
            }
            $('#order_code').val(order_code);
            subcontract();
        }
    });

}
//提交验证
$('#submit').on('click', function () {
    var order_code = $('#order_code').val();
    var data = {};
    //data.openid = userInfo.openid;
    data.order_code = order_code;
    data.address = $('#address').val();
    data.lng = $('#lng').val();
    data.lat = $('#lat').val();

    if(order_code !=''){
        $.sendData('order','subcontract',data,'',function(json){
            if(parseInt(json.code) == 0){
                $("#notice_msg").text('转包上报成功');
                $("#notice").fadeIn(200);
                $('#order_code').val('');
            }else{
                $("#notice_msg").text('转包上报失败:'+json.message);
                $("#notice").fadeIn(200);
            }
        });
    }else{
        $("#notice_msg").text('请点击扫码按钮，扫描订单号');
        $("#notice").fadeIn(200);
    }

});

//提示框绑定渐出
$('.weui-dialog__ft').on('click', '.weui-dialog__btn', function(){
    $(this).parents('.js_dialog').fadeOut(200);
});
