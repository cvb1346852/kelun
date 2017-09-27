var jdata = [];
var phone;
var order_detail_info = '';
var volume = 0;
var weight = 0;
var quality = 0;
$.getUserInfo('consign',0,function(){
    openid = userInfo.openid;
    phone = userInfo.phone;
    if(userInfo.user_type!=1 && userInfo.user_type!=2 && userInfo.user_type!=5 ){
        $.alert('用户信息错误');
        return false;
    }
});
var  $androidDialog2 = $('#androidDialog2');
$(document).on('click','#order_detail_info', function(){
    $('#androidDialog2').show(true);
    $androidDialog2.fadeIn(200);
});

function closeDiv(){
    $('#androidDialog2').hide(true);
}

var urlParams = $.getUrlParams(window.location.search);
if (urlParams.order_id != undefined && urlParams.order_id != '') {
    $.sendData('order', 'checkoutDetail', {order_id:urlParams.order_id}, 'shipment', function(json){
        if (json) {
            var data=json.data;
            var order_code = urlParams.order_id;
            if (data) {
                jdata=data;
                if(data.order_product){
                    $.each(data.order_product,function(i,item){
                        /*order_detail_info += item.product_name+''+item.quality+''+item.unit_name+'/';*/
                        order_detail_info += item.serial +'&nbsp;'+ item.specification +'&nbsp;'+item.product_name +'&nbsp;'+item.quality+'<br/>' ;
                        weight = parseInt(weight) + parseFloat(item.weight);
                        volume =  parseInt(volume) + parseFloat(item.volume);
                        quality =  parseInt(quality) + parseFloat(item.quality);
                    });
                    jdata.order_detail_info = order_detail_info;
                }
                _templete();
                if(data.product){
                    $.each(data.product, function(i, item) {
                        $('#'+i).removeAttr("checked");
                    });
                }

            } else {
               $('#order_product_list').html('<div class="weui_cells_tips null-notice">暂无产品</div>');

            }
        } /*else {
            $.alert(json.msg);
            setTimeout(history.go(-1), 2000);
        }*/
    });
}/*else {
    $.alert('订单id未找到!');
    history.go(-1);
}*/
function _templete(){

    var _listhtml = _.template($('#orders-tmpl').html())();

    $('.container').html(_listhtml);
}
