//加载底部菜单
buildFooter();
//当前显示页面状态
var cur_show = 'onway';
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
    if(userInfo.user_type != '5'){
        $.error('无法取得用户信息');
        return false;
    }
    //切换页面加载数据
    $(".weui-navbar__item").on('click', function() {
        $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on');
        curPageNo = 1;
        loading = false;
        $("#keywords").val("");
        cur_show = $(this).attr("tab");
        $('.tab-onway').addClass('hide');
        $('.tab-arrival').addClass('hide');
        $('.tab-'+(cur_show)).html("");
        $('.tab-'+(cur_show)).removeClass('hide');
        getShipment(openid, cur_show, curPageNo, pageSize);

    });
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
                var html = '';
                html += '<div class="changeui-weui-panel bid-car-detail-container" id="'+ item.id +'"  onclick=detail("' + item.shipment_code + '","' + openid + '")>';
                html += '<p class="changeui-list-title">运单号:'+item.shipment_code+' </p>';
                html += '<p class="normal-tip" style="padding-left:16px;">'+item.carrier_name+' '+item.carnum+'/'+item.shipment_method+'</p>';
                html += '<div class="changeui-signle-line" style="margin-left:10px; margin-right:10px;"></div>';

                html += '<div class="changeui-list-inner-item single">';
                html += '<span class="text-right text-right-item item">出发地：</span>';
                html += '<span class="single-right-item item">'+item.fromlocation+'</span>';
                html += '</div>';
                html += '<div class="changeui-list-inner-item single">';
                html += '<span class="text-right text-right-item item">目的地：</span>';
                html += '<span class="single-right-item item">'+item.tolocation+'</span>';
                html += '</div>';

                html += '<div class="changeui-signle-line" style="margin-left:10px; margin-right:10px;"></div>';

                html += '<div class="changeui-list-inner-item single">';
                html += '<span class="text-right text-right-item item">计划发车：</span>';
                html += '<span class="single-right-item item">'+item.plan_leave_time+'</span>';
                html += '</div>';

                html += '<div class="changeui-list-inner-item single">';
                html += '<span class="text-right text-right-item item">到达发车：</span>';
                html += '<span class="single-right-item item">'+item.plan_arrive_time+'</span>';
                html += '</div>';

                html += '<div class="weui-cell_access">';
                html += '<span class="weui-cell__ft"></span>';
                html += '</div>';
                html += '</div>';
                /*html += '<div class="changeui-weui-panel" id="'+ item.id +'"  onclick=detail("' + item.shipment_code + '","' + openid + '")>';
                html += '<p class="changeui-list-title">目的地：'+item.tolocation+'</p>';
                html += '<div class="weui-flex">';
                html += '<div class="weui-flex__item">';
                html += '<div class="weui-flex changeui-list-inner-item">';
                html += '<div class="weui-flex__item text-right text-right-item">运输方式：</div>';
                html += '<div class="weui-flex__item">'+item.shipment_method+'</div>';
                html += '</div>';
                html += '<div class="weui-flex changeui-list-inner-item">';
                html += '<div class="weui-flex__item text-right text-right-item">件数：</div>';
                html += '<div class="weui-flex__item">'+item.quality+'</div>';
                html += '</div>';
                html += '</div>';
                html += '<div class="weui-flex__item">';
                html += '<div class="weui-flex changeui-list-inner-item">';
                html += '<div class="weui-flex__item text-right text-right-item">重量：</div>';
                html += '<div class="weui-flex__item">'+item.weight+'</div>';
                html += '</div>';
                html += '<div class="weui-flex changeui-list-inner-item">';
                html += '<div class="weui-flex__item text-right text-right-item">计划发车：</div>';
                var plan_leave_time = item.plan_leave_time;
                var ar = plan_leave_time.split(' ');
                html += '<div class="weui-flex__item">'+ar[0]+'</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';*/
                $('.tab-'+(status)).append(html);
                /*if(status == 'onway'){
                    var html = '';
                    html += '<div class="weui-row weui-no-gutter order-item" id="'+ item.id +'"  onclick=detail("' + item.shipment_code + '","' + openid + '")>';
                    html += '<div class="weui-col-33 truck-source">';
                    html += '<h5>'+ item.carrier_name +'</h5>';
                    html += '<h5>'+ item.carnum +'/'+ item.shipment_method +'</h5>';
                    html += '</div>';
                    html += '<div class="weui-col-66">';
                    html += '<div class="order-detail">';
                    html += '<h4>运单号：'+ item.shipment_code +'</h4>';
                    html += '<p>出发地：'+ item.fromlocation+'</p>';
                    html += '<p>目的地：'+ item.tolocation +'</p>';
                    html += '<h4>计划发车：'+ item.plan_leave_time +'</h4>';
                    html += '<h4>计划到达：'+ item.plan_arrive_time +'</h4>';
                    html += '</div>';
                    html += '</div>';

                    html += '</div>';
                    html += '</div>';

                    $('.tab-'+(status)).append(html);
                }
                else if(status == 'arrival'){
                    var html = '';
                    html += '<div class="weui-row weui-no-gutter order-item" id="'+ item.id +'"  onclick=detail("' + item.shipment_code + '","' + openid + '")>';
                    html += '<div class="weui-col-33 truck-source">';
                    html += '<h5>'+ item.carrier_name +'</h5>';
                    html += '<h5>'+ item.carnum +'/'+ item.shipment_method +'</h5>';
                    html += '</div>';
                    html += '<div class="weui-col-66">';
                    html += '<div class="order-detail">';
                    html += '<h4>运单号：'+ item.shipment_code +'</h4>';
                    html += '<p>出发地：'+ item.fromlocation+'</p>';
                    html += '<p>目的地：'+ item.tolocation +'</p>';
                    html += '<h4>计划发车：'+ item.plan_leave_time +'</h4>';
                    html += '<h4>计划到达：'+ item.plan_arrive_time +'</h4>';
                    html += '</div>';
                    html += '</div>';

                    html += '</div>';
                    html += '</div>';
                    $('.tab-'+(status)).append(html);
                }*/
            });
        } else {
            $('.tab-'+(status)).html('<div class="weui_cells_tips null-notice">暂无数据</div>');
            $('.weui-infinite-scroll').addClass('hide');
        }
    });
}

function detail(shipment_code, openid){
    window.location.href = "shipmentInfo.html?shipment_code="+shipment_code+"&openid="+openid;
}