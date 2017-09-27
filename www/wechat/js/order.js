var openid = '';
var cur_show = 1;

//翻页标记
var curPageNo = 1;
var pageSize = 10;
//加载标记
var loading = false;

//切换页面加载数据
$(".weui_navbar_item").on('click', function() {
    $(".weui_bar_item_on").removeClass('weui_bar_item_on');
    $(this).addClass('weui_bar_item_on');
    //显示的面板
    var show = $(this).attr('tab');
    if (cur_show != show) {
        cur_show = show;
        hide = show == 1 ? 2 : 1;
        $(".tab-"+show).removeClass('hide');
        $('.tab-'+show).html('');
        $('.weui-infinite-scroll').removeClass('hide');
        $(".tab-"+hide).addClass('hide');
        //初始化显示参数
        curPageNo = 1;
        loading = false;
        // 加载数据

        $.getUserInfo('consign',1,function(){
            //微信ID
            openid = userInfo.openid;
            if(userInfo.user_type != 5){
                $.error('无法取得用户信息');
                return false;
            }
            getOrderList(cur_show, openid, curPageNo, pageSize);
        });


    }
});

function getOrderList(cur_show, openid, pageNo, pageSize) {

    var pageNo = pageNo ? pageNo : 1;
    var pageSize = pageSize ? pageSize : 10

    //第一页先清除内容
    $.sendData('order', 'dispatchOrderList', {checkout: cur_show, openid: openid,  pageNo: pageNo, pageSize: pageSize}, '', function(json){
        if (json.code == 0) {
            var data = json.data;
            var orders = data.result;
            if (orders.length > 0) {
                //判断是否还有下一页
                if (data.pageNo * data.pageSize < data.totalCount) {
                    curPageNo += 1;
                    loading = false;
                } else {
                    loading = true;
                    $('.weui-infinite-scroll').addClass('hide');
                }
                $.each(orders, function(i, item){
                    var html = '';
                    html += '<div class="weui-row weui-no-gutter order-item" id="'+ item.id +'">';
                    html += '<div class="weui-col-33 truck-source">';
                    html += '<h5>'+ item.carrier_name +'</h5>';
                    html += '<h5>'+ item.carnum +'/'+ item.shipment_method +'</h5>';
                    html += '</div>';
                    html += '<div class="weui-col-66">';
                    html += '<div class="order-detail">';
                    html += '<h4>订单号：'+ item.order_code +'|';

                    // 1-等待调度，2-竞标中，3-已中标，4-已调度，5-取货在途，6-装货，7-在途，8-正常签收，9-异常签收，10签收确认
                    var trafficStatusHtml = '';
                    if (item.traffic_status == 1) {
                        trafficStatusHtml = '等待调度';
                    }
                    if (item.traffic_status == 2) {
                        trafficStatusHtml = '竞标中';
                    }
                    if (item.traffic_status == 3) {
                        trafficStatusHtml = '已中标';
                    }
                    if (item.traffic_status == 4) {
                        trafficStatusHtml = '已调度';
                    }
                    if (item.traffic_status == 5) {
                        trafficStatusHtml = '取货在途';
                    }
                    if (item.traffic_status == 6) {
                        trafficStatusHtml = '装货';
                    }
                    if (item.traffic_status == 7) {
                        trafficStatusHtml = '在途';
                    }
                    if (item.traffic_status == 8) {
                        trafficStatusHtml = '正常签收';
                    }
                    if (item.traffic_status == 9) {
                        trafficStatusHtml = '异常签收';
                    }
                    if (item.traffic_status == 10) {
                        trafficStatusHtml = '签收确认';
                    }

                    html += trafficStatusHtml + '/';

                    var checkoutHtml = '';
                    if (item.checkout == 1) {
                        checkoutHtml = '未签收';
                    }
                    if (item.checkout == 2) {
                        checkoutHtml = '已签收';
                    }
                    if (item.checkout == 3) {
                        checkoutHtml = '异常签收';
                    }
                    if (item.checkout == 4) {
                        checkoutHtml = '签收处理';
                    }
                    if (item.checkout == 5) {
                        checkoutHtml = '签收确认';
                    }
                    html += checkoutHtml + '</h4>';
                    html += '<p>出发地：'+ item.from_name +'</p>';
                    html += '<p>目的地：'+ item.to_name +'</p>';
                    html += '<h4>收货：'+ item.to_phone +'</h4>';
                    html += '</div>';
                    html += '</div>';
                    html += '<div class="weui-col-100 order-discrib">';
                    html += '<div class="weui-row weui-no-gutter"><div class="order-discrib-left">审核通过：</div><div class="order-discrib-right">'+ item.departure_time +'</div></div>';
                    html += '<div class="weui-row weui-no-gutter"><div class="order-discrib-left">实际出发/到达：</div><div class="order-discrib-right">'+ item.leavewh_time +'--'+item.checkout_time+'</div></div>';
                    html += '<div class="weui-row weui-no-gutter"><div class="order-discrib-left">申请签收：</div><div class="order-discrib-right">'+ item.to_phone +'</div></div>';
                    html += '<div class="weui-row weui-no-gutter"><div class="order-discrib-left">实际签收：</div><div class="order-discrib-right">'+ item.user_phone +'</div></div>';
                    html += '</div>';

                    html += '</div>';
                    $('.tab-'+(cur_show)).append(html);
                });
            } else {
                $('.tab-'+(cur_show)).html('<div class="weui_cells_tips null-notice">暂无订单</div>');
                $('.weui-infinite-scroll').addClass('hide');
            }
        } else {
            $('.weui-infinite-scroll').addClass('hide');
            $.alert(json.msg);
            $('.tab-'+(cur_show)).html('<div class="weui_cells_tips null-notice">'+ json.msg +'</div>');
        }
    });
}
function detail(order_id, checkout){
    order_id = Number(order_id);
    checkout = Number(checkout);
    if (checkout == 1) {
        window.location.href = "orderReceipt.html?order_id="+order_id;
    } else {
        window.location.href = "orderReceiptDetail.html?order_id="+order_id;
    }


}


//滚动加载
$(document.body).infinite().on("infinite", function() {
    if(loading) return;
    //翻页数据加载
    loading = true;
    openid = userInfo.openid;

    if(userInfo.user_type != 5){
        $.error('无法取得用户信息');
        return false;
    }
    getOrderList(cur_show, openid, curPageNo, pageSize);

});


function showLoading(){
    $.showLoading('正在加载中...');
}

$.getUserInfo('consign',1,function(){
    //微信ID
    openid = userInfo.openid;
    if(userInfo.user_type != 5){
        $.error('无法取得用户信息');
        return false;
    }
    getOrderList( 1, openid, curPageNo, pageSize);
});

