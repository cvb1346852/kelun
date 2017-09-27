//翻页标记
var curPageNo = 1;
var pageSize = 10;
//加载标记
var loading = false;
var status = "";

$.getUserInfo('shipment',0,function(){
    //微信ID
    openid = userInfo.openid;
    if(userInfo.user_type != 3 && userInfo.user_type != 4){
        $.error('无法取得用户信息');
        return false;
    }
    $(function(){
        $('.weui-navbar__item').on('click', function () {
            $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on');
            $('#pickup').html("");
            curPageNo = 1;
            status = $(this).attr("tab");
            getShipment(openid, curPageNo, pageSize,status);
        });
    });
    getShipment(openid, curPageNo, pageSize,status);

});
//滚动加载
$(document.body).infinite().on("infinite", function() {
    if(loading) return;
    //翻页数据加载
    loading = true;
    openid = userInfo.openid;
    getShipment(openid, curPageNo, pageSize,status);
});
//加载数据函数
function getShipment(openid, pageNo, pageSize,status) {
    var pageNo = pageNo ? pageNo : 1;
    var pageSize = pageSize ? pageSize : 10;
    //第一页先清除内容
    $.sendData('Shipment', 'getShipments', {openid: openid,  pageNo: pageNo, pageSize: pageSize,status:status,isPickUp : true}, 'Shipment', function(data){

        var shipments = data.result;
        if (shipments && shipments.length > 0) {
            //判断是否还有下一页
            if (data.pageNo * data.pageSize < data.totalCount) {
                console.log(data.pageNo * data.pageSize < data.totalCount);
                curPageNo += 1;
                loading = false;
            } else {
                loading = true;
                $('.weui-infinite-scroll').addClass('hide');
            }
            $.each(shipments, function(i, item) {
                    var html = '';
                    html+='<div class="changeui-weui-panel" id="'+ item.id +'"  onclick=detail("' + item.shipment_code + '","' + openid + '")>';
                    html+='<p class="changeui-list-title">目的地：'+item.tolocation+'</p>';
                    html+='<div class="weui-flex">';
                    html+='<div class="weui-flex__item">';
                    html+='<div class="weui-flex changeui-list-inner-item">';
                    html+='<div class="weui-flex__item text-right text-right-item">运输方式：</div>';
                    html+='<div class="weui-flex__item">'+item.shipment_method+'</div>';
                    html+='</div>';
                    html+='<div class="weui-flex changeui-list-inner-item">';
                    html+='<div class="weui-flex__item text-right text-right-item">件数：</div>';
                    html+='<div class="weui-flex__item">'+item.quality+'</div>';
                    html+='</div>';
                    html+='</div>';
                    html+='<div class="weui-flex__item">';
                    html+='<div class="weui-flex changeui-list-inner-item">';
                    html+='<div class="weui-flex__item text-right text-right-item">重量：</div>';
                    html+='<div class="weui-flex__item">'+item.weight+'</div>';
                    html+='</div>';
                    html+='<div class="weui-flex changeui-list-inner-item">';
                    html+='<div class="weui-flex__item text-right text-right-item">计划发车：</div>';
                    var plan_leave_time = item.plan_leave_time;
                    var ar = plan_leave_time.split(' ');
                    html+='<div class="weui-flex__item">'+ar[0]+'</div>';
                    html+='</div>';
                    html+='</div>';
                    html+='</div>';
                    html+='</div>';


                    /*if(item.status<8){
                        html+='<div class="pick-list">';
                    }
                    else{
                        html+='<div class="pick-list" style="background-color: #e0e0e0;">';
                    }
                    html+='<div class="weui-row row-pa">';
                    html+='<div class="weui-col-50 text-right">目的地</div>';
                    html+='<div class="weui-col-50 text-left">' + item.tolocation + '</div>';
                    html+='</div>';
                    html+='<div class="weui-row row-pa">';
                    html+='<div class="weui-col-50 text-right">运输方式</div>';
                    html+='<div class="weui-col-50 text-left">' + item.shipment_method + '</div>';
                    html+='</div>';
                    html+='<div class="weui-row row-pa">';
                    html+='<div class="weui-col-50 text-right">件数</div>';
                    html+='<div class="weui-col-50 text-left">' + item.quality + '</div>';
                    html+='</div>';
                    html+='<div class="weui-row row-pa">';
                    html+='<div class="weui-col-50 text-right">重量</div>';
                    html+='<div class="weui-col-50 text-left">' + item.weight + '</div>';
                    html+='</div>';
                    html+='<div class="weui-row row-pa">';
                    html+='<div class="weui-col-50 text-right">计划发车时间</div>';
                    html+='<div class="weui-col-50 text-left">' + item.plan_leave_time + '</div>';
                    html+='</div>';
                    html+='</div>';
                    html+='<div class="pick-show">';
                    html+='<div class="weui-row weui-no-gutter">';
                if(item.status<8) {
                    html += '<div class="weui-col-50 feature"><img src="./img/qr.svg"><p>进门扫码</p><a href="scan_check.html?openid=' + openid + '&scan_type=in'+ '&shipment_code=' + item.shipment_code + '"></a></div>';
                    html += '<div class="weui-col-50 feature"><img src="./img/qr.svg"><p>出门扫码</p><a href="scan_check.html?openid=' + openid + '&scan_type=out'+ '&shipment_code=' + item.shipment_code + '"></a></div>';
                    //html += '<div class="weui-col-25 feature"><img src="./img/tousu.svg"><p>事件上报</p><a href="./report.html?openid=' + openid + '&shipment_code=' + item.shipment_code + '"></a></div>';
                    //html += '<div class="weui-col-25 feature"><img src="./img/qianshou.png"><p>申请签收</p><a href="appRecived.html?openid=' + openid + '&shipment_code=' + item.shipment_code + '"></a></div>';
                }
                    html+='</div>'*/
                    $('#pickup').append(html);
                }
            );
        } else {
            $('#pickup').append('<div class="weui_cells_tips null-notice">暂无数据</div>');
            $('.weui-infinite-scroll').addClass('hide');
        }
    });
}

function applySign(openid,shipment_code){
    $.confirm("确定要提交申请吗?", "确定要提交申请吗?", function() {
        var data={};
        data.shipment_code= shipment_code;
        data.openid= openid;
        $.sendData('wechat','applicationReceived',data,'',function(json){
            if(json.code==0){
                $.toast("申请已经发出!");
            }else{
                $.toast("申请发送失败!");
            }
        });
    }, function() {
        //取消操作
    });
}
function detail(shipment_code, openid){
    window.location.href = "pickUpInfo.html?shipment_code="+shipment_code+"&openid="+openid;
}

