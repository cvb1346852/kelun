var isweixin = isWeixin();
var urlParam = $.getUrlParams();
var openid='';
//翻页标记
var curPageNo = 1;
var pageSize = 10;
//加载标记
var loading = false;
$.getUserInfo('shipment',1,function(){
    openid = userInfo.openid;
    if(userInfo.user_type!=3 && userInfo.user_type!=4){
        $('.body').hide();
        $.alert('用户信息错误');
        return false;
    }
});
//获取微信js签名
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
                        $('#address_text').html(address);
                        getSs(urlParam);  
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
            var addr;
            var str=data.address;
            var w=str.indexOf('市')+1;
            addr=str.substring(0,w);
            $('#address').val(addr);
            $('#address_text').html(addr);
            getSs(urlParam.openid,curPageNo,pageSize);
        });
    });
}

//滚动加载
$('.container').infinite().on("infinite", function() {
    if(loading) return;
    //翻页数据加载
    loading = true;
    getSs(urlParam.openid,curPageNo,pageSize);
});
getSs(urlParam.openid,curPageNo,pageSize);
function getSs(openid,pageNo,pageSize){
 
    $.sendData('user','getUserType',{openid:openid},'shipment',function(data){
    if(data.user_type == '3'){
        $('#driver').show();
            var address=$('#address').val();
            $('#table').html('');
            $('#oldtable').html('');
            getOrderSource(address,pageNo,pageSize);
            //获取当前货源
            /*$.sendData('shipment','getOrderSource',[{name:"address",value:address}],'shipment',function(res){
                if(!jQuery.isEmptyObject(res)){
                    $.each(res, function(i, item) {
                                var html = '';
                                html += '<div class="weui-row weui-no-gutter" onclick="getOrder('+item.id+')">';
                                html += '<div class="weui-col-20">'+item.path+'</div>';
                                html += '<div class="weui-col-20">'+item.shipment_method+'</div>';
                                html += '<div class="weui-col-15">'+item.quality+'</div>';
                                html += '<div class="weui-col-15">'+item.weight+'</div>';

                                html += '<div class="weui-col-30" style="width: 30%">'+item.plan_leave_time+'</div>';
                                html += '</div>';

                                $('#table').append(html);
                            });
                 }else{
                    $('#table').html('<div style="text-align:center;height:60px;line-height:60px;color:#ccc;font-size:14px;">暂无数据</div>');
                 }

            });*/
            //获取历史货源
           /* $.sendData('shipment','getOldOrderSource',[{name:"address",value:address}],'shipment',function(res){
                if(!jQuery.isEmptyObject(res)){
                    $.each(res, function(i, item) {
                                var html = '';

                                html += '<div class="weui-row weui-no-gutter">';
                                html += '<div class="weui-col-20">'+item.path+'</div>';
                                html += '<div class="weui-col-20">'+item.shipment_method+'</div>';
                                html += '<div class="weui-col-15">'+item.quality+'</div>';
                                html += '<div class="weui-col-15">'+item.weight+'</div>';

                                html += '<div class="weui-col-30" style="width: 30%">'+item.plan_leave_time+'</div>';
                                html += '</div>';

                                $('#oldtable').append(html);
                            });
                }else{
                    $('#oldtable').html('<div style="text-align:center;height:60px;line-height:60px;color:#ccc;font-size:14px;">暂无数据</div>');
                }

            }); */


    }else if(data.user_type==4){
        $('#carrier').show();
        $('#province').html('');
        $('#oldcarriertb').html('');
        //承运商获取货源信息
        $.sendData('shipment','getProvince',urlParam,'shipment',function(res){
            $('#province').html('');
            if(res){
                $.each(res, function(i, item) {
                    var html='';
                    html+='<option value="'+item.from_province+'">'+item.from_province+'</option>';
                    /*html+= '<a href="javascript:;" style="margin-left:10px;" class="weui_btn weui_btn_mini weui_btn_default" onclick="getprovince('+i+')" id="p'+i+'">'+item.from_province+'</a>'*/
                    $('#province').append(html);
                });
                var pro=$('#province option:selected').val();
                getSourceByProvince(pro,pageNo,pageSize);
            }
        });
        /*$.sendData('shipment','getOldCarrierSource',urlParam,'shipment',function(res){
            $.each(res, function(i, item) {
                var html='';
                html += '<div class="weui-row weui-no-gutter">';
                html += '<div class="weui-col-20">'+item.path+'</div>';
                html += '<div class="weui-col-20">'+item.shipment_method+'</div>';
                html += '<div class="weui-col-15">'+item.quality+'</div>';
                html += '<div class="weui-col-15">'+item.weight+'</div>';

                html += '<div class="weui-col-30" style="width:30%">'+item.plan_leave_time+'</div>';
                html += '</div>';

                $('#oldcarriertb').append(html);
            });
        });*/
    }
});
}
//司机获取当前省份货源
function getOrderSource(address,pageNo,pageSize){
    var pageNo = pageNo ? pageNo : 1;
    var pageSize = pageSize ? pageSize : 10;
    $.sendData('shipment','getOrderSource',[{name:"address",value:address}],'shipment',function(res){
        if(!jQuery.isEmptyObject(res)){
            curPageNo ++;
            $.each(res, function(i, item) {
                var html = '';
                html += '<div class="weui-row weui-no-gutter" onclick="getOrder('+item.id+')">';
                html += '<div class="weui-col-20">'+item.path+'</div>';
                html += '<div class="weui-col-20">'+item.shipment_method+'</div>';
                html += '<div class="weui-col-15">'+item.quality+'</div>';
                html += '<div class="weui-col-15">'+item.weight+'</div>';

                html += '<div class="weui-col-30" style="width: 30%">'+item.plan_leave_time+'</div>';
                html += '</div>';

                $('#table').append(html);
            });
        }else{
            $('#table').html('<div style="text-align:center;height:60px;line-height:60px;color:#ccc;font-size:14px;">暂无数据</div>');
        }

    });
}

function getprovince(i){
    $('#province a').css('background-color','');
    var province=$('#p'+i).html();
    $('#p'+i).css('background-color','#ccc');
    getSourceByProvince(province);

}
$('#province').change(function(){
    var province=$('#province option:selected').val();
    curPageNo=1;
    getSourceByProvince(province,curPageNo,pageSize);
});
//加载数据函数
function getSourceByProvince(province,PageNo,pageSize) {
    var pageNo = pageNo ? pageNo : 1;
    var pageSize = pageSize ? pageSize : 10;

    $('#carriertb').html('');
    //第一页先清除内容
    $.sendData('shipment', 'getSourceByProvince', {province:province,openid:openid,pageNo:pageNo,pageSize:pageSize}, 'Shipment', function(data){
        curPageNo ++;
        if(curPageNo>=5){
            cruPageNo=5;
        }
            $.each(data, function(i, item){
                var html = '';
                html += '<div class="weui-row weui-no-gutter" onclick="getOrderS('+item.id+')">';
                html += '<div class="weui-col-20">'+item.path+'</div>';
                html += '<div class="weui-col-20">'+item.shipment_method+'</div>';
                html += '<div class="weui-col-15">'+item.quality+'</div>';
                html += '<div class="weui-col-15">'+item.weight+'</div>';

                html += '<div class="weui-col-30" style="width:30%">'+item.plan_leave_time+'</div>';
                html += '</div>';

                $('#carriertb').append(html);
            }); 
    });
}

//司机获取货源详情
function getOrder(id){
    window.location.href = 'orderDetail.html?openid='+openid+'&id='+id;
}
//承运商获取货源详情
function getOrderS(id){
    window.location.href = 'carrier_orderDetail.html?openid='+openid+'&id='+id;
}