var isweixin = isWeixin();
var urlParams = $.getUrlParams(window.location.search);

var openid = '';
var order_detail_info ="";
var shipment_code = urlParams.shipment_code;
var fromtype=urlParams.from;
if(fromtype=='wx'){
    $.sendData('shipment', 'updateIsReader', {shipment_code: shipment_code}, 'Shipment', function(data){
    });
}
//加载数据函数
function getShipment(openid, shipment_code) {
    $.sendData('Shipment', 'getShipmentInfo', {openid: openid, shipment_code: shipment_code}, 'Shipment', function(data){
        $('#shipment_id').val(data.id);
        $('#carnum').val(data.carnum);
        var shipments = data;
        $('.weui-infinite-scroll').removeClass('hide');
        var html = '';
        html+='<p class="changeui-list-title" style="margin-bottom:10px;">'+data.fromlocation+' - '+data.tolocation+'</p>';
        html+='<div class="weui-flex">';
        html+='<div class="weui-flex__item">';
        html+='<div class="weui-flex changeui-list-inner-item">';
        html+='<div class="weui-flex__item text-right text-right-item">目的地：</div>';
        html+='<div class="weui-flex__item">'+data.tolocation+'</div>';
        html+='</div>';
        html+='</div>';
        html+='<div class="weui-flex__item">';
        html+='<div class="weui-flex changeui-list-inner-item">';
        html+='<div class="weui-flex__item text-right text-right-item">途径地：</div>';
        html+='<div class="weui-flex__item">暂无</div>';
        html+='</div>';
        html+='</div>';
        html+='</div>';
        html+='<div class="weui-flex">';
        html+='<div class="weui-flex__item">';
        html+='<div class="weui-flex changeui-list-inner-item">';
        html+='<div class="weui-flex__item text-right text-right-item">运输方式：</div>';
        html+='<div class="weui-flex__item">'+data.shipment_method+'</div>';
        html+='</div>';
        html+='</div>';
        html+='<div class="weui-flex__item">';
        html+='<div class="weui-flex changeui-list-inner-item">';
        html+='<div class="weui-flex__item text-right text-right-item"></div>';
        html+='<div class="weui-flex__item"></div>';
        html+='</div>';
        html+='</div>';
        html+='</div>';

        html+='<div class="changeui-list-inner-item single">';
        html+='<span class="text-right text-right-item item">运单信息：</span>';
        html+='<span class="single-right-item item">'+data.shipment_code+'</span>';
        html+='</div>';

        //html+='<div class="changeui-list-inner-item single">';
        //html+='<span class="text-right text-right-item item">货品信息：</span>';
        //
        //$.each(data.order_detail,function(i,item){
        //    order_detail_info += item.product_name + item.quality +item.unit_name +'/' ;
        //});
        //html+='<span class="single-right-item item"><span class="open-dia-mark weui-cell_access"><span onclick="show_detail()" style="width:150px;height:24px;display:inline-flex;overflow: hidden;">'+order_detail_info+'</span><span class="weui-cell__ft"></span></span></span>';
        //html+='</div>';

        html+='<div class="weui-flex">';
        html+='<div class="weui-flex__item">';
        html+='<div class="weui-flex changeui-list-inner-item">';
        html+='<div class="weui-flex__item text-right text-right-item">重量：</div>';
        html+='<div class="weui-flex__item">'+data.weight+'吨</div>';
        html+='</div>';
        html+='</div>';
        html+='<div class="weui-flex__item">';
        html+='<div class="weui-flex changeui-list-inner-item">';
        html+='<div class="weui-flex__item text-right text-right-item">体积：</div>';
        html+='<div class="weui-flex__item">'+data.volume+'立方米</div>';
        html+='</div>';
        html+='</div>';
        html+='</div>';

        html+='<div class="changeui-list-inner-item single">';
        html+='<span class="text-right text-right-item item">计划发车：</span>';
        html+='<span class="single-right-item item">'+data.plan_leave_time+'</span>';
        html+='</div>';


        html+='<div class="changeui-list-inner-item single">';
        html+='<span class="text-right text-right-item item">基地位置：</span>';
        html+='<span class="single-right-item item"><a href="http://api.map.baidu.com/marker?location='+data.lat+','+data.lng+'&title='+data.name+'&content='+data.name+'&output=html " target="_blank">'+data.address+'</a></span>';
        html+='</div>';

        html+='</div>';

        /*html+='<div class="changeui-signle-line" style="margin-left:10px; margin-right:10px;"></div>';
        html+='<div class="weui-flex">';
        html+='<div class="weui-flex__item">';
        html+='<div class="text-center">';
        html+='<i class="c-iconfont track-ico">&#xe60d;</i>';
        html+='<span class="vl-m"><a href="scan_check.html?openid=' + openid + '&scan_type=in'+ '&shipment_code=' + data.shipment_code + '">进门扫码</a></span>';
        html+='</div>';
        html+='</div>';
        html+='<div class="weui-flex__item">';
        html+='<div class="text-center">';
        html+='<i class="c-iconfont detail-ico" style="color: #FF9234;">&#xe60d;</i>';
        html+='<span class="vl-m"><a href="scan_check.html?openid=' + openid + '&scan_type=out'+ '&shipment_code=' + data.shipment_code + '">出门扫码</a></span>';
        html+='</div>';
        html+='</div>';
        html+='</div>';*/

        $('#pickUpInfo_id').prepend(html);
        
        var _o_html = '';
        $.each(data._orders.data.result, function (i, item) {
        	_o_html += '<p class="changeui-list-title"><em class="ci-font-ico">' + (i + 1) + '</em>' + item.to_address  +'</p><p class="changeui-list-title">'+item.order_quality+'件&nbsp;&nbsp;'+item.order_weight+'吨&nbsp;&nbsp;'+item.order_volume+'方'+ '</p>'+"\n";
		});
        $('#tblMain').append(_o_html);

    });
}
$.getUserInfo('shipment',0,function(){
    //微信ID
    openid = userInfo.openid;
    if(userInfo.user_type != 3 && userInfo.user_type != 4){
        $.error('无法取得用户信息');
        return false;
    }
    if(userInfo.user_type==3){
        $('#driver').show();
    }
    if(userInfo.user_type == 4){
        $('#carrier').show();
    }
    getShipment(openid, shipment_code);

});
function show_detail(){
    var  $androidDialog2 = $('#androidDialog2');
    $('#androidDialog2').show(true);
    $('#order_detail').html(order_detail_info);
    $androidDialog2.fadeIn(200);
}
function closeDiv(){
    $('#androidDialog2').hide(true);
}
//微信扫码
//var urlParam = $.getUrlParams();

if(shipment_code == undefined || shipment_code ==''){
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
            'getLocation'
        ]
    });
    wx.ready(function(){
        //获取定位
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
                });
            }
        });
        //扫码操作
        $(".weixin_scan").on('click', function(){
            $("#scan_type_id").val($(this).attr("scan_type"));
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    //二维码图片解析后的地址
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    $('#scanResult').val(result);
                    //$('#is_scan').text('已扫描');
                    verify();
                }
            });
        });
    });

});

//提交验证
function verify(){
    var scanResult = $('#scanResult').val();
    var scanType = $('#scan_type_id').val();
    var lng =$('#lng').val();
    var lat =$('#lat').val();
    var address = $('#address').val();
    var shipment_id = $('#shipment_id').val();
    var carnum = $('#carnum').val();
    if(scanResult !=''){
        $.sendData('shipment','checkScan',{openid:userInfo.openid,scanResult:scanResult,scanType:scanType,code:shipment_code,lng:lng,lat:lat,address:address,carnum:carnum,shipment_id:shipment_id,carnum:carnum},'',function(json){
            if(parseInt(json.code) == 1){
                if(scanType == 'in') {
                    $('#check_result').text('验证成功');
                    var desc = json.warehouseName + '欢迎您!您前面还有' + json.shipmentCount + '个车等待出厂,您的车牌号是'+json.carnum;
                    $('#result_image').attr('src','../jquery_weui/images/smiling_face.png');
                    $('#check_result_desc').text(desc);
                }else{
                    $('#check_result').text('验证成功');
                    var desc = '提醒：运输途中请注意安全，祝你安全抵达目的地!您的车牌号是'+json.carnum;
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
}

function showTooltips(){
    var shipment_id=$('#shipment_id').val();
     //判断运单状态，不是所有运单都可以派车
    $.sendData('shipment', 'checkTenderStatus', {shipmentId:shipment_id},'shipment',function(json){
       if(json.status >=7){
            $.alert ('此运单状态已不可指定车辆');
            return false;
        }else{
            $.sendData('tender', 'checkShipment', {openid:openid,shipment_id:shipment_id}, 'tender', function(data){
                   if(data.code==0){
                        if(data.data.status==3){
                            window.location.href = "tenderConfirm.html?tender_id="+data.data.tender_id+"&openid="+openid+"&tender_quote_id="+data.data.id;
                        }else if(data.data.status==1||data.data.status==2||data.data.status==4){
                            $.error('未中标不能订车');
                            return false;
                        }

                   }else if(data.code==1){
                        $.error(data.msg);
                        return false;
                   }else if(data.code==2){
                        window.location.href = "holdcar.html?shipment_code="+shipment_code+"&openid="+openid;
                   }
            }); 
        }
    });
             
    
}
