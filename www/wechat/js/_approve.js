var openid = null;
//获取用户openid
$.getUserInfo('consign',0,function(){
    //微信ID;
    openid = userInfo.openid
    if(userInfo.user_type != 6){
        $("#about").hide();
        $.alert("获取用户信息失败");
        return false;
    }else{
        getTrucks(userInfo.phone, 4, openid,userInfo.user_type, curPageNo, pageSize);
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
$(document.body).infinite().on("infinite", function() {
    if(loading) return;    //翻页数据加载
    loading = true;
    getTrucks(userInfo.phone, 4, openid, curPageNo, pageSize);
});
//加载数据函数
function getTrucks(phone,type,openid,user_type, pageNo, pageSize) {
    var pageNo = pageNo ? pageNo : 1;
    var pageSize = pageSize ? pageSize : 10;
    var user_type = user_type;
    //第一页先清除内容
    $.sendData('tender', 'getApproveList', {phone : phone,openid: openid,pageNo: pageNo, pageSize: pageSize,user_type : user_type}, 'tender', function(data){
        var trucks = data.result;
        if (pageNo == 1) $('.tab').html(' <table class="table"><th>价格</th><th>招标名称</th><th width="30%">发车时间</th><th>状态</th></table>');
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
                if(item.status == 1){
                    item.status = "未通过";
                }else if(item.status == 2){
                    item.status = "已通过";
                }else if(item.status == 3){
                    item.status = "未审核";
                }
                id = item.carnum;
                $('.table').append('<tr onclick=showTable("'+item.status+','+item.tender_id+','+item.quote_id+','+item.id+'")><td>'+item.quote_price+'</td><td>'+item.tender_name+'</td><td>'+item.plan_leave_time+'</td><td>'+item.status+'</td></tr>');
            });
        } else {
            $('.tab').html('<div class="weui_cells_tips null-notice">暂无投标信息</div>');
            $('.weui-infinite-scroll').addClass('hide');
        }
    });
};
function showTable(param){
    arr = param.split(",")
    if(arr[0] != "未审核"){
        $.toast("审核已经完成，不能进行操作", "cancel");
        return;
    }else{
        window.location.href = "retify.html?tender_id="+arr[1]+"&quote_id="+arr[2]+"&openid="+openid+"&tender_audit_id="+arr[3];
    }
}