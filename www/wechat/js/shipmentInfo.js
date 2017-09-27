
var urlParams = $.getUrlParams(window.location.search);
var openid = '';
var shipment_code = urlParams.shipment_code;

//加载数据函数
function getShipment(openid, shipment_code) {
    $.sendData('Shipment', 'getShipmentInfo', {openid: openid, shipment_code: shipment_code}, 'Shipment', function(data){
        var shipments = data;
        $('.weui-infinite-scroll').removeClass('hide');

        var plan_leave_time =data.plan_leave_time.substr(5);
        var plan_arrive_time =data.plan_arrive_time.substr(5);
        var html = '';
        html += '<div class="changeui-weui-panel bid-car-detail-container">';
        html += '<p class="changeui-list-title">运单号:'+data.shipment_code+' </p>';
        html += '<p class="normal-tip" style="padding-left:16px;">'+data.carrier_name+' '+data.carnum+'/'+data.shipment_method+'</p>';
        html += '<div class="changeui-signle-line" style="margin-left:10px; margin-right:10px;"></div>';

        html += '<div class="changeui-list-inner-item single">';
        html += '<span class="text-right text-right-item item">出发地：</span>';
        html += '<span class="single-right-item item">'+data.fromlocation+'</span>';
        html += '</div>';
        html += '<div class="changeui-list-inner-item single">';
        html += '<span class="text-right text-right-item item">目的地：</span>';
        html += '<span class="single-right-item item">'+data.tolocation+'</span>';
        html += '</div>';

        html += '<div class="changeui-signle-line" style="margin-left:10px; margin-right:10px;"></div>';

        html += '<div class="changeui-list-inner-item single">';
        html += '<span class="text-right text-right-item item">计划发车：</span>';
        html += '<span class="single-right-item item">'+data.plan_leave_time+'</span>';
        html += '</div>';

        html += '<div class="changeui-list-inner-item single">';
        html += '<span class="text-right text-right-item item">到达发车：</span>';
        html += '<span class="single-right-item item">'+data.plan_arrive_time+'</span>';
        html += '</div>';

        html += '<div class="weui-cell_access">';
        html += '<span class="weui-cell__ft"></span>';
        html += '</div>';
        html += '</div>';


        html += '<div class="times">';
        html += '<ul>';
        html += '<b class="head-mask"></b>';

        if(data.shipment_method != '零担'){
        html += '<li>';
        html += '<b class="act"></b>';
        html += '<span class="title act">当前位置</span>';
            var d = new Date(new Date().getTime());
            var nowtime = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes();//+":"+d.getSeconds();
        html += '<p class="act"><span class="time">'+nowtime+'</span><span class="desc">货物到达'+data.address+'</span></p>';
        html += '<i></i>';
        html += '</li>';
        }
        /*html += '<li>';
        html += '<b class="act"></b>';
        html += '<span class="title act">进厂</span>';
        html += '<p class="act"><span class="time">'+data.arrivewh_time+'</span><span class="desc">进厂</span></p>';
        html += '<i></i>';
        html += '</li>';
        if (data.report.length == 0) {
            html += '<li class="none-border">';
        }
        html += '<b class="act"></b>';
        html += '<span class="title act">出厂</span>';
        html += '<p class="act"><span class="time">'+data.leavewh_time+'</span><span class="desc">出厂</span></p>';
        html += '<i></i>';
        html += '</li>';*/
        $.each(data.report, function(i, item) {
            var report_type = '';
            if (item.report_type == 1) {
                report_type = '转包上报';
            }
            if (item.report_type == 2) {
                report_type = '天气';
            }
            if (item.report_type == 3) {
                report_type = '堵车';
            }
            if (item.report_type == 4) {
                report_type = '修路';
            }
            if (item.report_type == 5) {
                report_type = '查车';
            }
            if (item.report_type == 6) {
                report_type = '修车';
            }
            if (item.report_type == 7) {
                report_type = '签收';
            }
            if (item.report_type == 8) {
                report_type = '其他';
            }
            if (item.report_type == 10) {
                report_type = '进场';
            }
            if (item.report_type == 11) {
                report_type = '出场';
            }
            if (data.report.length == i){
                html += '<li class="none-border">';
            }
            html += '<b class="act"></b>';
            html += '<span class="title act">'+report_type+'</span>';
            html += '<p class="act"><span class="time">'+item.create_time+'</span><span class="desc">'+item.report_desc+'</span></p>';
            html += '<i></i>';
            html += '</li>';
        });
        $('.my-bid-new-list').append(html);

    });
}

$.getUserInfo('consign',0,function(){
    //微信ID
    openid = userInfo.openid;
    if(userInfo.user_type != 5){
        $.error('无法取得用户信息');
        return false;
    }
    getShipment(openid, shipment_code);
});

function getAddress(carnum,driver_phone,type){
    $.sendData('Shipment', 'getAddress', {carnum: carnum, driver_phone: driver_phone, type: type}, 'Shipment', function(data){
        if(data.msg.code == 0){
            $("#address").html('当前位置:'+data.msg.msg);
        }
        else{
            $.error(data.msg.msg);
            return false;
        }

    });
}