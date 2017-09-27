var openid = null;
var trucks;
var relation_id;
//获取用户openid
$.getUserInfo('shipment',0,function(){
    //微信ID;
    openid = userInfo.openid
    if(userInfo.user_type != 3 && userInfo.user_type != 4){
        $("#about").hide();
        $.alert("获取用户信息失败");
        return false;
    }else{
        user_type = userInfo.user_type;
        $.sendData('tender', 'searchEchart_count', {phone : userInfo.phone,openid: openid,user_type:user_type}, 'tender', function(data){
            tender_all=data.tender_all;
            tender =data.tender;
            tenderOk = data.tenderOk;
            relation_id = data.relation_id;
            // loadPie(tender_all,tender,tenderOk);
            getTrucks(userInfo.phone, 4, openid,user_type, curPageNo, pageSize,relation_id);
         });
    }
});
//加载底部菜单
buildFooter();
//翻页标记
var curPageNo = 1;
var pageSize = 10;
//加载标记
var loading = false;
//加载车源数据
//滚动加载
$('.container').infinite().on("infinite", function() {
    if(loading) return;
    //翻页数据加载
    loading = true;
    if(  trucks.length >10){
        getTrucks(userInfo.phone, 4, openid,user_type, curPageNo, pageSize,relation_id);
    }
});
//加载上方饼图
// function loadPie(tender_all,tender,tenderOk){
//     // 基于准备好的dom，初始化echarts实例
//     var myChart = echarts.init(document.getElementById('main'));
//     var myChart1 = echarts.init(document.getElementById('main1'));
//
//
//     option = {
//         tooltip: {
//             trigger: 'item',
//             formatter: "{a} <br/>{b}: {c} ({d}%)"
//         },
//         legend: {
//             orient: 'vertical',
//             x: 'left',
//             data:['投过的','总标']
//         },
//         series: [
//             {
//                 type:'pie',
//                 selectedMode: 'single',
//                 radius: [0, '10%'],
//
//                 label: {
//                     normal: {
//                         position: 'inner'
//                     }
//                 },
//                 labelLine: {
//                     normal: {
//                         show: false
//                     }
//                 },
//             },
//             {
//                 name:'访问来源',
//                 type:'pie',
//                 radius: ['20%', '40%'],
//
//                 data:[
//                     {value:tender, name:'投过的'},
//                     {value:tender_all, name:'总标'},
//                 ]
//             }
//         ]
//     };
//     option1 = {
//         tooltip: {
//             trigger: 'item',
//             formatter: "{a} <br/>{b}: {c} ({d}%)"
//         },
//         legend: {
//             orient: 'vertical',
//             x: 'left',
//            data:['投成功','投过的']
//         },
//         series: [
//             {
//                 type:'pie',
//                 selectedMode: 'single',
//                 radius: [0, '10%'],
//
//                 label: {
//                     normal: {
//                         position: 'inner'
//                     }
//                 },
//                 labelLine: {
//                     normal: {
//                         show: false
//                     }
//                 },
//             },
//             {
//                 name:'访问来源',
//                 type:'pie',
//                 radius: ['20%', '40%'],
//
//                 data:[
//                     {value:tenderOk, name:'投成功'},
//                     {value:tender, name:'投过的'},
//                 ]
//             }
//         ]
//     };
//     // 使用刚指定的配置项和数据显示图表。
//     myChart.setOption(option);
//     myChart1.setOption(option1);
// }
//加载数据函数
function getTrucks(phone,type,openid,user_type, pageNo, pageSize,relation_id) {
    var pageNo = pageNo ? pageNo : 1;
    var pageSize = pageSize ? pageSize : 10;
    var user_type = user_type;
    var relation_id = relation_id;
    //第一页先清除内容
    $.sendData('tender', 'search_wechat', {phone : phone,openid: openid,pageNo: pageNo, pageSize: pageSize,user_type : user_type,relation_id :relation_id}, '', function(data){
          trucks = data.result;
         /*if (pageNo == 1) $('.tab').html(' <table class="table"><th>招标时间</th><th>招标名称</th><th>招标价格</th><th>状态</th></table>');
        $('.weui-infinite-scroll').removeClass('hide');
        if ( trucks &&  trucks.length > 0) {
            //判断是否还有下一页
            if (data.pageNo * data.pageSize < data.totalCount) {
                curPageNo += 1;
                loading = false;
            } else {
                loading = true;
                $('.weui-infinite-scroll').addClass('hide');
            }
            $.each(trucks, function(i, item){
                item.weight = 1 ? "轻载" : "重载";
                if(item.tenderStatus == 4){
                    item.status = '废标';
                }else if(item.tenderStatus == 5){
                    item.status = '流标';
                }else{
                    switch (item.status) {
                        case '1':
                            item.status = '未中标';
                            break;
                        case '2':
                            item.status = '预中标';
                            break;
                        case '3':
                            item.status = '已中标';
                            break;
                    }
                }

                id = item.carnum;
                $('.table').append('<tr onclick=showTable("'+item.status+','+item.id+'")><td>'+item.create_time+'</td><td>'+item.tender_name+'</td><td>'+item.quote_price+'</td><td>'+item.status+'</td></tr>');
            });
        } else {
            $('.tab').html('<div class="weui_cells_tips null-notice">暂无投标信息</div>');
            $('.weui-infinite-scroll').addClass('hide');
            $('.echarts').addClass('hide');
        }*/
        if ( trucks &&  trucks.length > 0) {
            curPageNo++;
        $.each(trucks, function(i, item) {
            if(item.tenderStatus == 4){
                item.status = '废标';
            }else if(item.tenderStatus == 5){
                item.status = '流标';
            }else{
                switch (parseInt(item.status)) {
                    case 1:
                        item.status = '未中标';
                        break;
                    case 2:
                        item.status = '预中标';
                        break;
                    case 3:
                        item.status = '已中标';
                        break;
                }
            }
            var html='';
            html +='<div  class="changeui-weui-panel mybid-list-panel"  onclick=showTable("'+item.status+','+item.id+','+item.tender_quote_id+'")>';
            if(item.status == '已中标' && item.shipmentStatus == 3){
                html+='<p class="changeui-list-title">'+item.tender_name+' <em class="ci-font-ico">派</em></p>';
            }else{
                html+='<p class="changeui-list-title">'+item.tender_name+'</p>';
            }
            html+='<div class="weui-flex">';
            html+='<div class="weui-flex__item changeui-list-inner-item">';
            html+='<span class="text-right text-right-item">招标时间：</span>';
            html+='<span class="">'+item.create_time+'</span>';
            html+='</div>';
            html+=' <div class="weui-flex__item changeui-list-inner-item">';
            html+='<span class="text-right text-right-item">招标价格：</span>';
            html+='<span class="">'+item.quote_price+'元'+ (item.price_type == '1'?'/车':'/吨') +'</span>';
            html+='</div></div>';
            if(item.status != '已中标'){
                html+='<div class="list-item-mark-gray" id="statusColor">'+item.status+'</div>';
            }else{
                html+='<div class="list-item-mark" id="statusColor">'+item.status+'</div>';
            }
            html +='</div>';
            $('#tblMain').append(html);
        });
    }else{
        var html ='';
        html+='<div class="weui_cells_tips null-notice">暂无投标信息</div>';
        $('#tblMain').append(html);
    };
    });
};
function showTable(param){
    arr = param.split(",");
    if(arr[0] == "未中标"){
        $.toast("未中标，不能进行操作", "cancel");
        return;
    }else if(arr[0] == "预中标"){
        $.toast("预中标，不能进行操作", "cancel");
        return;
    }else if(arr[0] == "废标"){
        $.toast("废标，不能进行操作", "cancel");
        return;
    }else if(arr[0] == "流标"){
        $.toast("流标，不能进行操作", "cancel");
        return;
    }else{
        window.location.href = "tenderConfirm.html?tender_id="+arr[1]+"&openid="+openid+"&tender_quote_id="+arr[2];
    }
    $("#driver_phone").html(arr[1]);
}