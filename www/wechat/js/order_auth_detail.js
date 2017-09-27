var urlParams = $.getUrlParams(window.location.search);

if(urlParams.order_id == '' || urlParams.order_id == undefined){
    $.error('未知订单信息');
}
//加载订单数据
var openid = '';
var order_id = urlParams.order_id;
var auth_status = parseInt(urlParams.auth_status);
var orderInfo = [];
var author_history = [];

//加载数据函数
function getOrderInfo(openid) {
    //第一页先清除内容
    $.sendData('order', 'getOrders', {openid: openid, order_id:urlParams.order_id,auth_status:auth_status,type: 1}, '', function(json){
        if (json.code == 0) {
            var data = json.data;
            if(data.result.length > 0 ){
                orderInfo = data.result[0];
                author_history = JSON.parse(orderInfo.author_history);
                var _listhtml = _.template($('#orderInfo_tmpl').html())();
                $('.authority-container').html(_listhtml);
            } else {
                $('.authority-container').html('<div class="weui_cells_tips null-notice">暂无订单</div>');
            }
        } else {
            $('.authority-container').html('<div class="weui_cells_tips null-notice">暂无订单'+ json.msg +'</div>');
        }
    });
}

//授权操作
function auth(){
    var phone = $('#phone').val();
    var name = $('#name').val();
    if (name == '' || name == undefined) {
        $.alert('请输入姓名');
    }else if(phone == ''){
        $.alert('请输入手机号码');
    } else {
        $.showLoading();
        //保存数据
        var params = {
            openid : openid,
            phone  : phone,
            order_id : order_id,
            auth_status : 1,
            name : name
        };
        $.sendData('order', 'orderAuth', params, '', function(json){
            $.hideLoading();
            if (json.code == 1) {
                $.alert(json.msg);
            } else {
                $.toast("授权成功", function() {
                    author_history.push({time:json.msg.time,content:json.msg.content});
                    var _listhtml = _.template($('#orderInfo_tmpl').html())();
                    $('.authority-container').html(_listhtml);
                    $('#phone').val('');
                    $('#name').val('');
                });

            }
        });
    }
}

$(function(){
    $.getUserInfo('consign',0,function(){
        if(userInfo.openid == '' || userInfo.openid == undefined){
            $.error('无法取得用户信息');
        }else{
            openid = userInfo.openid;
            getOrderInfo(openid);
        }

    });
})




