var jdata=[];
var cheackOut = 1;
//加载标记
var loading = false;

var curPageNo = 1;
var pageSize = 10;
$.getUserInfo('consign',0,function(){
    //微信ID
    openid = userInfo.openid;
    if(userInfo.user_type == 2 || userInfo.user_type == 1){
        getOrderList(userInfo.phone, 1, curPageNo, pageSize);
    }else{
        $.error('未授权用户类型');
        $('.tab-'+(cur_show)).html('<div class="weui_cells_tips null-notice">暂无订单</div>');
        $('.weui-infinite-scroll').addClass('hide');
        return false;
    }
});

$(".weui-navbar__item").on('click', function() {
    jdata=[];
    $('.express-delivery-list').html('');
    $.showLoading('订单加载中，请稍等...');
    $('.weui-navbar__item').removeClass('weui-bar__item_on');
    $(this).addClass('weui-bar__item_on');
    var cur_show = $(this).text().trim() == '未签收' ? 1:2;
         cheackOut = cur_show;
    //初始化显示参数
    curPageNo = 1;
    loading = false;

    getOrderList(userInfo.phone, cur_show, curPageNo, pageSize);
});

function getOrderList(to_phone, cur_show, pageNo, pageSize) {
    var pageNo = pageNo ? pageNo : 1;
    var pageSize = pageSize ? pageSize : 10
    $.sendData('order', 'orderList', {to_phone: to_phone, checkout: cur_show,  pageNo: pageNo, pageSize: pageSize}, '', function(json){
        $.hideLoading();
        if(json.data.result.length > 0){
            jdata = jdata.concat(json.data.result);
            curPageNo ++;
            jdata.checkoutIn  = json.data.checkoutIn ? '未签收':'已签收';

            if(json.data.checkoutIn){
                $("#img").attr('src','');
                jdata.cheackOut = 'block';
                jdata.singTimestatus = 'none';
            }else{
                jdata.singTimestatus = 'block';
                jdata.cheackOut = 'none';
            }
            _templete();
        }else{
            if(json.data.totalCount < 1){
                $('.express-delivery-list').html('<div class="weui_cells_tips null-notice">暂无订单</div>');
            }
        }
    });
};

function _templete(){
   
    var _listhtml = _.template($('#orders-tmpl').html())();

    $('.express-delivery-list').html(_listhtml);
}
// 1-等待调度，2-竞标中，3-已中标，4-已调度，5-取货在途，6-装货，7-在途，8-正常签收，9-异常签收，10签收确认
var _orderStatsus = {'st1':'等待调度','st2':'竞标中','st3':'已中标','st4':'已调度','st5':'取货在途','st6':'装货','st7':'在途','st8':'正常签收','st9':'异常签收','st10':'签收确认'};
function _getOrderStatusText(i){
    return _orderStatsus['st'+i];
}

//滚动加载
$('.express-delivery-list').infinite().on("infinite", function() {
    if(loading) return;
    //翻页数据加载
    loading = true;
    if(jdata.length >= 10){
        getOrderList(userInfo.phone, cheackOut, curPageNo, pageSize);
    }

});

function detail(params){
    // order_id = Number(order_id);
    // checkout = Number(checkout);
    paramsArr = params.split(',');
    order_id = paramsArr['0'];
    checkout = paramsArr['1'];
    order_code = paramsArr['2'];
    if (checkout == 1) {
        window.location.href = "orderReceipt.html?openid="+openid+"&order_id="+order_id+"&order_code="+order_code;
    } else {
        window.location.href = "orderReceiptDetail.html?openid="+openid+"&order_id="+order_id+"&order_code="+order_code;
    }
}