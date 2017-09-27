var isweixin = isWeixin();
/*if (isweixin){
    getUserInfo('shipment',1);
}*/
var openid='';
$.getUserInfo('shipment',0,function(){
     openid = userInfo.openid;
    if(userInfo.user_type!=3){
        $('.container').hide();
        $.alert('用户信息错误');
        return false;
    }
    getOrderList(openid);
});
if (isweixin) {
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
		                    var address;
		                    var str=data.address;
		                    var w=str.indexOf('市')+1;
		                    address=str.substring(0,w);
		                    $('#address').val(address);
                    });
                }
            });
        });

    });
} else {
    //need support https
    navigator.geolocation.getCurrentPosition(function (position) {
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;
        $('#lng').val(longitude);
        $('#lat').val(latitude);
        $.sendData('api','getAddressByLngLat',{lng:longitude,lat:latitude},'shipment',function(data){
            if(data.address){
                var address;
                var str=data.address;
                var w=str.indexOf('市')+1;
                address=str.substring(0,w);
                $('#address').val(address);
            }
        });
    });
}
//获取url参数
var urlParam = $.getUrlParams(window.location.search);
function getOrderList(openid){
    $.sendData('shipment','applicationReceived',{openid:openid},'shipment',function(data){
        $('#consigneeList').html('');
        if(!jQuery.isEmptyObject(data)){
            $('#carnum').val(data[0].carnum);
            $('#order_code').val(data[0].order_code);
            $('#driver_name').val(data[0].driver_name);
            $('#shipment_id').val(data[0].shipment_id);
            $('#order_id').val(data[0].id);
            $.each(data, function(i, item) {
                var html = '';
                html += '<div class="changeui-weui-panel changeui-single-style">';
                html += '<div class="changui-checkbox-container text-center"><input id="'+item.id+'" value="'+item.id+'" type="checkbox" name="checkbox-inline" class="checkbox style-0"></div>';
                html +='<div class="changeui-list-item">';
                html +='<div class="changeui-list-inner-item">';
                html +='<span class="text-right text-right-item">订单号：</span>';
                html +='<span class="text-item">'+item.order_code+'</span>';
                html +='</div>';
                html +='<div class="changeui-list-inner-item">';
                html +='<span class="text-right text-right-item">收货人：</span>';
                html +='<span class="text-item">'+item.to_name+'</span>';
                html +='</div>';
                html +='<div class="changeui-list-inner-item">';
                html +='<span class="text-right text-right-item">电话：</span>';
                html +='<span class="text-item">'+item.to_phone+'</span>';
                html +='</div>';
                html +='<div class="changeui-list-inner-item">';
                html +='<span class="text-right text-right-item">地址：</span>';
                html +='<span class="text-item">'+item.to_address+'<i class="c-iconfont map-ico">&#xe600;</i></span>';
                html +='</div>';
                html +='</div>';
                html +='</div>';


                        $('#consigneeList').append(html);
                    });
        }else{
            $('#consigneeList').html('<div class="weui_cells_tips null-notice">暂无数据</div>');
        }
    });
}


//全选
$('#checkAll').on('change', function(){
	if($('#checkAll').prop('checked')){
		$('#consigneeList :checkbox').prop('checked',true);
	}else{
		$('#consigneeList :checkbox').attr('checked',false);
	}
});

//获取所要操作的order_id
function getRowIds() {
    var id = '';
    $('#consigneeList input:checkbox[class="checkbox style-0"]:checked').each(function() {
        if(id==""){
            id += $(this).val();
        }else{
            id += ',' + $(this).val();
        }
    });
    return id;
}

//
function apply(){
	var carnum=$('#carnum').val();
	var address= $('#address').val();
    var order_code=$('#order_code').val();
    var driver_name=$('#driver_name').val();
    var order_id=$('#order_id').val();
    var lng=$('#lng').val();
    var lat=$('#lat').val();
    /*if(address == ''){
        alert('正在获取您的地理位置请稍后再试');
        return false;
    }*/
    
    var shipment_id=$('#shipment_id').val();
	var id = getRowIds();
    if(!id || id == ''){
        $.alert('请选择收货人!');
        return false;
    }
    $.sendData('shipment','sendMsgByOpenid',{order_id:id,address:address,carnum:carnum,shipment_id:shipment_id,driver_name:driver_name,lng:lng,lat:lat,openid:openid},'consign',function(data){
        if(data.code==0){
            
            $('.weui-dialog__bd').html('<div class="dia-font-area"><i class="weui-icon-success weui-icon_msg font-item"></i></div>'+'申请签收成功');
           $('.js_dialog').show();
        }else{
            $('.weui-dialog__bd').html('<div class="dia-font-area"><i class="weui-icon-success weui-icon_msg font-item"></i></div>'+'申请签收失败');
            $('.js_dialog').show();
        }
        
    });
}

function iKnow(){
    $('.js_dialog').hide();
}