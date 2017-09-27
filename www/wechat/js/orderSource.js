$('#getProvince').hide();
$('#address_text').hide();
var jdata=[];
var pro = '';
var isweixin = isWeixin();

//加载标记
var urlParam = $.getUrlParams();
var curPageNo = 1;
var pageSize = 10;
var loading = false;
var openid='';
$.getUserInfo('shipment',0,function(){
    openid = userInfo.openid;
    $('#user_type').val(userInfo.user_type);
    if(userInfo.user_type!=3 && userInfo.user_type!=4){
        $('.container').hide();
        $.alert('用户信息错误');
        return false;
    }else if(userInfo.user_type==4){
        getProvince(userInfo.openid);
    }else if(userInfo.user_type==3){
        /*getOrderSource('云南省');*/
    }
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
                'getLocation',
                'openLocation'
            ]
        });
        wx.ready(function(){
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    if(userInfo.user_type ==3){
                        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        var speed = res.speed; // 速度，以米/每秒计
                        var accuracy = res.accuracy; // 位置精度
                        $('#lng').val(longitude);
                        $('#lat').val(latitude);
                        $.sendData('api','getAddressByLngLat',{lng:longitude,lat:latitude},'shipment',function(data){
                            var address;
                            var lng=$('#lng').val();
                            var lat=$('#lat').val();
                            var str=data.address;
                            var w=str.indexOf('特别行政区');
                            if(w==-1){
                                w=str.indexOf('市')+1;
                            }else{
                                w=str.indexOf('特别行政区')+5;
                            }
                            address=str.substring(0,w);
                            $('#address').val(address);
                            $('#address_text').html(address);
                            getOrderSource(address,lng,lat);
                        });
                    }

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
            var lng=$('#lng').val();
            var lat=$('#lat').val();
            var str=data.address;
            var w=str.indexOf('市')+1;
            addr=str.substring(0,w);
            /*$('#address').val(addr);
            $('#address_text').html(addr);*/
            /*getOrderSource(addr)*/;
        });
    });
}

//承运商获取货源列表
function getSourceByProvince(province) {
    if(curPageNo>5){
        return false;
    }
    //第一页先清
    $.sendData('shipment', 'getSourceByProvince', {province:province,openid:openid,pageNo:curPageNo,pageSize:pageSize}, 'Shipment', function(data){
        if(data.result.length > 0){
            curPageNo++;
            jdata=jdata.concat(data.result);
            _templete();
        }else{
            $('.express-delivery-list').html('<div class="weui_cells_tips null-notice">暂无货源</div>');
        }

    });
}

function _templete(){

    var _listhtml = _.template($('#orders-tmpl').html())();

    $('.my-waybill-list-container').html(_listhtml);
}
//获取关联基地货源出发省份
function getProvince(openid){
    $.sendData('shipment','getProvince',{openid:openid},'shipment',function(res){
        $('#province').html('');
        if(res){
            $.each(res, function(i, item) {
                var html='';
                html+='<option value="'+item.from_province+'">'+item.from_province+'</option>';
                /*html+= '<a href="javascript:;" style="margin-left:10px;" class="weui_btn weui_btn_mini weui_btn_default" onclick="getprovince('+i+')" id="p'+i+'">'+item.from_province+'</a>'*/
                $('#province').append(html);
            });
            $('#getProvince').show();
            pro=$('#province option:selected').val();
            getSourceByProvince(pro);
        }
    });
}
//承运商、司机获取货源详情
function getOrder(str){
    var id=str.split('_')[0];
    var status=str.split('_')[1];
    var usertype=$('#user_type').val();
    if(usertype==4){
        window.location.href = 'carrier_orderDetail.html?openid='+openid+'&id='+id;
    }else if(usertype==3){
        window.location.href = 'orderDetail.html?openid='+openid+'&id='+id;
    }

}

//司机获取当前省份货源
function getOrderSource(address,lng,lat){
    /*var address=$('#address').val();*/
    $('.driver').show();
    if(curPageNo>5){
        return false;
    }
    $.sendData('shipment','getOrderSource',{address:address,lng:lng,lat:lat,pageNo:curPageNo,pageSize:pageSize},'shipment',function(res){
        curPageNo ++;
        if(res.result.length > 0){
            jdata=jdata.concat(res.result);
            _templete();
        }else{
            $('.express-delivery-list').html('<div class="weui_cells_tips null-notice">暂无货源</div>');
        }

    });
}
//承运商货源以省份分组
$('#province').change(function(){
    pro=$('#province option:selected').val();
    curPageNo=1;
    loading = false;
    jdata=[];
    getSourceByProvince(pro);
});


$('.container').infinite().on("infinite", function() {
    if(loading) return;
    //翻页数据加载
    loading = true;
    var usertype=$('#user_type').val();
    if(jdata.length>=10){
        if(usertype==4){
            getSourceByProvince(pro);
        }else if(usertype==3){
            var address=$('#address').val();
            var lng=$('#lng').val();
            var lat=$('#lat').val();
            getOrderSource(address,lng,lat);
        }
    }

});