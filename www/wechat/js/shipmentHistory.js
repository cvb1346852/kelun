//当前显示页面状态
var cur_show = 'arrival';
//翻页标记
var curPageNo = 1;
var pageSize = 10;
//加载标记
var loading = false;
//加载车源数据
var openid = '';
var keywords = "";
$.getUserInfo('consign',1,function(){
    //微信ID
    openid = userInfo.openid;
    if(userInfo.user_type != '5' && userInfo.user_type != '3'){
        $.error('无法取得用户信息');
        return false;
    }
    //搜索
    $(".weui-icon-search").on('click', function() {
        curPageNo = 1;
        loading = false;
        $('.tab-'+(cur_show)).html("");
        getShipment(openid, cur_show, curPageNo, pageSize);

    });
    getShipment(openid, cur_show, curPageNo, pageSize);
});

//滚动加载
$(document.body).infinite().on("infinite", function() {
    if(loading) return;
    //翻页数据加载
    loading = true;
    getShipment(openid, cur_show, curPageNo, pageSize);
});
//加载数据函数
function getShipment(openid, status, pageNo, pageSize) {
    var pageNo = pageNo ? pageNo : 1;
    var pageSize = pageSize ? pageSize : 10;
    var keywords = $("#keywords").val();
    //第一页先清除内容
    $.sendData('Shipment', 'getShipments', {openid: openid, status: status, pageNo: pageNo, pageSize: pageSize,keywords: keywords}, 'Shipment', function(data){
        var shipments = data.result;
        $('.weui-infinite-scroll').removeClass('hide');
        if (shipments && shipments.length > 0) {
            //判断是否还有下一页
            if (data.pageNo * data.pageSize < data.totalCount) {
                curPageNo += 1;
                loading = false;
            } else {
                loading = true;
                $('.weui-infinite-scroll').addClass('hide');
            }
            $.each(shipments, function(i, item){
                var plan_leave_time =item.plan_leave_time.substr(5);
                var plan_arrive_time =item.plan_arrive_time.substr(5);
                var plan_leave_time = item.plan_leave_time;
                var ar = plan_leave_time.split(' ');
                var html = '';
                html += '<div class="changeui-weui-panel">';
                html += '<div class="changeui-list-title">'+item.from_city+' - '+item.to_city+' <span class="history-mission-item-time">'+ar[0]+'</span></div>';
                html += '<div class="changeui-list-inner-item single">';
                html += '<span class="text-right text-right-item item">运单号：</span>';
                html += '<span class="single-right-item item">'+item.shipment_code+'</span>';
                html += '</div>';
                html += '<div class="changeui-list-inner-item single">';
                html += '<span class="text-right text-right-item item">货物重量：</span>';
                html += '<span class="single-right-item item">'+item.weight+'千克</span>';
                html += '</div>';

                html += '<div class="weui-flex">';
                html += '<div class="weui-flex__item">';
                html += '<div class="weui-flex changeui-list-inner-item">';
                html += '<div class="weui-flex__item text-right text-right-item">运输方式：</div>';
                html += '<div class="weui-flex__item">'+item.shipment_method+'</div>';
                html += '</div>';
                html += '</div>';
                html += '<div class="weui-flex__item">';
                html += '<div class="weui-flex changeui-list-inner-item">';
                html += '<div class="weui-flex__item text-right text-right-item">货物体积：</div>';
                html += '<div class="weui-flex__item">'+item.volume+'立方米</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
               /* html += '<div class="weui-flex">';
                html += '<div class="weui-flex__item">';
                html += '<div class="weui-flex changeui-list-inner-item">';
                html += '<div class="weui-flex__item text-right text-right-item">赔偿费用：</div>';
                html += '<div class="weui-flex__item">100元</div>';
                html += '</div>';
                html += '</div>';
                html += '<div class="weui-flex__item">';
                html += '<div class="weui-flex changeui-list-inner-item">';
                html += '<div class="weui-flex__item text-right text-right-item">实付运费：</div>';
                html += '<div class="weui-flex__item">400元</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';*/
                html += '</div>';
                $('.tab-'+(status)).append(html);

            });
        } else {
            $('.tab-'+(status)).html('<div class="weui_cells_tips null-notice">暂无数据</div>');
            $('.weui-infinite-scroll').addClass('hide');
        }
    });
}