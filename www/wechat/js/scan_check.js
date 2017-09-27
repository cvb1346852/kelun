//获取用户信息,并且初始化菜单 参数1 微信号版本 物流版-shipment，货主版-consign，参数2 是否初始化下方菜单1-是，0-否
$.getUserInfo('shipment',1,function(){

});
var urlParam = $.getUrlParams();
if(urlParam.scan_type == undefined || urlParam.scan_type ==''){
    var scanType = 'in';
}else{
    var scanType = urlParam.scan_type;
}

if(urlParam.shipment_code == undefined || urlParam.shipment_code ==''){
    $.error('缺少参数:运单号');
}
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
        ]
    });
    wx.ready(function(){
        $('#submit').removeClass('weui_btn_default').removeClass('weui_btn_disabled').addClass('weui_btn_primary');
        $('#submit').removeAttr('disabled');
        //扫码操作
        $("#scan_button").on('click', function(){
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    //二维码图片解析后的地址
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    $('#scanResult').val(result);
                    $('#is_scan').text('已扫描');
                }
            });
        });
    });

});

//提交验证
$('#submit').on('click', function () {
    var scanResult = $('#scanResult').val();
    if(scanResult !=''){
        $.sendData('shipment','checkScan',{openid:userInfo.openid,scanResult:scanResult,scanType:scanType,code:urlParam.shipment_code},'',function(json){
            $('warehouseId').val('');
            $('#is_scan').text('点击扫描');
            if(parseInt(json.code) == 1){
                if(scanType == 'in') {
                    $('#check_result').text('验证成功');
                    var desc = json.warehouseName + '欢迎您!您前面还有' + json.shipmentCount+ '个车等待出厂,<br/>您的车牌号是'+json.carnum;
                    $('#result_image').attr('src','../jquery_weui/images/smiling_face.png');
                    $('#check_result_desc').text(desc);
                }else{
                    $('#check_result').text('验证成功');
                    var desc = '提醒：运输途中请注意安全，祝你安全抵达目的地!<br/>您的车牌号是'+json.carnum;
                    $('#check_result_desc').text(desc);
                }
            }else{
                $('#check_result').text('验证失败');
                $('#check_result_desc').text('您未有任务在该区域，请查证后在扫描');
                $('#result_image').attr('src','../jquery_weui/images/sad_face.png');
            }
            $.openPopup('#full');
        });
    }else{
        $.warn('请扫描二维码');
    }


});
